import { GoogleAuthProvider, signInWithPopup, signOut, User, AuthError } from "firebase/auth";
import { auth } from "./firebase";

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // Add custom parameters for better UX
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return signInWithPopup(auth, provider);
}

export function signOutUser() {
  return signOut(auth);
}

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.';
    default:
      return 'An error occurred during sign-in. Please try again.';
  }
}

export function isUserAdmin(user: User | null): boolean {
  // This will be enhanced when we implement proper admin checking
  return user?.email?.endsWith('@uci.edu') || false;
}
