"use client";
import AdminRoute from '@/components/AdminRoute';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getDoc, setDoc } from '@/lib/firestore';
import { signOutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import CarpoolManagement from '@/components/admin/CarpoolManagement/CarpoolManagement';
import { EventManagement } from '@/components/admin/EventManagement';
import ApartmentManagement from '@/components/admin/ApartmentManagement/ApartmentManagement';
import RecapManagement from '@/components/admin/RecapManagement/RecapManagement';

export default function AdminPage() {
  const router = useRouter();

  function handleLogout() {
    signOutUser().then(() => {
      router.replace("/login");
    });
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-aacf-blue to-blue-500 shadow-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full bg-white p-1 shadow" />
            <span className="font-extrabold text-2xl text-white tracking-tight drop-shadow">Admin Dashboard</span>
          </div>
          <nav className="flex gap-8 items-center">
            <a href="#events" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Events</a>
            <a href="#recaps" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Recaps</a>
            <a href="#rides" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Rides</a>
            <a href="#apartments" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Apartments</a>
            <a href="#users" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Users</a>
            <a href="#analytics" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Analytics</a>
            <button
              onClick={handleLogout}
              className="ml-6 px-4 py-2 rounded-md bg-white text-aacf-blue font-semibold shadow hover:bg-blue-50 transition border border-aacf-blue/20"
            >
              Log Out
            </button>
          </nav>
        </header>
        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-8 px-4">
          <section className="mb-10">
            <AftereventWeekConfig />
          </section>
          {/* Rides Section */}
          <section id="rides" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-aacf-blue mb-2 flex items-center gap-2">
              <span>Rides Management</span>
            </h2>
            <CarpoolManagement />
          </section>
          {/* Events Section */}
          <section id="events" className="mb-12">
            <EventManagement />
          </section>
          {/* Apartments Section */}
          <section id="apartments" className="mb-12">
            <ApartmentManagement />
          </section>
          {/* Recap Section */}
          <section id="events" className="mb-12">
            <RecapManagement />
          </section>
          {/* Users Section */}
          <section id="users" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-aacf-blue mb-2 flex items-center gap-2">
              <span>User Management</span>
            </h2>
            <div className="bg-white rounded-lg shadow p-6 text-gray-500">User management tools coming soon...</div>
          </section>
          {/* Analytics Section */}
          <section id="analytics">
            <h2 className="text-xl sm:text-2xl font-bold text-aacf-blue mb-2 flex items-center gap-2">
              <span>Analytics</span>
            </h2>
            <div className="bg-white rounded-lg shadow p-6 text-gray-500">Analytics dashboard coming soon...</div>
          </section>
        </main>
      </div>
    </AdminRoute>
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
        const docSnap = await getDoc('config/afterevent');
        if (docSnap && docSnap.currentWeek) {
          setCurrentWeek(docSnap.currentWeek || "");
          const parsed = parseCurrentWeek(docSnap.currentWeek || "");
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
      await setDoc('config/afterevent', { currentWeek: combinedWeek });
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
      <h2 className="text-lg font-bold text-aacf-blue mb-1">Current Afterevent Week</h2>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="text-gray-800 text-base mb-2">
            <span className="font-semibold">Current week:</span> {currentWeek ? <span className="text-aacf-blue font-bold">{currentWeek}</span> : <span className="text-gray-400">(not set)</span>}
          </div>
          <form onSubmit={handleSave} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition w-full sm:w-auto"
              value={quarter}
              onChange={e => setQuarter(e.target.value)}
              required
            >
              <option value="" disabled>Select quarter</option>
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition w-full sm:w-auto"
              value={week}
              onChange={e => setWeek(e.target.value)}
              required
            >
              <option value="" disabled>Select week</option>
              {weeks.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <button
              type="submit"
              className="mt-2 sm:mt-0 py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
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