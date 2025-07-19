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
    <>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Signup</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name (First & Last) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Where do you live? <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition"
              required
            >
              <option value="" className="text-gray-500">Select your location</option>
              <option value="Middle Earth">Middle Earth</option>
              <option value="Mesa Court">Mesa Court</option>
              <option value="Berk">Berk</option>
              <option value="Cornell">Cornell</option>
              <option value="Other UTC (NOT Berk/Cornell)">Other UTC (NOT Berk/Cornell)</option>
              <option value="Plaza">Plaza</option>
              <option value="Other ACC (NOT Plaza)">Other ACC (NOT Plaza)</option>
              <option value="Other...">Other...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Can you drive? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="canDrive"
                  value="Yes"
                  checked={formData.canDrive === 'Yes'}
                  onChange={(e) => handleChange('canDrive', e.target.value)}
                  className="mr-3 text-aacf-blue focus:ring-aacf-blue"
                  required
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="canDrive"
                  value="No"
                  checked={formData.canDrive === 'No'}
                  onChange={(e) => handleChange('canDrive', e.target.value)}
                  className="mr-3 text-aacf-blue focus:ring-aacf-blue"
                  required
                />
                <span className="text-gray-700">No</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="canDrive"
                  value="I will be driving myself"
                  checked={formData.canDrive === 'I will be driving myself'}
                  onChange={(e) => handleChange('canDrive', e.target.value)}
                  className="mr-3 text-aacf-blue focus:ring-aacf-blue"
                  required
                />
                <span className="text-gray-700">I will be driving myself</span>
              </label>
            </div>
          </div>

          {(formData.canDrive === 'Yes' || formData.canDrive === 'I will be driving myself') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How many passengers can you take?
              </label>
                              <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.capacity || ''}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition"
                  placeholder="Number of passengers"
                />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              After Event Week <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.aftereventWeek || ''}
              onChange={(e) => handleChange('aftereventWeek', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition"
              required
            >
              <option value="" className="text-gray-500">Select week...</option>
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

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-aacf-blue text-white rounded-lg font-semibold hover:bg-aacf-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
} 