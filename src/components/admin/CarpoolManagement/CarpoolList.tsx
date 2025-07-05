"use client";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { AssignmentResult, CarpoolAssignment, RideSignup } from '@/lib/carpoolAlgorithm';
import CarDroppable from './CarDroppable';
import UnassignedDroppable from './UnassignedDroppable';
import SortableRider from './SortableRider';

interface CarpoolListProps {
  assignments: AssignmentResult | null;
  editingAssignments: AssignmentResult | null;
  isEditing: boolean;
  saving: boolean;
  activeId: string | null;
  sensors: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  getAssignmentStats: (assignments: AssignmentResult) => any;
  onExport: () => void;
  onEditSignup: (signup: RideSignup) => void;
  onDeleteSignup: (id: string) => void;
}

export default function CarpoolList({
  assignments,
  editingAssignments,
  isEditing,
  saving,
  activeId,
  sensors,
  onEdit,
  onSave,
  onCancel,
  onDragStart,
  onDragEnd,
  getAssignmentStats,
  onExport,
  onEditSignup,
  onDeleteSignup,
}: CarpoolListProps) {
  // Choose which assignments to display
  const currentAssignments = isEditing ? editingAssignments : assignments;
  if (!currentAssignments) return null;
  const stats = getAssignmentStats(currentAssignments);

  // Find the active rider for DragOverlay
  let activeRider: RideSignup | undefined;
  if (isEditing && editingAssignments && activeId) {
    activeRider = [
      ...editingAssignments.assignments.flatMap(a => a.riders),
      ...editingAssignments.unassignedRiders,
    ].find(r => r.id === activeId);
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-aacf-blue">Carpool Assignments</h3>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition"
                onClick={onEdit}
              >
                Edit Assignments
              </button>
              <button
                className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
                onClick={onExport}
              >
                Export Assignments
              </button>
            </>
          ) : (
            <>
              <button
                className="py-2 px-4 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow transition"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition disabled:opacity-60"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
      {/* Stats */}
      {stats && (
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
      )}
      {/* Overflow Message */}
      {currentAssignments.overflowMessage && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-800 font-medium">{currentAssignments.overflowMessage}</div>
        </div>
      )}
      {/* DnD Editing UI */}
      {isEditing && editingAssignments ? (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
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
            {activeRider ? (
              <SortableRider id={activeRider.id} rider={activeRider} isUnassigned={editingAssignments.unassignedRiders.some(r => r.id === activeRider?.id)} />
            ) : null}
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
                        <button className="ml-2 text-blue-600 hover:underline text-xs" onClick={() => onEditSignup(rider)}>Edit</button>
                        <button className="ml-1 text-red-600 hover:underline text-xs" onClick={() => onDeleteSignup(rider.id)}>Delete</button>
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
          {assignments?.unassignedRiders && assignments.unassignedRiders.length > 0 && (
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
                    <button className="ml-2 text-blue-600 hover:underline text-xs" onClick={() => onEditSignup(rider)}>Edit</button>
                    <button className="ml-1 text-red-600 hover:underline text-xs" onClick={() => onDeleteSignup(rider.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 