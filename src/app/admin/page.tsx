"use client";
import AdminRoute from "@/components/AdminRoute";
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { assignCarpools, getAssignmentStats, exportAssignmentsCSV, type RideSignup, type CarpoolAssignment, type AssignmentResult } from "@/lib/carpoolAlgorithm";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import CarpoolManagement from '@/components/admin/CarpoolManagement/CarpoolManagement';
import { EventManagement } from '@/components/admin/EventManagement';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
  useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
            <a href="#rides" className="text-white/90 hover:text-yellow-200 font-semibold text-lg transition">Rides</a>
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

// Define EventData and Event types


function RidesAdmin() {
  const [signups, setSignups] = useState<RideSignupAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [assignments, setAssignments] = useState<AssignmentResult | null>(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [editingAssignments, setEditingAssignments] = useState<AssignmentResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to parse and sort afterevent weeks
  function parseWeekLabel(label: string): { quarter: number; week: number } {
    // Expects format 'Fall Week 5', 'Winter Week 10', etc
    const match = label.match(/^(Fall|Winter|Spring) Week (\d{1,2})$/);
    if (!match) return { quarter: -1, week: -1 };
    const quarterOrder: Record<string, number> = { Fall: 0, Winter: 1, Spring: 2 };
    return { quarter: quarterOrder[match[1]], week: parseInt(match[2], 10) };
  }

  useEffect(() => {
    async function fetchSignups() {
      setLoading(true);
      setError("");
      try {
        const querySnapshot = await getDocs(collection(db, "rides"));
        const data: RideSignupAdmin[] = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as Omit<RideSignupAdmin, "id">) }));
        setSignups(data);
        // Set default week to most recent by quarter/week order
        const weeks = Array.from(new Set(data.map(s => s.aftereventWeek).filter(Boolean)));
        if (weeks.length > 0) {
          const sorted = weeks.slice().sort((a, b) => {
            const pa = parseWeekLabel(a);
            const pb = parseWeekLabel(b);
            if (pa.quarter !== pb.quarter) return pa.quarter - pb.quarter;
            return pa.week - pb.week;
          });
          setSelectedWeek(sorted[sorted.length - 1]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("Failed to load ride signups. " + err.message);
        } else {
          setError("Failed to load ride signups.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSignups();
  }, []);

  // Get unique afterevent weeks for filter dropdown
  const weeks = Array.from(new Set(signups.map(s => s.aftereventWeek).filter(Boolean)));
  // Sort weeks by actual quarter/week order for dropdown
  const sortedWeeks = weeks.slice().sort((a, b) => {
    const pa = parseWeekLabel(a);
    const pb = parseWeekLabel(b);
    if (pa.quarter !== pb.quarter) return pa.quarter - pb.quarter;
    return pa.week - pb.week;
  });
  const filtered = selectedWeek ? signups.filter(s => s.aftereventWeek === selectedWeek) : signups;

  function exportCSV() {
    const headers = ["Name", "Phone", "Can Drive", "Capacity", "Location", "Afterevent Week", "Submitted At"];
    const rows = filtered.map(s => [s.name, s.phone, s.canDrive, s.capacity ?? "", s.location, s.aftereventWeek, s.submittedAt]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${(x ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rides-${selectedWeek || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function testAssignment() {
    if (!selectedWeek) {
      alert("Please select a week first!");
      return;
    }
    // Convert RideSignupAdmin to RideSignup format
    const rideSignups: RideSignup[] = filtered.map(s => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      canDrive: s.canDrive,
      location: s.location,
      aftereventWeek: s.aftereventWeek,
      submittedAt: s.submittedAt,
      capacity: s.capacity
    }));
    const result = assignCarpools(rideSignups, selectedWeek);
    setAssignments(result);
    setEditingAssignments(result);
    setShowAssignments(true);
    setIsEditing(false);
  }

  function startEditing() {
    if (!assignments) return;
    setEditingAssignments(JSON.parse(JSON.stringify(assignments))); // Deep copy
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditingAssignments(assignments);
    setIsEditing(false);
  }

  function saveAssignments() {
    if (!editingAssignments) return;
    setSaving(true);
    // TODO: Save to database
    setTimeout(() => {
      setAssignments(editingAssignments);
      setIsEditing(false);
      setSaving(false);
    }, 1000);
  }

  function handleDragStart(event: any) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    if (!editingAssignments) return;
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string; // rider id
    const overId = over.id as string;

    // Find the source and destination containers
    let sourceCarIndex: number | null = null;
    let destCarIndex: number | null = null;
    let rider: RideSignup | null = null;
    const newAssignments = { ...editingAssignments };

    // Find and remove the rider from its current location
    // Check cars
    for (let i = 0; i < newAssignments.assignments.length; i++) {
      const idx = newAssignments.assignments[i].riders.findIndex(r => r.id === activeId);
      if (idx !== -1) {
        rider = newAssignments.assignments[i].riders[idx];
        newAssignments.assignments[i].riders.splice(idx, 1);
        newAssignments.assignments[i].usedCapacity--;
        sourceCarIndex = i;
        break;
      }
    }
    // Check unassigned
    if (!rider) {
      const idx = newAssignments.unassignedRiders.findIndex(r => r.id === activeId);
      if (idx !== -1) {
        rider = newAssignments.unassignedRiders[idx];
        newAssignments.unassignedRiders.splice(idx, 1);
      }
    }
    if (!rider) return;

    // Determine destination
    if (overId === 'unassigned') {
      newAssignments.unassignedRiders.push(rider);
    } else if (overId.startsWith('car-')) {
      const carIdx = parseInt(overId.split('-')[1]);
      if (!isNaN(carIdx)) {
        const assignment = newAssignments.assignments[carIdx];
        if (assignment.usedCapacity < assignment.totalCapacity) {
          assignment.riders.push(rider);
          assignment.usedCapacity++;
        } else {
          // If full, put back in unassigned
          newAssignments.unassignedRiders.push(rider);
        }
      }
    } else {
      // If dropped over a rider, find its container
      for (let i = 0; i < newAssignments.assignments.length; i++) {
        if (newAssignments.assignments[i].riders.some(r => r.id === overId)) {
          destCarIndex = i;
          break;
        }
      }
      const droppedInUnassigned = newAssignments.unassignedRiders.some(r => r.id === overId);
      if (destCarIndex !== null) {
        const assignment = newAssignments.assignments[destCarIndex];
        if (assignment.usedCapacity < assignment.totalCapacity) {
          assignment.riders.push(rider);
          assignment.usedCapacity++;
        } else {
          newAssignments.unassignedRiders.push(rider);
        }
      } else if (droppedInUnassigned) {
        newAssignments.unassignedRiders.push(rider);
      } else {
        // If not dropped in a valid container, revert the move (put back where it was)
        if (sourceCarIndex !== null) {
          newAssignments.assignments[sourceCarIndex].riders.push(rider);
          newAssignments.assignments[sourceCarIndex].usedCapacity++;
        } else {
          newAssignments.unassignedRiders.push(rider);
        }
      }
    }

    setEditingAssignments(newAssignments);
  }

  function exportAssignments() {
    if (!assignments) return;
    const csv = exportAssignmentsCSV(assignments);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carpool-assignments-${selectedWeek}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
        <label className="font-semibold text-gray-700">Filter by week:</label>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition w-full sm:w-auto"
          value={selectedWeek}
          onChange={e => setSelectedWeek(e.target.value)}
        >
          <option value="">All weeks</option>
          {sortedWeeks.map(week => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
        <button
          className="py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={exportCSV}
          disabled={filtered.length === 0}
        >
          Export CSV
        </button>
        <button
          className="py-2 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={testAssignment}
          disabled={!selectedWeek || filtered.length === 0}
        >
          Test Assignment
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading ride signups...</div>
      ) : error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No ride signups found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border text-gray-800 font-bold">Name</th>
                <th className="px-3 py-2 border text-gray-800 font-bold">Phone</th>
                <th className="px-3 py-2 border text-gray-800 font-bold">Can Drive</th>
                <th className="px-3 py-2 border text-gray-800 font-bold">Capacity</th>
                <th className="px-3 py-2 border text-gray-800 font-bold">Location</th>
                <th className="px-3 py-2 border text-gray-800 font-bold">Afterevent Week</th>
                <th className="px-3 py-2 border text-gray-800 font-bold">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="px-3 py-2 border text-gray-700">{s.name}</td>
                  <td className="px-3 py-2 border text-gray-700">{s.phone}</td>
                  <td className="px-3 py-2 border text-gray-700">{s.canDrive}</td>
                  <td className="px-3 py-2 border text-gray-700">{s.capacity ?? ""}</td>
                  <td className="px-3 py-2 border text-gray-700">{s.location}</td>
                  <td className="px-3 py-2 border text-gray-700">{s.aftereventWeek}</td>
                  <td className="px-3 py-2 border text-gray-700">{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Assignment Results */}
      {showAssignments && assignments && (
        <div className="mt-8 bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-aacf-blue">Carpool Assignments</h3>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition"
                    onClick={startEditing}
                  >
                    Edit Assignments
                  </button>
                  <button
                    className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
                    onClick={exportAssignments}
                  >
                    Export Assignments
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="py-2 px-4 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow transition"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition disabled:opacity-60"
                    onClick={saveAssignments}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Stats */}
          {(() => {
            const currentAssignments = isEditing ? editingAssignments : assignments;
            const stats = currentAssignments ? getAssignmentStats(currentAssignments) : null;
            return stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-aacf-blue">{stats.totalPeople}</div>
                  <div className="text-sm text-gray-600">Total People</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.assignedPeople}</div>
                  <div className="text-sm text-gray-600">Assigned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.unassignedPeople}</div>
                  <div className="text-sm text-gray-600">Unassigned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.assignmentRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            ) : null;
          })()}
          
          {/* Overflow Message */}
          {(() => {
            const currentAssignments = isEditing ? editingAssignments : assignments;
            return currentAssignments?.overflowMessage ? (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-800 font-medium">{currentAssignments.overflowMessage}</div>
              </div>
            ) : null;
          })()}
          
          {/* Interactive Assignments */}
          {isEditing && editingAssignments ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Car Assignments */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Cars</h4>
                  {editingAssignments.assignments.map((assignment, carIndex) => (
                    <CarDroppable
                      key={`car-${carIndex}`}
                      id={`car-${carIndex}`}
                      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                        assignment.usedCapacity >= assignment.totalCapacity
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-800">
                          🚗 {assignment.driver.name} ({assignment.driver.location})
                        </h5>
                        <span className={`text-sm font-medium ${
                          assignment.usedCapacity >= assignment.totalCapacity 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {assignment.usedCapacity}/{assignment.totalCapacity} spots
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        📞 {assignment.driver.phone}
                      </div>
                      <div className="space-y-2">
                        {assignment.riders.map((rider) => (
                          <SortableRider
                            key={rider.id}
                            id={rider.id}
                            rider={rider}
                          />
                        ))}
                      </div>
                    </CarDroppable>
                  ))}
                </div>

                {/* Unassigned Riders */}
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg mb-4">Unassigned Riders</h4>
                  <UnassignedDroppable className="border-2 border-dashed rounded-lg p-4 min-h-[200px] border-gray-300 bg-gray-50">
                    {editingAssignments.unassignedRiders.length === 0 ? (
                      <div className="text-gray-500 text-center py-8">
                        No unassigned riders
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {editingAssignments.unassignedRiders.map((rider) => (
                          <SortableRider
                            key={rider.id}
                            id={rider.id}
                            rider={rider}
                            isUnassigned
                          />
                        ))}
                      </div>
                    )}
                  </UnassignedDroppable>
                </div>
              </div>
              <DragOverlay>
                {activeId ? (() => {
                  // Find the rider by id in assignments or unassigned
                  const rider = editingAssignments.assignments.flatMap(a => a.riders).concat(editingAssignments.unassignedRiders).find(r => r.id === activeId);
                  if (!rider) return null;
                  // Create an exact copy of the rider card for the overlay
                  const isUnassigned = editingAssignments.unassignedRiders.some(r => r.id === rider.id);
                  return (
                    <div
                      className={`p-2 bg-white border rounded shadow-sm ${
                        isUnassigned ? 'border-red-200' : 'border-gray-200'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        isUnassigned ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        👤 {rider.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {rider.location} • 📞 {rider.phone}
                      </div>
                    </div>
                  );
                })() : null}
              </DragOverlay>
            </DndContext>
          ) : (
            /* Read-only Assignments List */
            <div className="space-y-4">
              {assignments?.assignments.map((assignment: CarpoolAssignment, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      🚗 {assignment.driver.name} ({assignment.driver.location})
                    </h4>
                    <span className="text-sm text-gray-600">
                      {assignment.usedCapacity}/{assignment.totalCapacity} spots
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    📞 {assignment.driver.phone}
                  </div>
                  {assignment.riders.length > 0 ? (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Passengers:</div>
                      <ul className="space-y-1">
                        {assignment.riders.map((rider: RideSignup, riderIndex: number) => (
                          <li key={riderIndex} className="text-sm text-gray-600 flex items-center gap-2">
                            <span>👤 {rider.name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{rider.location}</span>
                            <span className="text-gray-400">•</span>
                            <span>📞 {rider.phone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No passengers assigned</div>
                  )}
                </div>
              ))}
              
              {/* Unassigned Riders */}
              {assignments?.unassignedRiders.length > 0 && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Unassigned Riders ({assignments.unassignedRiders.length})</h4>
                  <ul className="space-y-1">
                    {assignments.unassignedRiders.map((rider: RideSignup, index: number) => (
                      <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                        <span>👤 {rider.name}</span>
                        <span className="text-red-400">•</span>
                        <span>{rider.location}</span>
                        <span className="text-red-400">•</span>
                        <span>📞 {rider.phone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Draggable Rider Component
function SortableRider({ id, rider, isUnassigned = false }: { 
  id: string; 
  rider: RideSignup; 
  isUnassigned?: boolean; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-2 bg-white border rounded shadow-sm cursor-move ${
        isUnassigned 
          ? 'border-red-200' 
          : 'border-gray-200'
      } ${isDragging ? 'invisible' : ''}`}
    >
      <div className={`text-sm font-medium ${
        isUnassigned ? 'text-red-800' : 'text-gray-800'
      }`}>
        👤 {rider.name}
      </div>
      <div className="text-xs text-gray-600">
        {rider.location} • 📞 {rider.phone}
      </div>
    </div>
  );
}

// RideSignupAdmin type for admin view
interface RideSignupAdmin {
  id: string;
  name: string;
  phone: string;
  canDrive: string;
  location: string;
  aftereventWeek: string;
  submittedAt: string;
  capacity?: string;
}

// CarDroppable component
function CarDroppable({ id, children, ...props }: { id: string; children: React.ReactNode; [key: string]: any }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} id={id} {...props}>
      {children}
    </div>
  );
}

// UnassignedDroppable component
function UnassignedDroppable({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  const { setNodeRef } = useDroppable({ id: 'unassigned' });
  return (
    <div ref={setNodeRef} id="unassigned" {...props}>
      {children}
    </div>
  );
}