"use client";
import { useState } from 'react';
import { useApartmentManagement } from '@/hooks/admin/useApartmentManagement';
import { useAuth } from '@/lib/useAuth';
import ApartmentForm from './ApartmentForm';
import ApartmentList from './ApartmentList';
import MemberAssignmentModal from './MemberAssignmentModal';
import type { Apartment, ApartmentFormData } from '@/types/apartment';

export default function ApartmentManagement() {
  const { user } = useAuth();
  const {
    apartments,
    members,
    loading,
    error,
    success,
    createApartment,
    updateApartment,
    deleteApartment,
    assignMemberToApartment,
    clearMessages,
  } = useApartmentManagement();

  const [showForm, setShowForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('');
  const [selectedApartmentName, setSelectedApartmentName] = useState<string>('');

  const handleCreateApartment = async (apartmentData: ApartmentFormData) => {
    if (!user?.email) return;
    await createApartment(apartmentData, user.email);
    setShowForm(false);
  };

  const handleUpdateApartment = async (apartmentData: ApartmentFormData) => {
    if (!editingApartment) return;
    await updateApartment(editingApartment.id, apartmentData);
    setEditingApartment(null);
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setShowForm(true);
  };

  const handleDeleteApartment = async (apartmentId: string) => {
    if (confirm('Are you sure you want to delete this apartment? This action cannot be undone.')) {
      await deleteApartment(apartmentId);
    }
  };

  const handleAssignMember = (apartmentId: string) => {
    const apartment = apartments.find(a => a.id === apartmentId);
    if (apartment) {
      setSelectedApartmentId(apartmentId);
      setSelectedApartmentName(apartment.name);
      setShowAssignmentModal(true);
    }
  };

  const handleMemberAssignment = async (
    userId: string,
    userEmail: string,
    userName: string,
    userPicture?: string
  ) => {
    await assignMemberToApartment(selectedApartmentId, userId, userEmail, userName, userPicture);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingApartment(null);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedApartmentId('');
    setSelectedApartmentName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Apartment Management</h2>
          <p className="text-gray-600 mt-1">
            Manage apartments and assign members to them
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Apartment
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
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

      {/* Apartment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingApartment ? 'Edit Apartment' : 'Create New Apartment'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  ✕
                </button>
              </div>
              
              <ApartmentForm
                onSubmit={editingApartment ? handleUpdateApartment : handleCreateApartment}
                loading={loading}
                initialData={editingApartment || {}}
                mode={editingApartment ? 'edit' : 'create'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Apartment List */}
      <ApartmentList
        apartments={apartments}
        members={members}
        onEdit={handleEditApartment}
        onDelete={handleDeleteApartment}
        onAssignMember={handleAssignMember}
        loading={loading}
      />

      {/* Member Assignment Modal */}
      <MemberAssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseAssignmentModal}
        apartmentId={selectedApartmentId}
        apartmentName={selectedApartmentName}
        onAssign={handleMemberAssignment}
        loading={loading}
      />
    </div>
  );
} 