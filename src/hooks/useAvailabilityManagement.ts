import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  AvailabilitySlot, 
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
      const q = query(
        collection(db, 'availabilitySlots'), 
        where('isActive', '==', true),
        orderBy('startTime', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const slots: AvailabilitySlot[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as AvailabilitySlot));
      setState(prev => ({ ...prev, slots, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch availability slots';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Fetches availability slots for a specific apartment
   */
  const fetchApartmentAvailability = useCallback(async (apartmentId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const q = query(
        collection(db, 'availabilitySlots'), 
        where('apartmentId', '==', apartmentId),
        where('isActive', '==', true),
        orderBy('startTime', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const slots: AvailabilitySlot[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as AvailabilitySlot));
      setState(prev => ({ ...prev, slots, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch apartment availability';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Creates a new availability slot
   */
  const createAvailabilitySlot = useCallback(async (
    availabilityData: AvailabilityFormData,
    apartmentName: string,
    postedBy: string,
    postedByEmail: string,
    postedByName: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const now = Timestamp.now();
      const slotDoc = {
        apartmentId: availabilityData.apartmentId,
        apartmentName,
        postedBy,
        postedByEmail,
        postedByName,
        startTime: Timestamp.fromDate(availabilityData.startTime),
        endTime: Timestamp.fromDate(availabilityData.endTime),
        description: availabilityData.description,
        ...(availabilityData.maxGuests !== null && { maxGuests: availabilityData.maxGuests }),
        ...(availabilityData.tags && availabilityData.tags.length > 0 && { tags: availabilityData.tags }),
        createdAt: now,
        updatedAt: now,
        isActive: true,
      };
      
      await addDoc(collection(db, 'availabilitySlots'), slotDoc);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Availability posted successfully!' 
      }));
      await fetchAvailabilitySlots();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to post availability';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchAvailabilitySlots]);

  /**
   * Updates an existing availability slot
   */
  const updateAvailabilitySlot = useCallback(async (
    id: string, 
    availabilityData: Partial<AvailabilityFormData>
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      if (availabilityData.startTime) {
        updateData.startTime = Timestamp.fromDate(availabilityData.startTime);
      }
      if (availabilityData.endTime) {
        updateData.endTime = Timestamp.fromDate(availabilityData.endTime);
      }
      if (availabilityData.description !== undefined) {
        updateData.description = availabilityData.description;
      }
      if (availabilityData.maxGuests !== undefined) {
        updateData.maxGuests = availabilityData.maxGuests;
      }
      
      await updateDoc(doc(db, 'availabilitySlots', id), updateData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Availability updated successfully!' 
      }));
      await fetchAvailabilitySlots();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update availability';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchAvailabilitySlots]);

  /**
   * Deletes an availability slot (soft delete)
   */
  const deleteAvailabilitySlot = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await updateDoc(doc(db, 'availabilitySlots', id), {
        isActive: false,
        updatedAt: Timestamp.now(),
      });
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Availability removed successfully!' 
      }));
      await fetchAvailabilitySlots();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove availability';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchAvailabilitySlots]);

  /**
   * Clears success/error messages
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchAvailabilitySlots();
  }, [fetchAvailabilitySlots]);

  return {
    ...state,
    createAvailabilitySlot,
    updateAvailabilitySlot,
    deleteAvailabilitySlot,
    fetchApartmentAvailability,
    clearMessages,
    refetch: fetchAvailabilitySlots,
  };
} 