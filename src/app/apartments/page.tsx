"use client";
import { useState } from 'react';
import { useUserApartment } from '@/hooks/useUserApartment';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { useAuth } from '@/lib/useAuth';
import AvailabilityForm from '@/components/AvailabilityForm';
import AvailabilityList from '@/components/AvailabilityList';
import UserProfile from '@/components/UserProfile';
import type { AvailabilityFormData } from '@/types/apartment';

export default function ApartmentsPage() {
  const { user } = useAuth();
  const { userApartment, loading: userLoading } = useUserApartment();
  const {
    slots,
    loading: availabilityLoading,
    error,
    success,
    createAvailabilitySlot,
    deleteAvailabilitySlot,
    clearMessages,
  } = useAvailabilityManagement();

  const [showForm, setShowForm] = useState(false);

  const handleCreateAvailability = async (availabilityData: AvailabilityFormData) => {
    if (!user || !userApartment) return;
    
    await createAvailabilitySlot(
      availabilityData,
      userApartment.name,
      user.uid,
      user.email || '',
      user.displayName || 'Unknown User'
    );
    setShowForm(false);
  };

  const handleDeleteAvailability = async (slotId: string) => {
    if (confirm('Are you sure you want to delete this availability slot?')) {
      await deleteAvailabilitySlot(slotId);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏠 Apartment Hosting</h1>
            <p className="text-gray-600 mt-2">
              Find apartments open for hangouts or post your own availability
            </p>
          </div>
          <UserProfile />
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearMessages}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearMessages}
                  className="text-green-400 hover:text-green-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User's Apartment Status */}
        {userApartment ? (
          <div className="bg-white rounded-lg shadow border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Apartment: {userApartment.name}
                </h2>
                {userApartment.description && (
                  <p className="text-gray-600 mt-1">{userApartment.description}</p>
                )}
                {userApartment.address && (
                  <p className="text-gray-500 text-sm mt-1">📍 {userApartment.address}</p>
                )}
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Post Availability
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">🏠</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  No Apartment Assignment
                </h3>
                                  <p className="text-sm text-yellow-700 mt-1">
                    You haven&apos;t been assigned to an apartment yet. Contact an admin to get assigned to an apartment so you can post availability.
                  </p>
              </div>
            </div>
          </div>
        )}

        {/* Availability Form Modal */}
        {showForm && userApartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Post Availability
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                
                <AvailabilityForm
                  onSubmit={handleCreateAvailability}
                  loading={availabilityLoading}
                  apartmentId={userApartment.id}
                  apartmentName={userApartment.name}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Availability List */}
        <AvailabilityList
          slots={slots}
          loading={availabilityLoading}
          onDelete={userApartment ? handleDeleteAvailability : undefined}
          showDeleteButton={!!userApartment}
          title="All Apartment Availability"
        />
      </div>
    </div>
  );
} 