"use client";
import { useEffect, useState } from "react";
import { getCollection, orderByQuery } from "@/lib/firestore";
import React from "react";
import { useAuth } from "@/lib/useAuth";
import UserProfile from "@/components/UserProfile";
import Image from "next/image";
import Link from "next/link";
import { parseEventDate } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  date?: Date;
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
};

type ViewMode = 'list' | 'calendar';

function EventDetailModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200); // Match transition duration
  };

  const hasRSVP = !!event.rsvpUrl;
  const hasRides = !!event.ridesUrl;
  const eventDate = parseEventDate(event.date) ?? new Date(); // Use Date object directly

  // Google Calendar integration
  const createGoogleCalendarEvent = () => {
    const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // 2 hours later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl p-8 max-w-lg w-full mx-4 relative transform transition-all duration-200 ${show ? 'scale-100' : 'scale-95'} flex flex-col`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          ×
        </button>
        
        <div className="mb-6">
          <h2 id="event-modal-title" className="text-3xl font-bold text-aacf-blue mb-3">{event.title}</h2>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">
              {event.date ? eventDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Date TBD'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {event.date ? eventDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              }) : 'Time TBD'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        {event.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={createGoogleCalendarEvent}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            Add to Google Calendar
          </button>

          {(hasRSVP || hasRides) && (
            <div className="flex gap-3">
              {hasRSVP && (
                <a
                  href={event.rsvpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-aacf-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md text-center"
                >
                  RSVP to Event
                </a>
              )}
              {hasRides && (
                <a
                  href={event.ridesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md text-center"
                >
                  Sign Up for Rides
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarView({ events }: { events: Event[] }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = parseEventDate(event.date) ?? new Date(); // Use Date object directly
    const dateKey = date.toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2" />;
          }
          
          const date = new Date(currentYear, currentMonth, day);
          const dateKey = date.toDateString();
          const dayEvents = eventsByDate[dateKey] || [];
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <div
              key={index}
              className={`p-2 min-h-[80px] border border-gray-200 ${
                isToday ? 'bg-aacf-blue/10 border-aacf-blue' : 'bg-white'
              }`}
            >
              <div className={`text-sm font-medium ${
                isToday ? 'text-aacf-blue font-bold' : 'text-gray-700'
              }`}>
                {day}
              </div>
                              {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs bg-aacf-blue text-white p-1 rounded mt-1 truncate cursor-pointer hover:bg-blue-700"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListView({ events, onEventClick }: { events: Event[]; onEventClick: () => void }) {
  const now = new Date();
  const upcomingEvents = events.filter(e => (parseEventDate(e.date) ?? new Date()) >= now);
  const pastEvents = events.filter(e => (parseEventDate(e.date) ?? new Date()) < now);

  return (
    <div className="space-y-6">
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => onEventClick()} />
            ))}
          </div>
        </div>
      )}
      
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Past Events</h3>
          <div className="space-y-4">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => onEventClick()} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onClick, isPast = false }: { event: Event; onClick: () => void; isPast?: boolean }) {
  const eventDate = parseEventDate(event.date) ?? new Date(); // Use Date object directly
  const hasRSVP = !!event.rsvpUrl;
  const hasRides = !!event.ridesUrl;

  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border ${
        isPast ? 'border-gray-200 opacity-75' : 'border-aacf-blue/20 hover:border-aacf-blue/40'
      }`} 
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-xl font-bold ${isPast ? 'text-gray-600' : 'text-aacf-blue'}`}>
          {event.title}
        </h3>
        {isPast && (
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
            Past
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">
            {event.date ? eventDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }) : 'Date TBD'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">
            {event.date ? eventDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            }) : 'Time TBD'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{event.location}</span>
        </div>
      </div>
      
      {event.description && (
        <p className="text-gray-700 mb-3 line-clamp-2">{event.description}</p>
      )}
      
      {(hasRSVP || hasRides) && (
        <div className="flex gap-2">
          {hasRSVP && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              RSVP Available
            </span>
          )}
          {hasRides && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Rides Available
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const orderByConstraint = await orderByQuery("date", "asc");
        const data = await getCollection("events", [orderByConstraint]) as Event[];
        console.log("Fetched events:", data);
        // Parse event dates on load
        setEvents(data.map(e => ({ ...e, date: parseEventDate(e.date) ?? new Date() })));
      } catch (error) {
        console.error("Error fetching events:", error instanceof Error ? error.message : error);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="AAConnect Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-full bg-white p-1 shadow"
                />
                <span className="font-extrabold text-2xl text-aacf-blue tracking-tight">
                  AAConnect
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {!loading && user && <UserProfile />}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Stay up to date with all AACF events and activities</p>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-aacf-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-aacf-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar View
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Content */}
        {eventsLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aacf-blue mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Check back later for upcoming events!</p>
          </div>
        ) : (
          <div>
            {viewMode === 'list' ? (
              <ListView events={events} onEventClick={() => setSelectedEvent(null)} />
            ) : (
              <CalendarView events={events} />
            )}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
