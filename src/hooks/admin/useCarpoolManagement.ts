import { useState, useCallback, useEffect, useMemo } from 'react';
import { getCollection, addDocToCollection, updateDoc, deleteDoc } from '@/lib/firestore';
import type { CarpoolAssignment, CarpoolManagementState, RideSignupAdmin } from '@/types/apartment';
import { assignCarpools, type AssignmentResult } from '@/lib/carpoolAlgorithm';

// Re-export the type for convenience
export type { RideSignupAdmin };

interface ExtendedCarpoolManagementState extends CarpoolManagementState {
  weeks: string[];
  selectedWeek: string;
  isEditing: boolean;
  saving: boolean;
  filteredSignups: RideSignupAdmin[];
  editingAssignments: CarpoolAssignment[];
  activeId: string | null;
  sensors: any;
}

const initialState: ExtendedCarpoolManagementState = {
  signups: [],
  assignments: [], // not used directly, see below
  loading: false,
  error: null,
  success: null,
  weeks: [],
  selectedWeek: '',
  isEditing: false,
  saving: false,
  filteredSignups: [],
  editingAssignments: [],
  activeId: null,
  sensors: {},
};

export function useCarpoolManagement() {
  const [state, setState] = useState<ExtendedCarpoolManagementState>(initialState);

  const fetchSignups = useCallback(async () => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, loading: true, error: null }));
    try {
      const signups = await getCollection('rides');
      setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, signups, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch signups';
      setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  // Additional functions needed by the component
  const setSelectedWeek = useCallback((week: string) => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, selectedWeek: week }));
  }, []);

  const exportCSV = useCallback(() => {
    // TODO: Implement CSV export
    console.log('Export CSV functionality not implemented yet');
  }, []);

  const testAssignment = useCallback(() => {
    // TODO: Implement test assignment
    console.log('Test assignment functionality not implemented yet');
  }, []);

  const startEditing = useCallback(() => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, isEditing: true }));
  }, []);

  const cancelEditing = useCallback(() => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, isEditing: false }));
  }, []);

  const saveAssignments = useCallback(async () => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, saving: true }));
    // TODO: Implement save assignments
    setTimeout(() => {
      setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, saving: false, isEditing: false }));
    }, 1000);
  }, []);

  const exportAssignments = useCallback(() => {
    // TODO: Implement export assignments
    console.log('Export assignments functionality not implemented yet');
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, activeId: id }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, activeId: null }));
  }, []);

  const getAssignmentStats = useCallback(() => {
    // TODO: Implement get assignment stats
    return { total: 0, assigned: 0, unassigned: 0 };
  }, []);

  // Extract unique weeks from signups
  const weeks = useMemo(() => {
    const uniqueWeeks = new Set(state.signups.map(signup => signup.aftereventWeek));
    return Array.from(uniqueWeeks).sort();
  }, [state.signups]);

  // Filter signups by selected week
  const filteredSignups = useMemo(() => {
    if (!state.selectedWeek) return state.signups;
    return state.signups.filter(signup => signup.aftereventWeek === state.selectedWeek);
  }, [state.signups, state.selectedWeek]);

  // Compute assignments for the selected week
  const assignments: AssignmentResult | null = useMemo(() => {
    if (!state.selectedWeek || filteredSignups.length === 0) return null;
    return assignCarpools(filteredSignups, state.selectedWeek);
  }, [filteredSignups, state.selectedWeek]);

  useEffect(() => {
    fetchSignups();
  }, [fetchSignups]);

  return {
    ...state,
    weeks,
    filteredSignups,
    assignments,
    fetchSignups,
    createSignup: async (signupData: Omit<RideSignupAdmin, 'id'>) => {
      setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, loading: true, error: null, success: null }));
      try {
        await addDocToCollection('rides', signupData);
        setState((prev: ExtendedCarpoolManagementState) => ({ 
          ...prev, 
          loading: false, 
          success: 'Signup created successfully!'
        }));
        await fetchSignups();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create signup';
        setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, error: errorMessage, loading: false }));
      }
    },
    updateSignup: async (id: string, signupData: Partial<RideSignupAdmin>) => {
      setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, loading: true, error: null, success: null }));
      try {
        await updateDoc(`rides/${id}`, signupData);
        setState((prev: ExtendedCarpoolManagementState) => ({ 
          ...prev, 
          loading: false, 
          success: 'Signup updated successfully!'
        }));
        await fetchSignups();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update signup';
        setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, error: errorMessage, loading: false }));
      }
    },
    deleteSignup: async (id: string) => {
      setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, loading: true, error: null, success: null }));
      try {
        await deleteDoc(`rides/${id}`);
        setState((prev: ExtendedCarpoolManagementState) => ({ 
          ...prev, 
          loading: false, 
          success: 'Signup deleted successfully!'
        }));
        await fetchSignups();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete signup';
        setState((prev: ExtendedCarpoolManagementState) => ({ ...prev, error: errorMessage, loading: false }));
      }
    },
    setSelectedWeek,
    exportCSV,
    testAssignment,
    startEditing,
    cancelEditing,
    saveAssignments,
    exportAssignments,
    handleDragStart,
    handleDragEnd,
    getAssignmentStats,
  };
} 