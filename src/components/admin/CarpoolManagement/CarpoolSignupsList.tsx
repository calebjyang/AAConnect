"use client";
import { useState } from 'react';
import type { RideSignupAdmin } from '@/hooks/admin/useCarpoolManagement';
import EditSignupModal from './EditSignupModal';

interface CarpoolSignupsListProps {
  signups: RideSignupAdmin[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, updates: Partial<RideSignupAdmin>) => void;
  loading?: boolean;
}

export default function CarpoolSignupsList({ signups, onDelete, onEdit, loading = false }: CarpoolSignupsListProps) {
  const [editingSignup, setEditingSignup] = useState<RideSignupAdmin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (signups.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <p className="text-gray-500 text-center">No signups found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 border text-gray-800 font-bold">Name</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Phone</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Location</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Can Drive</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Capacity</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Grade</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Week</th>
              <th className="px-3 py-2 border text-gray-800 font-bold">Submitted</th>
              {(onDelete || onEdit) && <th className="px-3 py-2 border text-gray-800 font-bold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {signups.map((signup) => (
              <tr key={signup.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border text-gray-700">{signup.name}</td>
                <td className="px-3 py-2 border text-gray-700">{signup.phone}</td>
                <td className="px-3 py-2 border text-gray-700">{signup.location}</td>
                <td className="px-3 py-2 border text-gray-700">{signup.canDrive}</td>
                <td className="px-3 py-2 border text-gray-700">{signup.capacity || '-'}</td>
                <td className="px-3 py-2 border text-gray-700">{signup.grade || '-'}</td>
                <td className="px-3 py-2 border text-gray-700">{signup.aftereventWeek}</td>
                <td className="px-3 py-2 border text-gray-700">
                  {new Date(signup.submittedAt).toLocaleDateString()}
                </td>
                {(onDelete || onEdit) && (
                  <td className="px-3 py-2 border text-gray-700">
                    <div className="flex flex-col gap-1">
                      {onEdit && (
                        <button
                          onClick={() => {
                            setEditingSignup(signup);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(signup.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Edit Modal */}
      <EditSignupModal
        signup={editingSignup}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSignup(null);
        }}
        onSave={(id, updates) => {
          onEdit?.(id, updates);
          setIsModalOpen(false);
          setEditingSignup(null);
        }}
      />
    </div>
  );
} 