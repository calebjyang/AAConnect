"use client";
import React from 'react';
import type { Recap } from '@/hooks/admin/useRecapManagement';
import { parseEventDate } from '@/lib/utils';
import { format } from 'date-fns';

interface RecapListProps {
  recaps: Recap[];
  onDelete: (recapId: string) => Promise<void>;
  onEdit: (recap: Recap) => void;
  loading?: boolean;
}

const EventList = React.memo(function EventList({ recaps, onDelete, onEdit, loading = false }: RecapListProps) {
  const handleDelete = async (recapId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await onDelete(recapId);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recap List</h3>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aacf-blue mb-4"></div>
          <p className="text-gray-600">Loading recaps...</p>
        </div>
      </div>
    );
  }

  if (recaps.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recap List</h3>
        <div className="text-center py-8">
          <p className="text-gray-600">No recaps found. Create your first recap above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recap List</h3>
      <div className="space-y-4">
        {recaps.map(recap => (
          <RecapCard 
            key={recap.id} 
            recap={recap} 
            onDelete={() => handleDelete(recap.id)} 
            onEdit={() => onEdit(recap)}
          />
        ))}
      </div>
    </div>
  );
});

export default EventList;

interface RecapCardProps {
  recap: Recap;
  onDelete: () => void;
  onEdit: () => void;
}

const RecapCard = React.memo(function RecapCard({ recap, onDelete, onEdit }: RecapCardProps) {
  const eventDate = parseEventDate(recap.date) ?? new Date();

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {recap.title || 'Untitled Event'}
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
              <span>{recap.location || 'No location'}</span>
            </div>
          </div>
          
          {recap.sermonTopic && (
            <p className="text-gray-700 text-sm mb-2 line-clamp-2">
              {recap.sermonTopic}
            </p>
          )}

          {recap.summary && (
            <p className="text-gray-700 text-sm mb-2 line-clamp-2">
              {recap.summary}
            </p>
          )}
          
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-aacf-blue hover:text-white hover:bg-aacf-blue border border-aacf-blue rounded-md transition-colors"
            title="Edit event"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-colors"
            title="Delete event"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}); 