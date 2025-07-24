"use client";
import { useEffect, useState } from 'react';
import { useEventManagement } from '@/hooks/admin/useEventManagement';
import EventForm from './EventForm';
import EventList from './EventList';
import type { Event } from '@/hooks/admin/useEventManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EventManagement() {
  const {
    events,
    loading,
    error,
    success,
    createEvent,
    deleteEvent,
    updateEvent,
    clearMessages,
  } = useEventManagement();

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  const handleFormSubmit = async (data: any, id?: string) => {
    if (id) {
      await updateEvent(id, data);
      setEditingEvent(null);
    } else {
      await createEvent(data);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h2>
        <p className="text-gray-600">Create and manage events for your community</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Form */}
        <div>
          <EventForm 
            onSubmit={handleFormSubmit} 
            loading={loading} 
          />
        </div>

        {/* Event List */}
        <div>
          <EventList 
            events={events} 
            onDelete={deleteEvent} 
            onEdit={(event: Event) => setEditingEvent(event)}
            loading={loading} 
          />
        </div>
      </div>

      {/* Edit Event Modal */}
      <Dialog open={!!editingEvent} onOpenChange={open => { if (!open) setEditingEvent(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              onSubmit={handleFormSubmit}
              loading={loading}
              initialValues={{
                id: editingEvent.id,
                title: editingEvent.title,
                date: editingEvent.date instanceof Date ? editingEvent.date.toISOString().slice(0,16) : editingEvent.date,
                location: editingEvent.location,
                description: editingEvent.description || "",
                rsvpUrl: editingEvent.rsvpUrl || "",
                ridesUrl: editingEvent.ridesUrl || "",
              }}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 