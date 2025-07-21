"use client";
import { useState, useMemo, useCallback } from 'react';
import React from 'react';
import type { AvailabilitySlot } from '@/types/apartment';
import { toDateSafe } from '@/lib/utils';

interface AvailabilityListProps {
  slots: AvailabilitySlot[];
  loading?: boolean;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  title?: string;
}

const AvailabilityList = React.memo(function AvailabilityList({
  slots,
  loading = false,
  onDelete,
  showDeleteButton = false,
  title = "Apartment Availability"
}: AvailabilityListProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'apartment'>('time');

  const handleFilterChange = useCallback((newFilter: 'all' | 'upcoming' | 'past') => {
    setFilter(newFilter);
  }, []);

  const handleSortChange = useCallback((newSortBy: 'time' | 'apartment') => {
    setSortBy(newSortBy);
  }, []);

  const filteredAndSortedSlots = useMemo(() => {
    const now = new Date();
    
    let filtered = slots;
    
    // Apply time filter
    if (filter === 'upcoming') {
      filtered = slots.filter(slot => {
        const startTime = slot.startTime ? toDateSafe(slot.startTime) : null;
        return startTime ? startTime > now : false;
      });
    } else if (filter === 'past') {
      filtered = slots.filter(slot => {
        const endTime = slot.endTime ? toDateSafe(slot.endTime) : null;
        return endTime ? endTime < now : false;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'time') {
        const aTime = a.startTime ? toDateSafe(a.startTime) : null;
        const bTime = b.startTime ? toDateSafe(b.startTime) : null;
        return aTime ? bTime ? aTime.getTime() - bTime.getTime() : 0 : 0;
      } else {
        return a.apartmentName.localeCompare(b.apartmentName);
      }
    });
  }, [slots, filter, sortBy]);

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp ? toDateSafe(timestamp) : null;
    return date ? date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }) : 'N/A';
  };

  const formatTimeRange = (startTime: any, endTime: any) => {
    const start = startTime ? toDateSafe(startTime) : null;
    const end = endTime ? toDateSafe(endTime) : null;
    
    const startStr = start ? start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }) : 'N/A';
    const endStr = end ? end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }) : 'N/A';
    
    return `${startStr} - ${endStr}`;
  };

  const isUpcoming = (slot: AvailabilitySlot) => {
    const startTime = slot.startTime ? toDateSafe(slot.startTime) : null;
    return startTime ? startTime > new Date() : false;
  };

  const isPast = (slot: AvailabilitySlot) => {
    const endTime = slot.endTime ? toDateSafe(slot.endTime) : null;
    return endTime ? endTime < new Date() : false;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as 'all' | 'upcoming' | 'past')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'time' | 'apartment')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="time">Sort by Time</option>
            <option value="apartment">Sort by Apartment</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600">
        {filteredAndSortedSlots.length} availability slot{filteredAndSortedSlots.length !== 1 ? 's' : ''} found
      </p>

      {/* Availability slots */}
      {filteredAndSortedSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No availability found</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === 'upcoming' ? 'No upcoming availability slots' : 
             filter === 'past' ? 'No past availability slots' : 
             'No availability slots have been posted yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedSlots.map((slot) => {
            const upcoming = isUpcoming(slot);
            const past = isPast(slot);
            
            return (
              <div
                key={slot.id}
                className={`bg-white rounded-lg shadow border ${
                  past ? 'opacity-60' : upcoming ? 'border-green-200 bg-green-50' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {slot.apartmentName}
                        </h3>
                        {upcoming && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Upcoming
                          </span>
                        )}
                        {past && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            Past
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{slot.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {formatDateTime(slot.startTime)}</span>
                        <span>⏰ {formatTimeRange(slot.startTime, slot.endTime)}</span>
                        {slot.maxGuests && (
                          <span>👥 Max {slot.maxGuests} guests</span>
                        )}
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-400">
                        Posted by {slot.postedByName || 'Anonymous'} on {formatDateTime(slot.createdAt)}
                      </div>
                    </div>
                    
                    {showDeleteButton && onDelete && (
                      <button
                        onClick={onDelete}
                        className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default AvailabilityList; 