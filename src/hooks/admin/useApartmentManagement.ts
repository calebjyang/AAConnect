import { useState, useCallback, useEffect } from 'react';
import { getCollection, addDocToCollection, updateDoc } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';
import type { 
  ApartmentFormData,
  ApartmentManagementState 
} from '@/types/apartment';

const initialState: ApartmentManagementState = {
  apartments: [],
  members: [],
  loading: false,
  error: null,
  success: null,
};

export function useApartmentManagement() {
  const [state, setState] = useState<ApartmentManagementState>(initialState);

  /**
   * Fetches all apartments from Firestore
   */
  const fetchApartments = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let apartments = await getCollection('apartments');
      apartments = apartments.filter((a: any) => a.isActive).sort((a: any, b: any) => a.name.localeCompare(b.name));
      setState(prev => ({ ...prev, apartments, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch apartments';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Fetches all apartment members from Firestore
   */
  const fetchMembers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let members = await getCollection('apartmentMembers');
      members = members.filter((m: any) => m.isActive).sort((a: any, b: any) => b.joinedAt?.seconds - a.joinedAt?.seconds);
      setState(prev => ({ ...prev, members, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch members';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Creates a new apartment
   */
  const createApartment = useCallback(async (apartmentData: ApartmentFormData, createdBy: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const now = Timestamp.now();
      const apartmentDoc = {
        ...apartmentData,
        createdAt: now,
        updatedAt: now,
        createdBy,
        isActive: true,
      };
      await addDocToCollection('apartments', apartmentDoc);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Apartment created successfully!'
      }));
      await fetchApartments();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create apartment';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchApartments]);

  /**
   * Updates an existing apartment
   */
  const updateApartment = useCallback(async (apartmentId: string, apartmentData: ApartmentFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const now = Timestamp.now();
      await updateDoc(`apartments/${apartmentId}`, {
        ...apartmentData,
        updatedAt: now,
      });
      setState(prev => ({
        ...prev,
        loading: false,
        success: 'Apartment updated successfully!'
      }));
      await fetchApartments();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update apartment';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchApartments]);

  /**
   * Deletes an apartment (soft delete by setting isActive to false)
   */
  const deleteApartment = useCallback(async (apartmentId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const now = Timestamp.now();
      await updateDoc(`apartments/${apartmentId}`, {
        isActive: false,
        updatedAt: now,
      });
      setState(prev => ({
        ...prev,
        loading: false,
        success: 'Apartment deleted successfully!'
      }));
      await fetchApartments();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete apartment';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchApartments]);

  /**
   * Clears error and success messages
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  /**
   * Assigns a user to an apartment
   */
  const assignMemberToApartment = useCallback(async (
    apartmentId: string, 
    userId: string, // <-- MUST be Firebase UID
    userEmail: string, 
    userName: string,
    userPicture?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      // First, check if user is already assigned to an apartment
      const members = await getCollection('apartmentMembers');
      const existingMember = members.find((m: any) => m.userId === userId && m.isActive);
      if (existingMember) {
        // Remove existing membership
        await updateDoc(`apartmentMembers/${existingMember.id}`, {
          isActive: false,
          updatedAt: Timestamp.now(),
        });
      }
      // Create new membership
      const memberDoc = {
        apartmentId,
        userId, // <-- This is the UID
        userEmail,
        userName,
        userPicture,
        joinedAt: Timestamp.now(),
        isActive: true,
      };
      await addDocToCollection('apartmentMembers', memberDoc);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Member assigned successfully!'
      }));
      await fetchMembers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign member';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchMembers]);

  useEffect(() => {
    fetchApartments();
    fetchMembers();
  }, [fetchApartments, fetchMembers]);

  return {
    ...state,
    fetchApartments,
    fetchMembers,
    createApartment,
    updateApartment,
    deleteApartment,
    clearMessages,
    assignMemberToApartment,
  };
} 