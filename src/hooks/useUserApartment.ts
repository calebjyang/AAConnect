import { useState, useEffect } from 'react';
import { getCollection, getDoc } from '@/lib/firestore';
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
  const fetchUserApartment = async () => {
    if (!user) {
      setState(prev => ({ ...prev, userApartment: null, userMembership: null, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Find user's apartment membership
      const allMemberships = await getCollection('apartmentMembers');
      const activeMemberships = allMemberships.filter((m: any) => m.userId === user.uid && m.isActive);

      if (activeMemberships.length === 0) {
        setState(prev => ({ 
          ...prev, 
          userApartment: null, 
          userMembership: null, 
          loading: false 
        }));
        return;
      }

      const membership = activeMemberships[0] as ApartmentMember;

      // Fetch apartment details by document ID
      const apartmentSnap = await getDoc(`apartments/${membership.apartmentId}`);

      if (!apartmentSnap || !apartmentSnap.isActive) {
        setState(prev => ({ 
          ...prev, 
          userApartment: null, 
          userMembership: null, 
          loading: false 
        }));
        return;
      }

      const apartment = { id: membership.apartmentId, ...apartmentSnap } as Apartment;

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
  };

  // Load user apartment data when user changes
  useEffect(() => {
    fetchUserApartment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    ...state,
    refetch: fetchUserApartment,
  };
} 