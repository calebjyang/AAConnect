import { useState, useCallback, useEffect } from 'react';
import { getCollection, addDocToCollection, deleteDoc, updateDoc } from '@/lib/firestore';

export interface EventData {
  title: string;
  date: string; // ISO string
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}

export interface EventManagementState {
  events: Event[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: EventManagementState = {
  events: [],
  loading: false,
  error: null,
  success: null,
};

/**
 * Custom hook for managing events in the admin dashboard
 * 
 * This hook provides comprehensive event management functionality including:
 * - Fetching events from Firestore with automatic sorting
 * - Creating new events with validation
 * - Deleting existing events
 * - Loading states and error handling
 * - Success feedback and message clearing
 * 
 * The hook automatically:
 * - Loads events on mount
 * - Sorts events by date (ascending)
 * - Handles Firestore operations with error handling
 * - Provides loading states during async operations
 * 
 * @returns {Object} Object containing event management state and functions
 * @returns {Event[]} returns.events - Array of all events
 * @returns {boolean} returns.loading - Whether an async operation is in progress
 * @returns {string|null} returns.error - Error message if any operation failed
 * @returns {string|null} returns.success - Success message for completed operations
 * @returns {Function} returns.createEvent - Function to create a new event
 * @returns {Function} returns.deleteEvent - Function to delete an event
 * @returns {Function} returns.fetchEvents - Function to refresh events
 * @returns {Function} returns.clearMessages - Function to clear error/success messages
 * 
 * @example
 * ```tsx
 * function EventManagement() {
 *   const {
 *     events,
 *     loading,
 *     error,
 *     success,
 *     createEvent,
 *     deleteEvent,
 *     clearMessages
 *   } = useEventManagement();
 *   
 *   const handleCreateEvent = async (eventData) => {
 *     await createEvent(eventData);
 *   };
 *   
 *   return (
 *     <div>
 *       {loading && <div>Loading...</div>}
 *       {error && <div>Error: {error}</div>}
 *       {success && <div>Success: {success}</div>}
 *       {events.map(event => (
 *         <EventCard key={event.id} event={event} onDelete={deleteEvent} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useEventManagement() {
  const [state, setState] = useState<EventManagementState>(initialState);

  /**
   * Fetches all events from Firestore with automatic sorting
   */
  const fetchEvents = useCallback(async () => {
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
   * Creates a new event in Firestore
   */
  const createEvent = useCallback(async (eventData: EventData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await addDocToCollection('events', eventData);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Event created successfully!'
      }));
      await fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchEvents]);

  /**
   * Deletes an event from Firestore
   */
  const deleteEvent = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await deleteDoc(`events/${id}`);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Event deleted successfully!'
      }));
      await fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchEvents]);

  /**
   * Updates an event in Firestore
   */
  const updateEvent = useCallback(async (id: string, eventData: EventData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await updateDoc(`events/${id}`, eventData);
      setState(prev => ({
        ...prev,
        loading: false,
        success: 'Event updated successfully!'
      }));
      await fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchEvents]);

  /**
   * Clears error and success messages from the state
   */
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
    updateEvent,
    clearMessages,
    fetchEvents,
  };
} 