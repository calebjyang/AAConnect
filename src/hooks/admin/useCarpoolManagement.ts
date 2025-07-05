import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
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

  // Helper to parse and sort afterevent weeks
  function parseWeekLabel(label: string): { quarter: number; week: number } {
    const match = label.match(/^(Fall|Winter|Spring) Week (\d{1,2})$/);
    if (!match) return { quarter: -1, week: -1 };
    const quarterOrder: Record<string, number> = { Fall: 0, Winter: 1, Spring: 2 };
    return { quarter: quarterOrder[match[1]], week: parseInt(match[2], 10) };
  }

  const fetchSignups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, 'rideSignups'));
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

  useEffect(() => {
    fetchSignups();
  }, [fetchSignups]);

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

  // Export CSV
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

  // Assignment logic
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

  const startEditing = useCallback(() => {
    if (!assignments) return;
    setEditingAssignments(JSON.parse(JSON.stringify(assignments)));
    setIsEditing(true);
  }, [assignments]);

  const cancelEditing = useCallback(() => {
    setEditingAssignments(assignments);
    setIsEditing(false);
  }, [assignments]);

  const saveAssignments = useCallback(() => {
    if (!editingAssignments) return;
    setSaving(true);
    // TODO: Save to database
    setTimeout(() => {
      setAssignments(editingAssignments);
      setIsEditing(false);
      setSaving(false);
    }, 1000);
  }, [editingAssignments]);

  // Drag and drop handlers
  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id as string);
  }, []);

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

  // Export assignments CSV
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
    handleDragStart,
    handleDragEnd,
    exportAssignments,
    getAssignmentStats,
    fetchSignups,
  };
} 