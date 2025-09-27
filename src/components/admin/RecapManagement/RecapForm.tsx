// "use client";
// import { useState, useEffect } from 'react';
// import type { RecapData } from '@/hooks/admin/useRecapManagement';

// interface EventFormProps {
//   onSubmit: (formData: RecapData, id?: string) => Promise<void>;
//   loading?: boolean;
//   initialValues?: Partial<RecapData> & { id?: string };
//   onCancel?: () => void;
// }

// export default function EventForm({ onSubmit, loading = false, initialValues, onCancel }: EventFormProps) {
//   const [formData, setFormData] = useState({
//     title: initialValues?.title || "",
//     date: initialValues?.date ? (typeof initialValues.date === 'string' ? initialValues.date : new Date(initialValues.date).toISOString().slice(0,16)) : "",
//     location: initialValues?.location || "",
//     description: initialValues?.description || "",
//     rsvpUrl: initialValues?.rsvpUrl || "",
//     ridesUrl: initialValues?.ridesUrl || "",
//   });

//   useEffect(() => {
//     setFormData({
//       title: initialValues?.title || "",
//       date: initialValues?.date ? (typeof initialValues.date === 'string' ? initialValues.date : new Date(initialValues.date).toISOString().slice(0,16)) : "",
//       location: initialValues?.location || "",
//       description: initialValues?.description || "",
//       rsvpUrl: initialValues?.rsvpUrl || "",
//       ridesUrl: initialValues?.ridesUrl || "",
//     });
//   }, [initialValues]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.date || !formData.location) {
//       return;
//     }

//     // Only include fields with non-empty values
//     const eventData: RecapData = Object.fromEntries(
//       Object.entries({
//         title: formData.title,
//         date: formData.date ? new Date(formData.date).toISOString() : undefined,
//         location: formData.location,
//         description: formData.description,
//         rsvpUrl: formData.rsvpUrl,
//         ridesUrl: formData.ridesUrl,
//       }).filter(([_, v]) => v !== undefined && v !== "")
//     ) as unknown as RecapData;

//     await onSubmit(eventData, initialValues?.id);
    
//     // Reset form on successful submission
//     if (!initialValues?.id) {
//       setFormData({
//         title: "",
//         date: "",
//         location: "",
//         description: "",
//         rsvpUrl: "",
//         ridesUrl: "",
//       });
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 max-w-xl border border-gray-100">
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">{initialValues?.id ? 'Edit Event' : 'Create New Event'}</h3>
      
//       <div className="flex flex-col gap-1">
//         <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-title">
//           Title<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input 
//           id="event-title" 
//           type="text" 
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
//           value={formData.title} 
//           onChange={e => handleInputChange('title', e.target.value)} 
//           required 
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-date">
//           Date & Time<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input 
//           id="event-date" 
//           type="datetime-local" 
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
//           value={formData.date} 
//           onChange={e => handleInputChange('date', e.target.value)} 
//           required 
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-location">
//           Location<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input 
//           id="event-location" 
//           type="text" 
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
//           value={formData.location} 
//           onChange={e => handleInputChange('location', e.target.value)} 
//           required 
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-description">
//           Description
//         </label>
//         <textarea 
//           id="event-description" 
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
//           value={formData.description} 
//           onChange={e => handleInputChange('description', e.target.value)} 
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-rsvp">
//           RSVP URL <span className='text-gray-500 font-normal'>(optional)</span>
//         </label>
//         <input 
//           id="event-rsvp" 
//           type="url" 
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
//           value={formData.rsvpUrl} 
//           onChange={e => handleInputChange('rsvpUrl', e.target.value)} 
//           placeholder="https://..." 
//         />
//         <span className="text-xs text-gray-400">Leave blank if no RSVP is needed</span>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="block font-semibold text-gray-800 mb-1" htmlFor="event-rides">
//           Rides Form URL <span className='text-gray-500 font-normal'>(optional)</span>
//         </label>
//         <input 
//           id="event-rides" 
//           type="url" 
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-aacf-blue focus:border-aacf-blue transition" 
//           value={formData.ridesUrl} 
//           onChange={e => handleInputChange('ridesUrl', e.target.value)} 
//           placeholder="https://..." 
//         />
//         <span className="text-xs text-gray-400">Leave blank if no rides form is needed</span>
//       </div>

//       <div className="flex gap-4 mt-2">
//         <button 
//           type="submit" 
//           className="py-2 px-4 rounded-md bg-aacf-blue hover:bg-aacf-blue-700 text-white font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed" 
//           disabled={loading}
//         >
//           {loading ? (initialValues?.id ? 'Updating...' : 'Creating...') : (initialValues?.id ? 'Update Event' : 'Create Event')}
//         </button>
//         {initialValues?.id && onCancel && (
//           <button
//             type="button"
//             className="py-2 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold shadow transition"
//             onClick={onCancel}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </form>
//   );
// } 