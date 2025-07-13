import { useEffect, useState } from "react";
import { signOutUser, addAuthStateListener } from "./auth";
import { setDoc, getDoc } from "@/lib/firestore";
import { Capacitor } from '@capacitor/core';

interface AuthState {
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

/**
 * Custom hook for managing Firebase authentication state
 * 
 * This hook provides comprehensive authentication functionality including:
 * - Real-time authentication state monitoring
 * - Automatic admin status verification via Firestore
 * - Loading states for async operations
 * - Error handling for auth failures
 * - Secure admin verification using Firestore security rules
 * 
 * The hook automatically:
 * - Listens for Firebase auth state changes
 * - Verifies admin status when user logs in
 * - Handles authentication errors gracefully
 * - Provides loading states during verification
 * 
 * @returns {AuthState} Object containing authentication state and user info
 * @returns {User|null} returns.user - Firebase user object or null if not authenticated
 * @returns {boolean} returns.loading - Whether auth state is being determined
 * @returns {boolean} returns.isAdmin - Whether the current user has admin privileges
 * @returns {string|null} returns.error - Error message if authentication failed
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, isAdmin, error } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!user) return <div>Please log in</div>;
 *   
 *   return (
 *     <div>
 *       Welcome, {user.email}!
 *       {isAdmin && <AdminPanel />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    error: null,
    signOut: async () => {
      try {
        await signOutUser();
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;
      }
    }
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        unsubscribe = await addAuthStateListener(async (event: any) => {
          const user = event.user || null;
          let isAdmin = false;
          
          if (user) {
            try {
              const userSnap = await getDoc(`users/${user.uid}`);
              if (!userSnap) {
                await setDoc(`users/${user.uid}`, {
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL,
                  createdAt: new Date(),
                });
              }
            } catch (err) {
              console.error("Error creating user doc:", err);
            }
            
            try {
              const adminSnap = await getDoc(`admins/${user.email || ''}`);
              isAdmin = !!adminSnap;
            } catch (error) {
              console.error("Error checking admin status:", error instanceof Error ? error.message : 'Unknown error');
              isAdmin = false;
            }
          }
          
          setAuthState({
            user,
            loading: false,
            isAdmin,
            error: null,
            signOut: async () => {
              try {
                await signOutUser();
              } catch (error) {
                console.error("Error signing out:", error);
                throw error;
              }
            }
          });
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: error instanceof Error ? error.message : 'Authentication initialization failed',
          signOut: async () => {
            try {
              await signOutUser();
            } catch (error) {
              console.error("Error signing out:", error);
              throw error;
            }
          }
        });
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return authState;
} 