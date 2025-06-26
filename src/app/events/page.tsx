"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import React from "react";

type Event = {
  id: string;
  title: string;
  date: { seconds: number; nanoseconds: number }; // Firestore Timestamp
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
};

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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative transform transition-all duration-200 ${show ? 'scale-100' : 'scale-95'} flex flex-col items-center`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 id="event-modal-title" className="text-2xl font-bold text-indigo-700 mb-2 text-center w-full">{event.title}</h2>
        <div className="text-gray-500 text-sm mb-2 text-center w-full">
          {new Date(event.date.seconds * 1000).toLocaleString()} &middot; {event.location}
        </div>
        {event.description && <div className="mb-2 text-gray-700 text-center w-full">{event.description}</div>}
        {(hasRSVP || hasRides) && (
          <div className={`flex ${hasRSVP && hasRides ? 'flex-row gap-4 justify-center mt-4' : 'justify-center mt-4'} w-full`}>
            {hasRSVP && (
              <a
                href={event.rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 text-base font-semibold bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition text-center"
              >
                RSVP to this Event
              </a>
            )}
            {hasRides && (
              <a
                href={event.ridesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 text-base font-semibold bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition text-center"
              >
                Rides Form
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Upcoming Events</h1>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 flex flex-col items-center">
        {loading ? (
          <p className="text-gray-500 text-lg">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-lg">No events found.</p>
        ) : (
          <ul className="w-full flex flex-col gap-6">
            {events.map(event => (
              <li key={event.id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100" onClick={() => setSelectedEvent(event)}>
                <div className="text-xl font-extrabold text-indigo-700 mb-1">{event.title}</div>
                <div className="text-gray-500 text-sm mb-1">
                  {new Date(event.date.seconds * 1000).toLocaleString()} &middot; {event.location}
                </div>
                {event.description && (
                  <div className="mt-1 text-gray-700">{event.description}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
