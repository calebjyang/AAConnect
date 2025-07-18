"use client";
import { useState, useEffect } from 'react';
import type { RideSignupAdmin } from '@/hooks/admin/useCarpoolManagement';

interface EditSignupModalProps {
  signup: RideSignupAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<RideSignupAdmin>) => void;
}

export default function EditSignupModal({ signup, isOpen, onClose, onSave }: EditSignupModalProps) {
  const [formData, setFormData] = useState<Partial<RideSignupAdmin>>({});

  // Initialize form data when signup changes
  useEffect(() => {
    if (signup) {
      setFormData({
        name: signup.name,
        phone: signup.phone,
        location: signup.location,
        canDrive: signup.canDrive,
        capacity: signup.capacity || '',
        aftereventWeek: signup.aftereventWeek,
      });
    }
  }, [signup]);

  if (!isOpen || !signup) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(signup.id, formData);
    onClose();
  };

  const handleChange = (field: keyof RideSignupAdmin, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Edit Signup</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Can Drive
            </label>
            <select
              value={formData.canDrive || ''}
              onChange={(e) => handleChange('canDrive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue"
              required
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (if driving)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.capacity || ''}
              onChange={(e) => handleChange('capacity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue"
              placeholder="Number of passengers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              After Event Week
            </label>
            <select
              value={formData.aftereventWeek || ''}
              onChange={(e) => handleChange('aftereventWeek', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue"
              required
            >
              <option value="">Select week...</option>
              <option value="Fall Week 1">Fall Week 1</option>
              <option value="Fall Week 2">Fall Week 2</option>
              <option value="Fall Week 3">Fall Week 3</option>
              <option value="Fall Week 4">Fall Week 4</option>
              <option value="Winter Week 1">Winter Week 1</option>
              <option value="Winter Week 2">Winter Week 2</option>
              <option value="Winter Week 3">Winter Week 3</option>
              <option value="Winter Week 4">Winter Week 4</option>
              <option value="Spring Week 1">Spring Week 1</option>
              <option value="Spring Week 2">Spring Week 2</option>
              <option value="Spring Week 3">Spring Week 3</option>
              <option value="Spring Week 4">Spring Week 4</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-aacf-blue text-white rounded-md hover:bg-aacf-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 