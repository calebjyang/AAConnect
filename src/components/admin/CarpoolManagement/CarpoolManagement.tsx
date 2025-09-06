"use client";
import { useState } from 'react';
import { useCarpoolManagement } from '@/hooks/admin/useCarpoolManagement';
import CarpoolList from './CarpoolList';
import CarpoolForm from './CarpoolForm';
import CarpoolSignupsList from './CarpoolSignupsList';

export default function CarpoolManagement() {
  const {
    loading,
    error,
    weeks,
    selectedWeek,
    setSelectedWeek,
    exportCSV,
    testAssignment,
    assignments,
    showAssignments,
    editingAssignments,
    isEditing,
    startEditing,
    cancelEditing,
    saveAssignments,
    saving,
    exportAssignments,
    filteredSignups,
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd,
    getAssignmentStats,
    signups,
    deleteSignup,
    updateSignup,
  } = useCarpoolManagement();

  const [showForm, setShowForm] = useState(false);

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
          {weeks.map(week => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
        <button
          className="py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={exportCSV}
          disabled={filteredSignups.length === 0}
        >
          Export CSV
        </button>
        <button
          className="py-2 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={testAssignment}
          disabled={!selectedWeek || filteredSignups.length === 0}
        >
          Test Assignment
        </button>
        <button
          className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Close Form' : 'Add Signup'}
        </button>
      </div>

      {/* Signups Section */}
      <CarpoolSignupsList
        signups={signups}
        onDelete={deleteSignup}
        onEdit={updateSignup}
        loading={loading}
      />

      {/* Add Signup Form */}
      {showForm && (
        <CarpoolForm
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Carpool Assignments */}
      {loading ? (
        <div className="text-gray-500">Loading ride signups...</div>
      ) : error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : filteredSignups.length === 0 ? (
        <div className="text-gray-500">No ride signups found.</div>
      ) : (
        <>
          {showAssignments && assignments && (
            <CarpoolList
              assignments={assignments}
              editingAssignments={editingAssignments}
              isEditing={isEditing}
              saving={saving}
              activeId={activeId}
              sensors={sensors}
              onEdit={startEditing}
              onSave={saveAssignments}
              onCancel={cancelEditing}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              getAssignmentStats={getAssignmentStats}
              onExport={exportAssignments}
            />
          )}
        </>
      )}
    </div>
  );
} 