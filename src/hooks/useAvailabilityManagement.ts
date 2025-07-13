import { useState, useCallback, useEffect } from 'react';
import { getCollection, addDocToCollection, deleteDoc } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';
import type { 
  AvailabilityFormData,
  AvailabilityManagementState 
} from '@/types/apartment';

const initialState: AvailabilityManagementState = {
  slots: [],
  loading: false,
  error: null,
  success: null,
};

export function useAvailabilityManagement() {
  const [state, setState] = useState<AvailabilityManagementState>(initialState);

  /**
   * Fetches all availability slots from Firestore
   */
  const fetchAvailabilitySlots = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let slots = await getCollection('availabilitySlots');
      slots = slots.filter((s: any) => s.isActive).sort((a: any, b: any) => a.startTime?.seconds - b.startTime?.seconds);
      setState(prev => ({ ...prev, slots, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch availability slots';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Creates a new availability slot
   */
  const createAvailabilitySlot = useCallback(async (slotData: AvailabilityFormData, postedBy: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const now = Timestamp.now();
      const slotDoc = {
        ...slotData,
        postedBy,
        createdAt: now,
        updatedAt: now,
        isActive: true,
      };
      await addDocToCollection('availabilitySlots', slotDoc);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Availability slot created successfully!'
      }));
      await fetchAvailabilitySlots();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create availability slot';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchAvailabilitySlots]);

  /**
   * Deletes an availability slot
   */
  const deleteAvailabilitySlot = useCallback(async (slotId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await deleteDoc(`availabilitySlots/${slotId}`);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Availability slot deleted successfully!'
      }));
      await fetchAvailabilitySlots();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete availability slot';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchAvailabilitySlots]);

  useEffect(() => {
    fetchAvailabilitySlots();
  }, [fetchAvailabilitySlots]);

  return {
    ...state,
    fetchAvailabilitySlots,
    createAvailabilitySlot,
    deleteAvailabilitySlot,
  };
} 