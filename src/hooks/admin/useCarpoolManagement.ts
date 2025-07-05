import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { assignCarpools, getAssignmentStats, exportAssignmentsCSV, type RideSignup, type AssignmentResult } from '@/lib/carpoolAlgorithm';
import { PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export interface RideSignupAdmin {
  id: string;
  name: string;
  phone: string;
  canDrive: string;
  location: string;
  aftereventWeek: string;
  submittedAt: string;
  capacity?: string;
}

/**
 * Interface for carpool assignments stored in Firestore
 */
export interface CarpoolAssignmentDoc {
  id: string;
  week: string;
  assignments: AssignmentResult;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Custom hook for managing carpool signups and assignments
 * 
 * This hook provides comprehensive functionality for:
 * - Fetching and managing ride signups from Firestore
 * - Filtering signups by afterevent week
 * - Generating carpool assignments using the algorithm
 * - Drag-and-drop editing of assignments
 * - Exporting data to CSV format
 * 
 * @returns {Object} Object containing state and functions for carpool management
 * @returns {RideSignupAdmin[]} returns.signups - All ride signups
 * @returns {boolean} returns.loading - Loading state for async operations
 * @returns {string|null} returns.error - Error message if any
 * @returns {string} returns.selectedWeek - Currently selected afterevent week
 * @returns {Function} returns.setSelectedWeek - Function to update selected week
 * @returns {string[]} returns.weeks - Available afterevent weeks
 * @returns {RideSignupAdmin[]} returns.filteredSignups - Signups filtered by selected week
 * @returns {Function} returns.exportCSV - Function to export signups to CSV
 * @returns {AssignmentResult|null} returns.assignments - Current carpool assignments
 * @returns {boolean} returns.showAssignments - Whether to show assignments view
 * @returns {Function} returns.setShowAssignments - Function to toggle assignments view
 * @returns {AssignmentResult|null} returns.editingAssignments - Assignments being edited
 * @returns {boolean} returns.isEditing - Whether in edit mode
 * @returns {boolean} returns.saving - Whether assignments are being saved
 * @returns {string|null} returns.activeId - ID of currently dragged item
 * @returns {any} returns.sensors - DnD sensors configuration
 * @returns {Function} returns.testAssignment - Function to generate assignments
 * @returns {Function} returns.startEditing - Function to start editing mode
 * @returns {Function} returns.cancelEditing - Function to cancel editing
 * @returns {Function} returns.saveAssignments - Function to save assignments
 * @returns {Function} returns.handleDragStart - DnD drag start handler
 * @returns {Function} returns.handleDragEnd - DnD drag end handler
 * @returns {Function} returns.exportAssignments - Function to export assignments to CSV
 * @returns {Function} returns.getAssignmentStats - Function to get assignment statistics
 * @returns {Function} returns.fetchSignups - Function to refresh signups
 * @returns {Function} returns.deleteAssignments - Function to delete assignments
 * @returns {Function} returns.loadAssignments - Function to load assignments
 */
export function useCarpoolManagement() {
  const [signups, setSignups] = useState<RideSignupAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [assignments, setAssignments] = useState<AssignmentResult | null>(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [editingAssignments, setEditingAssignments] = useState<AssignmentResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Parses an afterevent week label into quarter and week numbers
   * 
   * @param {string} label - Week label in format "Fall Week 1", "Winter Week 2", etc.
   * @returns {Object} Object containing quarter and week numbers
   * @returns {number} returns.quarter - Quarter number (0=Fall, 1=Winter, 2=Spring)
   * @returns {number} returns.week - Week number within the quarter
   * 
   * @example
   * parseWeekLabel("Fall Week 3") // Returns { quarter: 0, week: 3 }
   * parseWeekLabel("Winter Week 1") // Returns { quarter: 1, week: 1 }
   */
  function parseWeekLabel(label: string): { quarter: number; week: number } {
    const match = label.match(/^(Fall|Winter|Spring) Week (\d{1,2})$/);
    if (!match) return { quarter: -1, week: -1 };
    const quarterOrder: Record<string, number> = { Fall: 0, Winter: 1, Spring: 2 };
    return { quarter: quarterOrder[match[1]], week: parseInt(match[2], 10) };
  }

  /**
   * Fetches all ride signups from Firestore and sets the default selected week
   * 
   * This function:
   * - Retrieves all documents from the 'rideSignups' collection
   * - Converts Firestore documents to RideSignupAdmin objects
   * - Automatically selects the most recent week as default
   * - Handles errors gracefully with user-friendly messages
   * 
   * @async
   * @throws {Error} When Firestore query fails
   */
  const fetchSignups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, 'rides'));
      const signupsData: RideSignupAdmin[] = [];
      querySnapshot.forEach((doc) => {
        signupsData.push({ id: doc.id, ...doc.data() } as RideSignupAdmin);
      });
      setSignups(signupsData);
      // Set default week to most recent by quarter/week order
      const weeks = Array.from(new Set(signupsData.map(s => s.aftereventWeek).filter(Boolean)));
      if (weeks.length > 0) {
        const sorted = weeks.slice().sort((a, b) => {
          const pa = parseWeekLabel(a);
          const pb = parseWeekLabel(b);
          if (pa.quarter !== pb.quarter) return pa.quarter - pb.quarter;
          return pa.week - pb.week;
        });
        setSelectedWeek(sorted[sorted.length - 1]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch signups');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads existing carpool assignments from Firestore for the selected week
   * 
   * This function retrieves saved assignments from the 'carpoolAssignments' collection
   * and updates the local state. It's called when the selected week changes or
   * when the component mounts.
   * 
   * @async
   * @throws {Error} When Firestore query fails
   */
  const loadAssignments = useCallback(async () => {
    if (!selectedWeek) {
      setAssignments(null);
      setEditingAssignments(null);
      return;
    }

    try {
      const docSnap = await getDocs(collection(db, 'carpoolAssignments'));
      
      // Find the document for the selected week
      const assignmentDoc = docSnap.docs.find(doc => doc.data().week === selectedWeek);
      
      if (assignmentDoc) {
        const data = assignmentDoc.data() as CarpoolAssignmentDoc;
        setAssignments(data.assignments);
        setEditingAssignments(data.assignments);
        setShowAssignments(true);
      } else {
        // No saved assignments for this week
        setAssignments(null);
        setEditingAssignments(null);
        setShowAssignments(false);
      }
    } catch (err: any) {
      console.error('Error loading assignments:', err);
      setError(err.message || 'Failed to load assignments');
    }
  }, [selectedWeek]);

  useEffect(() => {
    fetchSignups();
  }, [fetchSignups]);

  // Load assignments when selected week changes
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Get unique afterevent weeks for filter dropdown
  const weeks = Array.from(new Set(signups.map(s => s.aftereventWeek).filter(Boolean)));
  // Sort weeks by actual quarter/week order for dropdown
  const sortedWeeks = weeks.slice().sort((a, b) => {
    const pa = parseWeekLabel(a);
    const pb = parseWeekLabel(b);
    if (pa.quarter !== pb.quarter) return pa.quarter - pb.quarter;
    return pa.week - pb.week;
  });
  const filtered = selectedWeek ? signups.filter(s => s.aftereventWeek === selectedWeek) : signups;

  /**
   * Exports filtered signups to CSV format and triggers download
   * 
   * Creates a CSV file with headers and signup data, then automatically
   * downloads it with a filename based on the selected week.
   * 
   * @param {RideSignupAdmin[]} filtered - Signups to export (filtered by week)
   * @param {string} selectedWeek - Currently selected week for filename
   * 
   * @example
   * exportCSV() // Downloads "rides-Fall Week 1.csv"
   */
  const exportCSV = useCallback(() => {
    const headers = ["Name", "Phone", "Can Drive", "Capacity", "Location", "Afterevent Week", "Submitted At"];
    const rows = filtered.map(s => [s.name, s.phone, s.canDrive, s.capacity ?? "", s.location, s.aftereventWeek, s.submittedAt]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${(x ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rides-${selectedWeek || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered, selectedWeek]);

  /**
   * Generates carpool assignments for the selected week using the algorithm
   * 
   * This function:
   * - Validates that a week is selected
   * - Converts RideSignupAdmin objects to RideSignup format
   * - Calls the carpool assignment algorithm
   * - Updates state with the assignment results
   * - Shows the assignments view
   * 
   * @throws {Error} When no week is selected (shows alert)
   */
  const testAssignment = useCallback(() => {
    if (!selectedWeek) {
      alert("Please select a week first!");
      return;
    }
    const rideSignups: RideSignup[] = filtered.map(s => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      canDrive: s.canDrive,
      location: s.location,
      aftereventWeek: s.aftereventWeek,
      submittedAt: s.submittedAt,
      capacity: s.capacity
    }));
    const result = assignCarpools(rideSignups, selectedWeek);
    setAssignments(result);
    setEditingAssignments(result);
    setShowAssignments(true);
    setIsEditing(false);
  }, [filtered, selectedWeek]);

  /**
   * Starts editing mode by creating a deep copy of current assignments
   * 
   * This allows users to modify assignments without affecting the original
   * until they explicitly save changes.
   */
  const startEditing = useCallback(() => {
    if (!assignments) return;
    setEditingAssignments(JSON.parse(JSON.stringify(assignments)));
    setIsEditing(true);
  }, [assignments]);

  /**
   * Cancels editing mode and reverts to original assignments
   */
  const cancelEditing = useCallback(() => {
    setEditingAssignments(assignments);
    setIsEditing(false);
  }, [assignments]);

  /**
   * Saves the edited assignments to Firestore
   * 
   * This function persists carpool assignments to the 'carpoolAssignments' collection
   * in Firestore. It creates a new document or updates an existing one based on the week.
   * The assignment data includes metadata like creation/update timestamps and user info.
   * 
   * @async
   * @throws {Error} When Firestore save operation fails
   */
  const saveAssignments = useCallback(async () => {
    if (!editingAssignments || !selectedWeek) return;
    
    setSaving(true);
    try {
      const assignmentDoc: Omit<CarpoolAssignmentDoc, 'id'> = {
        week: selectedWeek,
        assignments: editingAssignments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin', // TODO: Get actual user ID from auth context
      };

      // Use the week as the document ID for easy retrieval and updates
      const docRef = doc(db, 'carpoolAssignments', selectedWeek);
      await setDoc(docRef, assignmentDoc, { merge: true });

      // Update local state
      setAssignments(editingAssignments);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save assignments';
      setError(errorMessage);
      console.error('Error saving assignments:', err);
    } finally {
      setSaving(false);
    }
  }, [editingAssignments, selectedWeek]);

  /**
   * Handles drag start events for DnD functionality
   * 
   * @param {any} event - Drag start event from @dnd-kit
   */
  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id as string);
  }, []);

  /**
   * Handles drag end events for DnD functionality
   * 
   * This complex function manages the logic for moving riders between cars
   * and the unassigned list during drag-and-drop operations. It:
   * - Identifies the source and destination of the dragged item
   * - Validates capacity constraints
   * - Updates assignment state accordingly
   * - Handles edge cases like dropping on invalid targets
   * 
   * @param {DragEndEvent} event - Drag end event from @dnd-kit
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    if (!editingAssignments) return;
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    let sourceCarIndex: number | null = null;
    let destCarIndex: number | null = null;
    let rider: RideSignup | null = null;
    const newAssignments = { ...editingAssignments };
    
    // Find and remove rider from source location
    for (let i = 0; i < newAssignments.assignments.length; i++) {
      const idx = newAssignments.assignments[i].riders.findIndex(r => r.id === activeId);
      if (idx !== -1) {
        rider = newAssignments.assignments[i].riders[idx];
        newAssignments.assignments[i].riders.splice(idx, 1);
        newAssignments.assignments[i].usedCapacity--;
        sourceCarIndex = i;
        break;
      }
    }
    if (!rider) {
      const idx = newAssignments.unassignedRiders.findIndex(r => r.id === activeId);
      if (idx !== -1) {
        rider = newAssignments.unassignedRiders[idx];
        newAssignments.unassignedRiders.splice(idx, 1);
      }
    }
    if (!rider) return;
    
    // Add rider to destination location
    if (overId === 'unassigned') {
      newAssignments.unassignedRiders.push(rider);
    } else if (overId.startsWith('car-')) {
      const carIdx = parseInt(overId.split('-')[1]);
      if (!isNaN(carIdx)) {
        const assignment = newAssignments.assignments[carIdx];
        if (assignment.usedCapacity < assignment.totalCapacity) {
          assignment.riders.push(rider);
          assignment.usedCapacity++;
        } else {
          newAssignments.unassignedRiders.push(rider);
        }
      }
    } else {
      // Handle dropping on another rider
      for (let i = 0; i < newAssignments.assignments.length; i++) {
        if (newAssignments.assignments[i].riders.some(r => r.id === overId)) {
          destCarIndex = i;
          break;
        }
      }
      const droppedInUnassigned = newAssignments.unassignedRiders.some(r => r.id === overId);
      if (destCarIndex !== null) {
        const assignment = newAssignments.assignments[destCarIndex];
        if (assignment.usedCapacity < assignment.totalCapacity) {
          assignment.riders.push(rider);
          assignment.usedCapacity++;
        } else {
          newAssignments.unassignedRiders.push(rider);
        }
      } else if (droppedInUnassigned) {
        newAssignments.unassignedRiders.push(rider);
      } else {
        // Fallback: return to source or unassigned
        if (sourceCarIndex !== null) {
          newAssignments.assignments[sourceCarIndex].riders.push(rider);
          newAssignments.assignments[sourceCarIndex].usedCapacity++;
        } else {
          newAssignments.unassignedRiders.push(rider);
        }
      }
    }
    setEditingAssignments(newAssignments);
  }, [editingAssignments]);

  /**
   * Exports current assignments to CSV format and triggers download
   * 
   * Uses the exportAssignmentsCSV utility function to generate
   * a properly formatted CSV with assignment data.
   */
  const exportAssignments = useCallback(() => {
    if (!assignments) return;
    const csv = exportAssignmentsCSV(assignments);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carpool-assignments-${selectedWeek}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [assignments, selectedWeek]);

  /**
   * Deletes carpool assignments for the selected week from Firestore
   * 
   * This function removes the saved assignments document from the 'carpoolAssignments'
   * collection and clears the local state.
   * 
   * @async
   * @throws {Error} When Firestore delete operation fails
   */
  const deleteAssignments = useCallback(async () => {
    if (!selectedWeek) return;
    
    try {
      const docRef = doc(db, 'carpoolAssignments', selectedWeek);
      await deleteDoc(docRef);
      
      // Clear local state
      setAssignments(null);
      setEditingAssignments(null);
      setShowAssignments(false);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete assignments';
      setError(errorMessage);
      console.error('Error deleting assignments:', err);
    }
  }, [selectedWeek]);

  return {
    signups,
    loading,
    error,
    selectedWeek,
    setSelectedWeek,
    weeks: sortedWeeks,
    filteredSignups: filtered,
    exportCSV,
    assignments,
    showAssignments,
    setShowAssignments,
    editingAssignments,
    isEditing,
    saving,
    activeId,
    sensors,
    testAssignment,
    startEditing,
    cancelEditing,
    saveAssignments,
    deleteAssignments,
    loadAssignments,
    handleDragStart,
    handleDragEnd,
    exportAssignments,
    getAssignmentStats,
    fetchSignups,
  };
} 