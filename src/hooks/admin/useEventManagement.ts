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

export interface Event extends EventData {
  id: string;
}

interface EventManagementState {
  events: Event[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

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
  const [state, setState] = useState<EventManagementState>({
    events: [],
    loading: false,
    error: null,
    success: null,
  });

  /**
   * Fetches all events from Firestore with automatic sorting
   * 
   * This function retrieves all events from the 'events' collection,
   * sorts them by date in ascending order, and updates the state.
   * It handles loading states and error conditions gracefully.
   * 
   * @async
   * @throws {Error} When Firestore query fails
   */
  const fetchEvents = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data: Event[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as Event));
      setState(prev => ({ ...prev, events: data, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Creates a new event in Firestore
   * 
   * This function adds a new event document to the 'events' collection
   * and automatically refreshes the events list. It handles loading
   * states and provides success/error feedback.
   * 
   * @param {EventData} eventData - The event data to create
   * @param {string} eventData.title - Event title
   * @param {Timestamp} eventData.date - Event date and time
   * @param {string} eventData.location - Event location
   * @param {string} [eventData.description] - Optional event description
   * @param {string} [eventData.rsvpUrl] - Optional RSVP URL
   * @param {string} [eventData.ridesUrl] - Optional rides URL
   * 
   * @async
   * @throws {Error} When Firestore add operation fails
   */
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

  /**
   * Deletes an event from Firestore
   * 
   * This function removes an event document from the 'events' collection
   * by its ID and automatically refreshes the events list. It handles
   * loading states and provides success/error feedback.
   * 
   * @param {string} id - The ID of the event to delete
   * 
   * @async
   * @throws {Error} When Firestore delete operation fails
   */
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

  /**
   * Clears error and success messages from the state
   * 
   * This function resets the error and success messages to null,
   * typically used to clear user feedback after displaying messages.
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
    fetchEvents,
    clearMessages,
  };
} 