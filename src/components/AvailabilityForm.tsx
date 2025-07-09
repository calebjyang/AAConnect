"use client";
import { useState } from 'react';
import type { AvailabilityFormData } from '@/types/apartment';

interface AvailabilityFormProps {
  onSubmit: (_data: AvailabilityFormData) => Promise<void>;
  loading?: boolean;
  apartmentId: string;
  apartmentName: string;
}

export default function AvailabilityForm({
  onSubmit,
  loading = false,
  apartmentId,
  apartmentName
}: AvailabilityFormProps) {
  const [formData, setFormData] = useState<AvailabilityFormData>({
    apartmentId,
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    description: '',
    maxGuests: null,
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.time = 'End time must be after start time';
    }

    if (formData.startTime < new Date()) {
      newErrors.time = 'Start time cannot be in the past';
    }

    if (formData.maxGuests !== null && formData.maxGuests !== undefined && (formData.maxGuests < 1 || formData.maxGuests > 20)) {
      newErrors.maxGuests = 'Max guests must be between 1 and 20';
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
      // Reset form on successful submission
      setFormData({
        apartmentId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        description: '',
        maxGuests: null,
        tags: [],
      });
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: keyof AvailabilityFormData, value: any) => {
    if ((field === 'startTime' || field === 'endTime')) {
      if (value === '' || value === undefined) {
        setFormData(prev => ({ ...prev, [field]: undefined }));
        if (errors[field as string]) {
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
        return;
      }
      // value is a string from input like "2024-01-15T14:00"
      // Create date in local timezone, not UTC
      const [datePart, timePart] = value.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      
      // Create date in local timezone
      const date = new Date(year, month - 1, day, hour, minute);
      
      if (isNaN(date.getTime())) {
        setFormData(prev => ({ ...prev, [field]: undefined }));
        if (errors[field as string]) {
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
        return;
      }
      setFormData(prev => ({ ...prev, [field]: date }));
      if (errors[field as string]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date || isNaN(date.getTime())) return '';
    // Format in local timezone, not UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm text-indigo-800 font-medium">
          <span className="font-semibold">Posting for:</span> {apartmentName}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="startTime" className="block font-semibold text-gray-800 mb-1">
            Start Time<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="datetime-local"
            id="startTime"
            defaultValue={formData.startTime ? formatDateTime(formData.startTime) : ''}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition ${
              errors.time ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''
            }`}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="endTime" className="block font-semibold text-gray-800 mb-1">
            End Time<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="datetime-local"
            id="endTime"
            defaultValue={formData.endTime ? formatDateTime(formData.endTime) : ''}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition ${
              errors.time ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''
            }`}
            disabled={loading}
          />
        </div>
      </div>

      {errors.time && (
        <div className="text-red-600 font-medium text-sm">{errors.time}</div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="block font-semibold text-gray-800 mb-1">
          Description<span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition ${
            errors.description ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''
          }`}
          placeholder="e.g., Extra pizza and Smash! Come hang out and play games"
          disabled={loading}
        />
        {errors.description && (
          <div className="text-red-600 font-medium text-sm">{errors.description}</div>
        )}
        <span className="text-xs text-gray-400">
          {formData.description.length}/200 characters
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1">
          Tags <span className="text-gray-500 font-normal">(select all that apply)</span>
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            { key: 'snacks', label: 'Snacks', icon: '🍿' },
            { key: 'games', label: 'Games', icon: '🎲' },
            { key: 'study', label: 'Study', icon: '📚' },
            { key: 'yap', label: 'Yap', icon: '🗣️' },
            { key: 'quiet', label: 'Quiet', icon: '🤫' },
            { key: 'prayer', label: 'Prayer', icon: '🙏' },
            { key: 'jam', label: 'Jam Sesh', icon: '🎸' },
          ].map(tag => (
            <button
              key={tag.key}
              type="button"
              className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                formData.tags?.includes(tag.key)
                  ? 'bg-blue-100 border-blue-400 text-blue-800'
                  : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  tags: prev.tags?.includes(tag.key)
                    ? prev.tags.filter(t => t !== tag.key)
                    : [...(prev.tags || []), tag.key],
                }));
              }}
              aria-pressed={formData.tags?.includes(tag.key) ? 'true' : 'false'}
            >
              <span>{tag.icon}</span> {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="maxGuests" className="block font-semibold text-gray-800 mb-1">
          Max Guests <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="number"
          id="maxGuests"
          value={formData.maxGuests || ''}
          onChange={(e) => handleInputChange('maxGuests', e.target.value ? parseInt(e.target.value) : null)}
          min="1"
          max="20"
          className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition ${
            errors.maxGuests ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''
          }`}
          placeholder="Leave empty for unlimited"
          disabled={loading}
        />
        {errors.maxGuests && (
          <div className="text-red-600 font-medium text-sm">{errors.maxGuests}</div>
        )}
        <span className="text-xs text-gray-400">
          Maximum number of guests you can accommodate
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Posting...' : 'Post Availability'}
      </button>
    </form>
  );
} 