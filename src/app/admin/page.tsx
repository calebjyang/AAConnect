"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { useState, useEffect } from "react";
import { addDoc, collection, Timestamp, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full bg-white p-1 shadow" />
            <span className="font-extrabold text-2xl text-white tracking-tight drop-shadow">Admin Dashboard</span>
          </div>
          <nav className="flex gap-8">
            <a href="#events" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Events</a>
            <a href="#users" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Users</a>
            <a href="#analytics" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Analytics</a>
          </nav>
        </header>
        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-8 px-4">
          {/* Events Section */}
          <section id="events" className="mb-12">
            <h2 className="text-xl font-semibold mb-2">Event Management</h2>
            <EventForm />
            <EventList />
          </section>
          {/* Users Section */}
          <section id="users" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <span>User Management</span>
            </h2>
            <div className="bg-white rounded-lg shadow p-6 text-gray-500">User management tools coming soon...</div>
          </section>
          {/* Analytics Section */}
          <section id="analytics">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <span>Analytics</span>
            </h2>
            <div className="bg-white rounded-lg shadow p-6 text-gray-500">Analytics dashboard coming soon...</div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// EventForm component for event creation
function EventForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [ridesUrl, setRidesUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!title || !date || !location) {
        setError("Title, date, and location are required.");
        setLoading(false);
        return;
      }
      // Build eventData with only non-empty fields
      const eventData: Record<string, any> = {
        title,
        date: Timestamp.fromDate(new Date(date)),
        location,
      };
      if (description) eventData.description = description;
      if (rsvpUrl) eventData.rsvpUrl = rsvpUrl;
      if (ridesUrl) eventData.ridesUrl = ridesUrl;
      await addDoc(collection(db, "events"), eventData);
      setSuccess("Event created!");
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setRsvpUrl("");
      setRidesUrl("");
    } catch (err: any) {
      setError("Failed to create event. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 max-w-xl border border-gray-100">
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-title">Title<span className="text-red-500 ml-1">*</span></label>
        <input id="event-title" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-date">Date & Time<span className="text-red-500 ml-1">*</span></label>
        <input id="event-date" type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-location">Location<span className="text-red-500 ml-1">*</span></label>
        <input id="event-location" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" value={location} onChange={e => setLocation(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-description">Description</label>
        <textarea id="event-description" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-rsvp">RSVP URL <span className='text-gray-500 font-normal'>(optional)</span></label>
        <input id="event-rsvp" type="url" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" value={rsvpUrl} onChange={e => setRsvpUrl(e.target.value)} placeholder="https://..." />
        <span className="text-xs text-gray-400">Leave blank if no RSVP is needed</span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-rides">Rides Form URL <span className='text-gray-500 font-normal'>(optional)</span></label>
        <input id="event-rides" type="url" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" value={ridesUrl} onChange={e => setRidesUrl(e.target.value)} placeholder="https://..." />
        <span className="text-xs text-gray-400">Leave blank if no rides form is needed</span>
      </div>
      {error && <div className="text-red-600 font-medium text-sm">{error}</div>}
      {success && <div className="text-green-600 font-medium text-sm">{success}</div>}
      <button type="submit" className="mt-2 py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Creating..." : "Create Event"}</button>
    </form>
  );
}

function EventList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchEvents() {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setEvents(data);
    } catch (err: any) {
      setError("Failed to load events. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEvents(); }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events => events.filter(e => e.id !== id));
    } catch (err: any) {
      setError("Failed to delete event. " + (err?.message || ""));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div className="mt-8 text-gray-500">Loading events...</div>;
  if (error) return <div className="mt-8 text-red-600">{error}</div>;
  if (events.length === 0) return <div className="mt-8 text-gray-500">No events found.</div>;

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {events.map(event => (
        <li key={event.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100">
          <div>
            <div className="font-bold text-indigo-700">{event.title}</div>
            <div className="text-gray-500 text-sm">{event.date && event.date.seconds ? new Date(event.date.seconds * 1000).toLocaleString() : ""} &middot; {event.location}</div>
            {event.description && <div className="text-gray-700 text-sm mt-1">{event.description}</div>}
          </div>
          <button
            className="mt-3 sm:mt-0 sm:ml-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => handleDelete(event.id)}
            disabled={deletingId === event.id}
          >
            {deletingId === event.id ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}