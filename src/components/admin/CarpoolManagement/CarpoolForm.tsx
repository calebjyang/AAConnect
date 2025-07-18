"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { addDocToCollection } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';

interface CarpoolFormData {
  name: string;
  phone: string;
  location: string;
  aftereventWeek: string;
  canDrive: string;
  capacity: string;
  grade: string;
  notes?: string;
}

interface CarpoolFormProps {
  onSuccess?: () => void;
  initialData?: Partial<CarpoolFormData>;
}

export default function CarpoolForm({ onSuccess, initialData }: CarpoolFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<CarpoolFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    aftereventWeek: initialData?.aftereventWeek || '',
    canDrive: initialData?.canDrive || '',
    capacity: initialData?.capacity || '',
    grade: initialData?.grade || '',
    notes: initialData?.notes || '',
  });

  const locationOptions = [
    "Middle Earth",
    "Mesa Court", 
    "Berk",
    "Cornell",
    "Other UTC (NOT Berk/Cornell)",
    "Plaza",
    "Other ACC (NOT Plaza)",
    "Other"
  ];

  const gradeOptions = [
    "First Year",
    "Second Year", 
    "Third Year",
    "Fourth Year",
    "Fifth Year",
    "Graduate Student",
    "Staff"
  ];

  const handleChange = (field: keyof CarpoolFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.name || !form.phone || !form.location || !form.aftereventWeek || !form.grade) {
        toast({
          title: "Missing required fields",
          description: "Please fill out all required fields.",
          variant: "destructive",
        });
        return;
      }

      const carpoolData = {
        name: form.name,
        phone: form.phone,
        location: form.location,
        aftereventWeek: form.aftereventWeek,
        canDrive: form.canDrive,
        capacity: form.canDrive === "Yes" ? form.capacity : undefined,
        grade: form.grade,
        notes: form.notes || undefined,
        submittedAt: new Date().toISOString(),
      };

      await addDocToCollection("rides", carpoolData);
      
      toast({
        title: "Success",
        description: "Carpool signup added successfully!",
      });

      // Reset form
      setForm({
        name: '',
        phone: '',
        location: '',
        aftereventWeek: '',
        canDrive: '',
        capacity: '',
        grade: '',
        notes: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error adding carpool signup:', error);
      toast({
        title: "Error",
        description: "Failed to add carpool signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="font-semibold text-gray-800 mb-1">Name (First & Last)<span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="font-semibold text-gray-800 mb-1">Phone Number<span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label id="grade-label" htmlFor="grade" className="font-semibold text-gray-800 mb-1">Grade/Year<span className="text-red-500 ml-1">*</span></Label>
          <Select value={form.grade} onValueChange={(value) => handleChange('grade', value)}>
            <SelectTrigger aria-labelledby="grade-label">
              <SelectValue placeholder="Select grade/year" />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="aftereventWeek" className="font-semibold text-gray-800 mb-1">Afterevent Week<span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="aftereventWeek"
            type="text"
            value={form.aftereventWeek}
            onChange={(e) => handleChange('aftereventWeek', e.target.value)}
            placeholder="e.g., Fall Week 1"
            required
          />
        </div>
      </div>

      <div>
        <Label id="location-label" htmlFor="location" className="font-semibold text-gray-800 mb-1">Location<span className="text-red-500 ml-1">*</span></Label>
        <Select value={form.location} onValueChange={(value) => handleChange('location', value)}>
          <SelectTrigger aria-labelledby="location-label">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-semibold text-gray-800 mb-1">Can Drive?<span className="text-red-500 ml-1">*</span></Label>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <input
              type="radio"
              name="canDrive"
              value="Yes"
              checked={form.canDrive === "Yes"}
              onChange={(e) => handleChange('canDrive', e.target.value)}
              required
            />
            Yes
          </label>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <input
              type="radio"
              name="canDrive"
              value="No"
              checked={form.canDrive === "No"}
              onChange={(e) => handleChange('canDrive', e.target.value)}
              required
            />
            No
          </label>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <input
              type="radio"
              name="canDrive"
              value="Self"
              checked={form.canDrive === "Self"}
              onChange={(e) => handleChange('canDrive', e.target.value)}
              required
            />
            Self Drive
          </label>
        </div>
      </div>

      {form.canDrive === "Yes" && (
        <div>
          <Label htmlFor="capacity" className="font-semibold text-gray-800 mb-1">Passenger Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            placeholder="Number of passengers you can take"
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes" className="font-semibold text-gray-800 mb-1">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional notes or preferences"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Carpool Signup"}
      </Button>
    </form>
  );
} 