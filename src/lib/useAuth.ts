import { useEffect, useState } from "react";
import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import { auth } from "./firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (firebaseUser) => {
        if (firebaseUser) {
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
            console.error("Error checking admin status:", error);
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