import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EventData {
  title: string;
  date: Timestamp;
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}

export interface Event {
  id: string;
  title?: string;
  date?: Timestamp | { seconds: number };
  location?: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}

interface EventManagementState {
  events: Event[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

export function useEventManagement() {
  const [state, setState] = useState<EventManagementState>({
    events: [],
    loading: false,
    error: null,
    success: null,
  });

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data: Event[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setState(prev => ({ ...prev, events: data, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  // Create new event
  const createEvent = useCallback(async (eventData: EventData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await addDoc(collection(db, "events"), eventData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Event created successfully!' 
      }));
      // Refresh events list
      await fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchEvents]);

  // Delete event
  const deleteEvent = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await deleteDoc(doc(db, "events", id));
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Event deleted successfully!' 
      }));
      // Refresh events list
      await fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchEvents]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    ...state,
    createEvent,
    deleteEvent,
    fetchEvents,
    clearMessages,
  };
} 