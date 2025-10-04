"use client";
import { useState, useEffect } from 'react';
import type { RecapData } from '@/hooks/admin/useRecapManagement';

interface EventFormProps {
  onSubmit: (formData: RecapData, id?: string) => Promise<void>;
  loading?: boolean;
  initialValues?: Partial<RecapData> & { id?: string };
  onCancel?: () => void;
}

export default function EventForm({ onSubmit, loading = false, initialValues, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    date: initialValues?.date ? (typeof initialValues.date === 'string' ? initialValues.date : new Date(initialValues.date).toISOString().slice(0,16)) : "",
    location: initialValues?.location || "",
    sermonTopic: initialValues?.sermonTopic || "",
    summary: initialValues?.summary || "",
  });

  useEffect(() => {
    setFormData({
      title: initialValues?.title || "",
      date: initialValues?.date ? (typeof initialValues.date === 'string' ? initialValues.date : new Date(initialValues.date).toISOString().slice(0,16)) : "",
      location: initialValues?.location || "",
      sermonTopic: initialValues?.sermonTopic || "",
      summary: initialValues?.summary || "",
    });
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.location) {
      return;
    }

    // Only include fields with non-empty values
    const eventData: RecapData = Object.fromEntries(
      Object.entries({
        title: formData.title,
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        location: formData.location,
        sermonTopic: formData.sermonTopic,
        summary: formData.summary
      }).filter(([_, v]) => v !== undefined && v !== "")
    ) as unknown as RecapData;

    await onSubmit(eventData, initialValues?.id);
    
    // Reset form on successful submission
    if (!initialValues?.id) {
      setFormData({
        title: "",
        date: "",
        location: "",
        sermonTopic: "",
        summary: "",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 max-w-xl border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{initialValues?.id ? 'Edit Recap' : 'Create New Recap'}</h3>
      
      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-title">
          Title<span className="text-red-500 ml-1">*</span>
        </label>
        <input 
          id="event-title" 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
          value={formData.title} 
          onChange={e => handleInputChange('title', e.target.value)} 
          required 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-date">
          Date & Time<span className="text-red-500 ml-1">*</span>
        </label>
        <input 
          id="event-date" 
          type="datetime-local" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
          value={formData.date} 
          onChange={e => handleInputChange('date', e.target.value)} 
          required 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-location">
          Location<span className="text-red-500 ml-1">*</span>
        </label>
        <input 
          id="event-location" 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
          value={formData.location} 
          onChange={e => handleInputChange('location', e.target.value)} 
          required 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-description">
          Sermon Topic<span className="text-red-500 ml-1">*</span>
        </label>
        <textarea 
          id="event-description" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
          value={formData.sermonTopic} 
          onChange={e => handleInputChange('sermonTopic', e.target.value)} 
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-description">
          Summary<span className="text-red-500 ml-1">*</span>
        </label>
        <textarea 
          id="event-description" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
          value={formData.summary} 
          onChange={e => handleInputChange('summary', e.target.value)} 
          required
        />
      </div>

      <div className="flex gap-4 mt-2">
        <button 
          type="submit" 
          className="py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? (initialValues?.id ? 'Updating...' : 'Creating...') : (initialValues?.id ? 'Update Recap' : 'Create Recap')}
        </button>
        {initialValues?.id && onCancel && (
          <button
            type="button"
            className="py-2 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold shadow transition"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 