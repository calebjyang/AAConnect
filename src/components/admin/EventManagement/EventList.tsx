"use client";
import React from 'react';
import type { Event } from '@/hooks/admin/useEventManagement';
import { parseEventDate } from '@/lib/utils';
import { format } from 'date-fns';

interface EventListProps {
  events: Event[];
  onDelete: (eventId: string) => Promise<void>;
  loading?: boolean;
}

const EventList = React.memo(function EventList({ events, onDelete, loading = false }: EventListProps) {
  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await onDelete(eventId);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Event List</h3>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aacf-blue mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Event List</h3>
        <div className="text-center py-8">
          <p className="text-gray-600">No events found. Create your first event above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Event List</h3>
      <div className="space-y-4">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onDelete={() => handleDelete(event.id)} 
          />
        ))}
      </div>
    </div>
  );
});

export default EventList;

interface EventCardProps {
  event: Event;
  onDelete: () => void;
}

const EventCard = React.memo(function EventCard({ event, onDelete }: EventCardProps) {
  const eventDate = parseEventDate(event.date) ?? new Date();

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title || 'Untitled Event'}
          </h4>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {format(eventDate, 'EEE, MMM d')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {format(eventDate, 'h:mm a')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location || 'No location'}</span>
            </div>
          </div>
          
          {event.description && (
            <p className="text-gray-700 text-sm mb-2 line-clamp-2">
              {event.description}
            </p>
          )}
          
          <div className="flex gap-2">
            {event.rsvpUrl && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                RSVP Available
              </span>
            )}
            {event.ridesUrl && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Rides Available
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={onDelete}
          className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          title="Delete event"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}); 