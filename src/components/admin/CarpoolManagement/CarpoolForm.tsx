"use client";
import { useState, useEffect, useCallback, memo } from 'react';
import type { RideSignupAdmin } from '@/hooks/admin/useCarpoolManagement';

interface CarpoolFormProps {
  initialValues?: Partial<RideSignupAdmin>;
  onSubmit: (_formData: Omit<RideSignupAdmin, 'id'>) => Promise<void>;
  loading?: boolean;
  aftereventWeeks: string[];
}

const defaultForm = {
  name: '',
  phone: '',
  canDrive: 'no',
  capacity: '',
  location: '',
  aftereventWeek: '',
  submittedAt: '',
};

/**
 * Form component for adding and editing carpool ride signups
 * 
 * This component provides a comprehensive form interface for managing ride signups
 * with the following features:
 * - Add new signups with validation
 * - Edit existing signups with pre-populated data
 * - Real-time form validation
 * - Dynamic capacity field based on driving ability
 * - Loading states and error handling
 * - Success feedback
 * 
 * @param {CarpoolFormProps} props - Component props
 * @param {Partial<RideSignupAdmin>} [props.initialValues] - Pre-populated form data for editing
 * @param {Function} props.onSubmit - Async function called when form is submitted
 * @param {boolean} [props.loading=false] - Whether the form is in a loading state
 * @param {string[]} props.aftereventWeeks - Available afterevent weeks for selection
 * 
 * @example
 * // Add new signup
 * <CarpoolForm 
 *   onSubmit={handleSubmit} 
 *   aftereventWeeks={['Fall Week 1', 'Fall Week 2']} 
 * />
 * 
 * // Edit existing signup
 * <CarpoolForm 
 *   initialValues={existingSignup}
 *   onSubmit={handleUpdate}
 *   aftereventWeeks={['Fall Week 1', 'Fall Week 2']}
 * />
 */
const CarpoolForm = memo(function CarpoolForm({ initialValues, onSubmit, loading = false, aftereventWeeks }: CarpoolFormProps) {
  const [form, setForm] = useState({ ...defaultForm, ...initialValues });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Updates form when initialValues change (for edit mode)
   * 
   * This effect ensures the form is properly reset when switching between
   * add and edit modes, or when editing different signups.
   */
  useEffect(() => {
    setForm({ ...defaultForm, ...initialValues });
  }, [initialValues]);

  /**
   * Handles form field changes and updates local state
   * 
   * @param {string} field - The form field name to update
   * @param {string} value - The new value for the field
   */
  const handleChange = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Handles form submission with validation and error handling
   * 
   * This function performs comprehensive validation before submission:
   * - Validates all required fields are filled
   * - Ensures capacity is provided for drivers
   * - Handles async submission with loading states
   * - Provides user feedback for success/error states
   * - Resets form on successful submission
   * 
   * @param {React.FormEvent} e - Form submission event
   * @throws {Error} When validation fails or submission errors occur
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    let localError = '';
    
    // Validation
    if (!form.name || !form.phone || !form.location || !form.aftereventWeek) {
      localError = 'Please fill in all required fields.';
    } else if (form.canDrive === 'yes' && (!form.capacity || isNaN(Number(form.capacity)))) {
      localError = 'Please enter a valid capacity for drivers.';
    }
    
    if (localError) {
      setError(localError);
      return;
    }
    
    try {
      await onSubmit({
        name: form.name,
        phone: form.phone,
        canDrive: form.canDrive,
        capacity: form.canDrive === 'yes' ? form.capacity : undefined,
        location: form.location,
        aftereventWeek: form.aftereventWeek,
        submittedAt: form.submittedAt || new Date().toISOString(),
      });
      setSuccess('Signup saved!');
      setForm(defaultForm);
    } catch (err: any) {
      setError(err.message || 'Failed to save signup.');
    }
  }, [form, onSubmit]);

  return (
    <form onSubmit={handleSubmit} data-testid="carpool-form" className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col gap-4 max-w-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{initialValues ? 'Edit Signup' : 'Add Signup'}</h3>
      {error && <div className="text-red-600 font-medium text-sm" data-testid="error-message">{error}</div>}
      {success && <div className="text-green-600 font-medium text-sm" data-testid="success-message">{success}</div>}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-semibold text-gray-800 mb-1">Name<span className="text-red-500 ml-1">*</span></label>
        <input id="name" type="text" className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900" value={form.name} onChange={e => handleChange('name', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="font-semibold text-gray-800 mb-1">Phone<span className="text-red-500 ml-1">*</span></label>
        <input id="phone" type="tel" className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="canDrive" className="font-semibold text-gray-800 mb-1">Can Drive?<span className="text-red-500 ml-1">*</span></label>
        <select id="canDrive" className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900" value={form.canDrive} onChange={e => handleChange('canDrive', e.target.value)}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
      {form.canDrive === 'yes' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="capacity" className="font-semibold text-gray-800 mb-1">Capacity<span className="text-red-500 ml-1">*</span></label>
          <input id="capacity" type="number" min="1" className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900" value={form.capacity} onChange={e => handleChange('capacity', e.target.value)} />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="font-semibold text-gray-800 mb-1">Location<span className="text-red-500 ml-1">*</span></label>
        <input id="location" type="text" className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900" value={form.location} onChange={e => handleChange('location', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="aftereventWeek" className="font-semibold text-gray-800 mb-1">Afterevent Week<span className="text-red-500 ml-1">*</span></label>
        <select id="aftereventWeek" className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900" value={form.aftereventWeek} onChange={e => handleChange('aftereventWeek', e.target.value)}>
          <option value="">Select week</option>
          {aftereventWeeks.map(week => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="mt-2 py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>{loading ? (initialValues ? 'Saving...' : 'Adding...') : (initialValues ? 'Save Changes' : 'Add Signup')}</button>
    </form>
  );
});

export default CarpoolForm; 