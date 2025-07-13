"use client";
import { useState, useEffect } from "react";
import { addDocToCollection, getDoc } from "@/lib/firestore";

// Define RideSignup type
interface RideSignup {
  name: string;
  phone: string;
  canDrive: string;
  location: string;
  submittedAt: string;
  aftereventWeek: string;
  capacity?: string;
  grade?: string;
}

export default function RidesFormPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [canDrive, setCanDrive] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [aftereventWeek, setAftereventWeek] = useState<string | null>(null);
  const [weekLoading, setWeekLoading] = useState(true);
  const [weekError, setWeekError] = useState("");

  const locationOptions = [
    "Middle Earth",
    "Mesa Court",
    "Berk",
    "Cornell",
    "Other UTC (NOT Berk/Cornell)",
    "Plaza",
    "Other ACC (NOT Plaza)",
    "Other"
  ];

  const gradeOptions = [
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Fifth Year",
    "Graduate Student",
    "Staff"
  ];

  useEffect(() => {
    async function fetchWeek() {
      setWeekLoading(true);
      setWeekError("");
      try {
        const docSnap = await getDoc("config/afterevent");
        if (docSnap) {
          setAftereventWeek(docSnap.currentWeek || null);
        } else {
          setAftereventWeek(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setWeekError("Failed to load afterevent week. " + err.message);
        } else {
          setWeekError("Failed to load afterevent week.");
        }
      } finally {
        setWeekLoading(false);
      }
    }
    fetchWeek();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const finalLocation = location === "Other" ? otherLocation : location;
    if (!name || !phone || !canDrive || !finalLocation || !grade) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }
    if (!aftereventWeek) {
      setError("Afterevent week is not set. Please try again later or contact an admin.");
      setLoading(false);
      return;
    }
    try {
      const data: RideSignup = {
        name,
        phone,
        canDrive,
        location: finalLocation,
        submittedAt: new Date().toISOString(),
        aftereventWeek,
        grade,
      };
      if (canDrive === "Yes" && capacity) data.capacity = capacity;
      await addDocToCollection("rides", data);
      setSuccess("Thanks for signing up! We'll be in touch soon.");
      setName("");
      setPhone("");
      setCanDrive("");
      setCapacity("");
      setLocation("");
      setOtherLocation("");
      setGrade("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to submit. " + err.message);
      } else {
        setError("Failed to submit.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-2 text-center tracking-tight drop-shadow-sm">Afterevent Rides Signup</h1>
        {weekLoading ? (
          <div className="text-center text-gray-500 mb-4">Loading afterevent week...</div>
        ) : aftereventWeek ? (
          <div className="text-center text-indigo-700 font-semibold mb-4">For: {aftereventWeek}</div>
        ) : (
          <div className="text-center text-red-500 font-medium mb-4">Afterevent week not set. Please check with an admin.</div>
        )}
        {weekError && <div className="text-center text-red-600 font-medium mb-2">{weekError}</div>}
        <p className="text-center text-gray-600 mb-7 text-base md:text-lg">Need a ride or can help drive after AACF? Fill out this quick form so we can match you!</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Name (First & Last) <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-gray-900" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-gray-900" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Grade/Year <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-gray-900" value={grade} onChange={e => setGrade(e.target.value)} required>
              <option value="">Select your grade/year</option>
              {gradeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Can you drive? <span className="text-red-500">*</span></label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <input type="radio" name="canDrive" value="Yes" checked={canDrive === "Yes"} onChange={e => setCanDrive(e.target.value)} required /> Yes
              </label>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <input type="radio" name="canDrive" value="No" checked={canDrive === "No"} onChange={e => setCanDrive(e.target.value)} required /> No
              </label>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <input type="radio" name="canDrive" value="Self" checked={canDrive === "Self"} onChange={e => setCanDrive(e.target.value)} required /> I will be driving myself
              </label>
            </div>
          </div>
          {canDrive === "Yes" && (
            <div>
              <label className="block font-semibold text-gray-800 mb-1">If so, how many can you take (including yourself)?</label>
              <input type="number" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-gray-900" value={capacity} onChange={e => setCapacity(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Where do you live? <span className="text-red-500">*</span></label>
            <div className="flex flex-col gap-2 mt-1">
              {locationOptions.map(option => (
                <label key={option} className="flex items-center gap-2 font-medium text-gray-700">
                  <input
                    type="radio"
                    name="location"
                    value={option}
                    checked={location === option}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                  {option === "Other" ? "Other..." : option}
                </label>
              ))}
              {location === "Other" && (
                <input
                  type="text"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-gray-900"
                  placeholder="Please specify..."
                  value={otherLocation}
                  onChange={e => setOtherLocation(e.target.value)}
                  required
                />
              )}
            </div>
          </div>
          {error && <div className="text-red-600 font-medium text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 font-medium text-sm text-center">{success}</div>}
          <button type="submit" className="mt-2 py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
        </form>
      </div>
    </div>
  );
} 