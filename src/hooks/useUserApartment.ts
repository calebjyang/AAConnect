import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import type { 
  Apartment, 
  ApartmentMember, 
  UserApartmentState 
} from '@/types/apartment';

const initialState: UserApartmentState = {
  userApartment: null,
  userMembership: null,
  loading: false,
  error: null,
};

export function useUserApartment() {
  const [state, setState] = useState<UserApartmentState>(initialState);
  const { user } = useAuth();

  /**
   * Fetches the user's apartment membership
   */
  const fetchUserApartment = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, userApartment: null, userMembership: null, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Find user's apartment membership
      const membershipQuery = query(
        collection(db, 'apartmentMembers'),
        where('userId', '==', user.uid),
        where('isActive', '==', true)
      );
      const membershipSnapshot = await getDocs(membershipQuery);

      if (membershipSnapshot.empty) {
        setState(prev => ({ 
          ...prev, 
          userApartment: null, 
          userMembership: null, 
          loading: false 
        }));
        return;
      }

      const membership = membershipSnapshot.docs[0].data() as ApartmentMember;
      membership.id = membershipSnapshot.docs[0].id;

      // Fetch apartment details by document ID
      const apartmentRef = doc(db, 'apartments', membership.apartmentId);
      const apartmentSnap = await getDoc(apartmentRef);

      if (!apartmentSnap.exists() || !apartmentSnap.data().isActive) {
        setState(prev => ({ 
          ...prev, 
          userApartment: null, 
          userMembership: null, 
          loading: false 
        }));
        return;
      }

      const apartment = { id: apartmentSnap.id, ...apartmentSnap.data() } as Apartment;

      setState(prev => ({ 
        ...prev, 
        userApartment: apartment, 
        userMembership: membership, 
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user apartment';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [user]);

  // Load user apartment data when user changes
  useEffect(() => {
    fetchUserApartment();
  }, [fetchUserApartment]);

  return {
    ...state,
    refetch: fetchUserApartment,
  };
} 