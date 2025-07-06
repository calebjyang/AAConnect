import { Timestamp } from 'firebase/firestore';

// Apartment data structure
export interface Apartment {
  id: string;
  name: string;
  description?: string;
  address?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  isActive: boolean;
}

// Apartment member assignment
export interface ApartmentMember {
  id: string;
  apartmentId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPicture?: string;
  joinedAt: Timestamp;
  isActive: boolean;
}

// Availability time slot
export interface AvailabilitySlot {
  id: string;
  apartmentId: string;
  apartmentName: string;
  postedBy: string;
  postedByEmail: string;
  postedByName: string;
  startTime: Timestamp;
  endTime: Timestamp;
  description: string;
  maxGuests?: number | null;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Form data for creating/editing apartments
export interface ApartmentFormData {
  name: string;
  description?: string;
  address?: string;
}

// Form data for posting availability
export interface AvailabilityFormData {
  apartmentId: string;
  startTime: Date;
  endTime: Date;
  description: string;
  maxGuests?: number | null;
  tags?: string[];
}

// Admin apartment management state
export interface ApartmentManagementState {
  apartments: Apartment[];
  members: ApartmentMember[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

// Availability management state
export interface AvailabilityManagementState {
  slots: AvailabilitySlot[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

// User apartment state
export interface UserApartmentState {
  userApartment: Apartment | null;
  userMembership: ApartmentMember | null;
  loading: boolean;
  error: string | null;
}

// Global availability state
export interface GlobalAvailabilityState {
  allSlots: AvailabilitySlot[];
  loading: boolean;
  error: string | null;
} 