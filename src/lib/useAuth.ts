import { useEffect, useState } from "react";
import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
}

/**
 * Custom hook for managing Firebase authentication state
 * 
 * This hook provides comprehensive authentication functionality including:
 * - Real-time authentication state monitoring
 * - Automatic admin status verification
 * - Loading states for async operations
 * - Error handling for auth failures
 * - Secure admin verification via API route
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
    error: null
  });

  useEffect(() => {
    /**
     * Firebase auth state change listener
     * 
     * This function is called whenever the Firebase authentication state changes.
     * It handles both login and logout events, and performs admin verification
     * for authenticated users.
     * 
     * @param {User|null} firebaseUser - Firebase user object or null
     */
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (firebaseUser) => {
        if (firebaseUser) {
          // --- Automatic user doc creation ---
          try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
              await setDoc(userRef, {
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                createdAt: new Date(),
              });
            }
          } catch (err) {
            console.error("Error creating user doc:", err);
          }
          // --- End user doc creation ---

          // Check if user is admin using secure API route
          let isAdmin = false;
          try {
            const idToken = await getIdToken(firebaseUser);
            const response = await fetch('/api/admin/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken }),
            });
            
            if (response.ok) {
              const data = await response.json();
              isAdmin = data.isAdmin;
            }
          } catch (error) {
            console.error("Error checking admin status:", error instanceof Error ? error.message : 'Unknown error');
          }

          setAuthState({
            user: firebaseUser,
            loading: false,
            isAdmin,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            isAdmin: false,
            error: null
          });
        }
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: error.message
        });
      }
    );

    return () => unsubscribe();
  }, []);

  return authState;
} 