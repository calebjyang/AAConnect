"use client";
import { useEffect, useState } from 'react';
import { useRecapManagement } from '@/hooks/admin/useRecapManagement';
import RecapForm from './RecapForm';
import RecapList from './RecapList';
import type { Recap } from '@/hooks/admin/useRecapManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function RecapManagement() {
  const {
    recaps,
    loading,
    error,
    success,
    createRecap,
    deleteRecap,
    updateRecap,
    clearMessages,
  } = useRecapManagement();

  const [editingRecap, setEditingRecap] = useState<Recap | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  const handleFormSubmit = async (data: any, id?: string) => {
    if (id) {
      await updateRecap(id, data);
      setEditingRecap(null);
    } else {
      await createRecap(data);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recap Management</h2>
        <p className="text-gray-600">Create and manage recaps for your community</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recap Form */}
        <div>
          <RecapForm 
            onSubmit={handleFormSubmit} 
            loading={loading} 
          />
        </div>

        {/* Recap List */}
        <div>
          <RecapList 
            recaps={recaps} 
            onDelete={deleteRecap} 
            onEdit={(recap: Recap) => setEditingRecap(recap)}
            loading={loading} 
          />
        </div>
      </div>

      {/* Edit Event Modal */}
      <Dialog open={!!editingRecap} onOpenChange={open => { if (!open) setEditingRecap(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recap</DialogTitle>
          </DialogHeader>
          {editingRecap && (
            <RecapForm
              onSubmit={handleFormSubmit}
              loading={loading}
              initialValues={{
                id: editingRecap.id,
                title: editingRecap.title,
                date: editingRecap.date instanceof Date ? editingRecap.date.toISOString().slice(0,16) : editingRecap.date,
                location: editingRecap.location,
                sermonTopic: editingRecap.sermonTopic || "",
                summary: editingRecap.summary || ""
              }}
              onCancel={() => setEditingRecap(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 