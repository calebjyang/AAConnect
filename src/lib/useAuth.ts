import { useEffect, useState, useCallback, useRef } from "react";
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

  // Cache for admin status to prevent repeated Firestore calls
  const adminCache = useRef<Map<string, boolean>>(new Map());
  const lastUserEmail = useRef<string | null>(null);

  // Memoized signOut function
  const signOut = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        unsubscribe = await addAuthStateListener(async (event: any) => {
          const user = event.user || null;
          let isAdmin = false;
          
          if (user) {
            // Only check user doc if it's a new user or user changed
            if (user.uid !== lastUserEmail.current) {
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
            }
            
            // Only check admin status if email changed or not cached
            const userEmail = user.email || '';
            if (userEmail !== lastUserEmail.current || !adminCache.current.has(userEmail)) {
              try {
                const adminSnap = await getDoc(`admins/${userEmail}`);
                // Check if document exists AND has isAdmin field set to true
                isAdmin = !!(adminSnap && adminSnap.isAdmin === true);
                adminCache.current.set(userEmail, isAdmin);
              } catch (error) {
                console.error("Error checking admin status:", error instanceof Error ? error.message : 'Unknown error');
                isAdmin = false;
                adminCache.current.set(userEmail, false);
              }
              lastUserEmail.current = userEmail;
            } else {
              isAdmin = adminCache.current.get(userEmail) || false;
            }
          } else {
            // User signed out, clear cache
            adminCache.current.clear();
            lastUserEmail.current = null;
          }
          
          setAuthState({
            user,
            loading: false,
            isAdmin,
            error: null,
            signOut
          });
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: error instanceof Error ? error.message : 'Authentication initialization failed',
          signOut
        });
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [signOut]);

  return authState;
} 