import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

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
          // Check if user is admin
          let isAdmin = false;
          try {
            const adminDoc = await getDoc(doc(db, "admins", firebaseUser.email || ""));
            isAdmin = adminDoc.exists();
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