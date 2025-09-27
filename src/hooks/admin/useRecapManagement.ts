import { useState, useCallback, useEffect } from 'react';
import { getCollection, addDocToCollection, updateDoc, setDoc, deleteDoc } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

export interface RecapData {
    title: string;
    date: string;
    location: string;
    sermonTopic: string;
    summary: string;
}

export interface Recap {
    id: string;
    title: string;
    date: Date;
    location: string;
    sermonTopic?: string;
    summary?: string;
}

export interface RecapManagementState {
  events: Recap[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: RecapManagementState = {
  events: [],
  loading: false,
  error: null,
  success: null,
};


export function useEventManagement() {
  const [state, setState] = useState<RecapManagementState>(initialState);

  /**
   * Fetches all recaps from Firestore with automatic sorting
   */
  const fetchRecaps = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let events = await getCollection('events');
      // Sort by date ascending (if not already sorted by Firestore)
      events = events.sort((a, b) => {
        const aDate = a.date instanceof Date ? a.date : new Date(a.date);
        const bDate = b.date instanceof Date ? b.date : new Date(b.date);
        return aDate.getTime() - bDate.getTime();
      });
      setState(prev => ({ ...prev, events, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Creates a new recap in Firestore
   */
  const createRecap = useCallback(async (RecapData: RecapData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await addDocToCollection('recaps', RecapData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Recap created successfully!'
      }));
      await fetchRecaps();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create recap';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchRecaps]);

  /**
   * Deletes a recap from Firestore
   */
  const deleteRecap = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await deleteDoc(`recaps/${id}`);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Event deleted successfully!'
      }));
      await fetchRecaps();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete recap';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchRecaps]);

  /**
   * Updates a recap in Firestore
   */
  const updateRecap = useCallback(async (id: string, eventData: RecapData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await updateDoc(`events/${id}`, eventData);
      setState(prev => ({
        ...prev,
        loading: false,
        success: 'Recap updated successfully!'
      }));
      await fetchRecaps();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchRecaps]);

  /**
   * Clears error and success messages from the state
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  // Load recaps on mount
  useEffect(() => {
    fetchRecaps();
  }, [fetchRecaps]);

  return {
    ...state,
    createRecap,
    deleteRecap,
    updateRecap,
    clearMessages,
    fetchRecaps,
  };
} 