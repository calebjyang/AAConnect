"use client";
import type { RideSignupAdmin } from '@/hooks/admin/useCarpoolManagement';

interface CarpoolSignupsListProps {
  signups: RideSignupAdmin[];
  onEdit: (signup: RideSignupAdmin) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function CarpoolSignupsList({ signups, onEdit, onDelete, loading = false }: CarpoolSignupsListProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">
      <h3 className="text-lg font-bold text-aacf-blue mb-4">All Ride Signups</h3>
      {loading ? (
        <div className="text-gray-500">Loading signups...</div>
      ) : signups.length === 0 ? (
        <div className="text-gray-500">No signups found.</div>
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
                <th className="px-3 py-2 border text-gray-800 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {signups.map(signup => (
                <tr key={signup.id}>
                  <td className="px-3 py-2 border text-gray-700">{signup.name}</td>
                  <td className="px-3 py-2 border text-gray-700">{signup.phone}</td>
                  <td className="px-3 py-2 border text-gray-700">{signup.canDrive}</td>
                  <td className="px-3 py-2 border text-gray-700">{signup.capacity ?? ''}</td>
                  <td className="px-3 py-2 border text-gray-700">{signup.location}</td>
                  <td className="px-3 py-2 border text-gray-700">{signup.aftereventWeek}</td>
                  <td className="px-3 py-2 border text-gray-700">{signup.submittedAt ? new Date(signup.submittedAt).toLocaleString() : ''}</td>
                  <td className="px-3 py-2 border text-gray-700">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => onEdit(signup)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(signup.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 