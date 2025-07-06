"use client";
import { useState } from 'react';
import type { ApartmentFormData } from '@/types/apartment';

interface ApartmentFormProps {
  onSubmit: (apartmentData: ApartmentFormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<ApartmentFormData>;
  mode?: 'create' | 'edit';
}

export default function ApartmentForm({ 
  onSubmit, 
  loading = false, 
  initialData = {},
  mode = 'create'
}: ApartmentFormProps) {
  const [formData, setFormData] = useState<ApartmentFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    address: initialData.address || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Apartment name is required';
    }

    if (formData.name.length > 50) {
      newErrors.name = 'Apartment name must be 50 characters or less';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (formData.address && formData.address.length > 100) {
      newErrors.address = 'Address must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on successful creation
      if (mode === 'create') {
        setFormData({
          name: '',
          description: '',
          address: '',
        });
      }
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: keyof ApartmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Apartment Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="e.g., Treehouse, The Fridge"
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Optional description of the apartment"
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.address ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Optional address for reference"
          disabled={loading}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Apartment' : 'Update Apartment'}
        </button>
      </div>
    </form>
  );
} 