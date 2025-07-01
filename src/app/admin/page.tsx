"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { useState, useEffect } from "react";
import { addDoc, collection, Timestamp, getDocs, query, orderBy, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
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
          <section className="mb-10">
            <AftereventWeekConfig />
          </section>
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
      const eventData: EventData = {
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to create event. " + err.message);
      } else {
        setError("Failed to create event.");
      }
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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchEvents() {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data: Event[] = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as Partial<EventData>) }));
      setEvents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to load events. " + err.message);
      } else {
        setError("Failed to load events.");
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to delete event. " + err.message);
      } else {
        setError("Failed to delete event.");
      }
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
            <div className="font-bold text-indigo-700">{event.title ?? "(No title)"}</div>
            <div className="text-gray-500 text-sm">
              {(() => {
                if (event.date && typeof event.date === 'object' && 'seconds' in event.date && typeof event.date.seconds === 'number') {
                  return new Date(event.date.seconds * 1000).toLocaleString();
                }
                return "";
              })()} &middot; {event.location ?? "(No location)"}
            </div>
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

function AftereventWeekConfig() {
  const quarters = ["Fall", "Winter", "Spring"];
  const weeks = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const [quarter, setQuarter] = useState("");
  const [week, setWeek] = useState("");
  const [currentWeek, setCurrentWeek] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Parse 'Fall Week 5' into {quarter: 'Fall', week: '5'}
  function parseCurrentWeek(str: string) {
    if (!str) return { quarter: "", week: "" };
    const match = str.match(/^(Fall|Winter|Spring) Week (\d{1,2})$/);
    if (match) return { quarter: match[1], week: match[2] };
    return { quarter: "", week: "" };
  }

  useEffect(() => {
    async function fetchWeek() {
      setLoading(true);
      setError("");
      try {
        const docRef = doc(db, "config", "afterevent");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentWeek(data.currentWeek || "");
          const parsed = parseCurrentWeek(data.currentWeek || "");
          setQuarter(parsed.quarter);
          setWeek(parsed.week);
        } else {
          setCurrentWeek("");
          setQuarter("");
          setWeek("");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("Failed to load afterevent week. " + err.message);
        } else {
          setError("Failed to load afterevent week.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchWeek();
  }, []);

  const combinedWeek = quarter && week ? `${quarter} Week ${week}` : "";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const docRef = doc(db, "config", "afterevent");
      await setDoc(docRef, { currentWeek: combinedWeek });
      setCurrentWeek(combinedWeek);
      setSuccess("Afterevent week updated!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to update afterevent week. " + err.message);
      } else {
        setError("Failed to update afterevent week.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col gap-4 max-w-xl">
      <h2 className="text-lg font-bold text-indigo-700 mb-1">Current Afterevent Week</h2>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="text-gray-800 text-base mb-2">
            <span className="font-semibold">Current week:</span> {currentWeek ? <span className="text-indigo-700 font-bold">{currentWeek}</span> : <span className="text-gray-400">(not set)</span>}
          </div>
          <form onSubmit={handleSave} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition w-full sm:w-auto"
              value={quarter}
              onChange={e => setQuarter(e.target.value)}
              required
            >
              <option value="" disabled>Select quarter</option>
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition w-full sm:w-auto"
              value={week}
              onChange={e => setWeek(e.target.value)}
              required
            >
              <option value="" disabled>Select week</option>
              {weeks.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <button
              type="submit"
              className="mt-2 sm:mt-0 py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={saving || !quarter || !week}
            >
              {saving ? "Saving..." : "Update Week"}
            </button>
          </form>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Preview:</span> {combinedWeek || <span className="text-gray-400">Select quarter and week</span>}
          </div>
          {error && <div className="text-red-600 font-medium text-sm mt-1">{error}</div>}
          {success && <div className="text-green-600 font-medium text-sm mt-1">{success}</div>}
        </>
      )}
    </div>
  );
}

// Define EventData and Event types
interface EventData {
  title: string;
  date: Timestamp;
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}
interface Event {
  id: string;
  title?: string;
  date?: Timestamp | { seconds: number };
  location?: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}