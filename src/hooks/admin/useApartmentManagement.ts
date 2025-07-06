import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Apartment, 
  ApartmentMember, 
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
      const q = query(
        collection(db, 'apartments'), 
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const apartments: Apartment[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as Apartment));
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
      const q = query(
        collection(db, 'apartmentMembers'), 
        where('isActive', '==', true),
        orderBy('joinedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const members: ApartmentMember[] = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as ApartmentMember));
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
      
      await addDoc(collection(db, 'apartments'), apartmentDoc);
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
  const updateApartment = useCallback(async (id: string, apartmentData: Partial<ApartmentFormData>) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const updateData = {
        ...apartmentData,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, 'apartments', id), updateData);
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
   * Deletes an apartment (soft delete)
   */
  const deleteApartment = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await updateDoc(doc(db, 'apartments', id), {
        isActive: false,
        updatedAt: Timestamp.now(),
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
   * Assigns a user to an apartment
   * @param apartmentId - The apartment's Firestore ID
   * @param userId - The user's Firebase UID (NOT email!)
   * @param userEmail - The user's email
   * @param userName - The user's display name
   * @param userPicture - The user's photo URL (optional)
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
      const existingMemberQuery = query(
        collection(db, 'apartmentMembers'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      const existingMemberSnapshot = await getDocs(existingMemberQuery);
      
      if (!existingMemberSnapshot.empty) {
        // Remove existing membership
        const existingMember = existingMemberSnapshot.docs[0];
        await updateDoc(doc(db, 'apartmentMembers', existingMember.id), {
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
      
      await addDoc(collection(db, 'apartmentMembers'), memberDoc);
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

  /**
   * Removes a member from an apartment
   */
  const removeMemberFromApartment = useCallback(async (memberId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      await updateDoc(doc(db, 'apartmentMembers', memberId), {
        isActive: false,
        updatedAt: Timestamp.now(),
      });
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Member removed successfully!' 
      }));
      await fetchMembers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [fetchMembers]);

  /**
   * Clears success/error messages
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchApartments();
    fetchMembers();
  }, [fetchApartments, fetchMembers]);

  return {
    ...state,
    createApartment,
    updateApartment,
    deleteApartment,
    assignMemberToApartment,
    removeMemberFromApartment,
    clearMessages,
    refetch: () => {
      fetchApartments();
      fetchMembers();
    },
  };
} 