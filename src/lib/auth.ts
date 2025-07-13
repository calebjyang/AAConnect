import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const isNative = Capacitor.isNativePlatform();

// Singleton pattern to ensure plugins are loaded only once
class AuthManager {
  private static instance: AuthManager;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async signInWithGoogle(): Promise<any> {
    if (isNative) {
      console.log('Native platform detected, using Capacitor Firebase Authentication plugin');
      
      try {
        console.log('Attempting native Google Sign-In...');
        const result = await FirebaseAuthentication.signInWithGoogle();
        console.log('Native Google Sign-In result:', result);
        
        // The native plugin already handles Firebase authentication
        // We just need to return the result
        return result;
      } catch (error) {
        console.error('Native Google Sign-In error:', error);
        console.error('Error details:', {
          message: (error as any).message,
          code: (error as any).code,
          stack: (error as any).stack
        });
        throw error;
      }
    }

    // Web implementation (unchanged)
    try {
      const { GoogleAuthProvider, signInWithPopup, getAuth } = await import('firebase/auth');
      const { getFirebaseApp } = await import('./firebaseClient');
      const auth = getAuth(getFirebaseApp());
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      console.error('Web Google Sign-In error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    if (isNative) {
      console.log('Native platform detected, using Capacitor Firebase Authentication sign out');
      try {
        await FirebaseAuthentication.signOut();
        console.log('Native sign out successful');
      } catch (error) {
        console.error('Native sign out error:', error);
        throw error;
      }
    } else {
      // Web implementation (unchanged)
      try {
        const { getAuth, signOut } = await import('firebase/auth');
        const { getFirebaseApp } = await import('./firebaseClient');
        const auth = getAuth(getFirebaseApp());
        await signOut(auth);
      } catch (error) {
        console.error('Web sign out error:', error);
        throw error;
      }
    }
  }

  async getCurrentUser(): Promise<any> {
    if (isNative) {
      console.log('Native platform detected, getting current user from Capacitor Firebase Authentication plugin');
      try {
        const result = await FirebaseAuthentication.getCurrentUser();
        console.log('Native current user result:', result);
        return result.user;
      } catch (error) {
        console.error('Native get current user error:', error);
        return null;
      }
    } else {
      // Web implementation (unchanged)
      try {
        const { getAuth } = await import('firebase/auth');
        const { getFirebaseApp } = await import('./firebaseClient');
        const auth = getAuth(getFirebaseApp());
        return auth.currentUser;
      } catch (error) {
        console.error('Web get current user error:', error);
        return null;
      }
    }
  }

  async addAuthStateListener(callback: (event: any) => void): Promise<() => void> {
    if (!isNative) {
      try {
        const { onAuthStateChanged, getAuth } = await import('firebase/auth');
        const { getFirebaseApp } = await import('./firebaseClient');
        const auth = getAuth(getFirebaseApp());
        // Wrap callback to always provide { user }
        return onAuthStateChanged(auth, (user) => callback({ user }));
      } catch (error) {
        console.error('Firebase Web SDK not available for addAuthStateListener:', error);
        throw new Error('Firebase Web SDK not available. Please check your configuration.');
      }
    }

    // For native, we'll use a simple polling approach since we don't have real-time auth state
    console.log('Setting up native auth state listener (polling)...');
    
    let isListening = true;
    const pollInterval = setInterval(async () => {
      if (!isListening) return;
      
      try {
        const user = await this.getCurrentUser();
        callback({ user });
      } catch (error) {
        console.error('Error polling auth state:', error);
      }
    }, 1000); // Poll every second
    
    // Return cleanup function
    return () => {
      console.log('Native auth state listener cleanup');
      isListening = false;
      clearInterval(pollInterval);
    };
  }
}

export const authManager = AuthManager.getInstance();

export async function signOutUser() {
  return authManager.signOut();
}

export async function signInWithGoogle() {
  return authManager.signInWithGoogle();
}

export async function getCurrentUser() {
  return authManager.getCurrentUser();
}

export async function addAuthStateListener(callback: (event: any) => void) {
  return authManager.addAuthStateListener(callback);
}

export function getAuthErrorMessage(error: any): string {
  // Handle Capacitor Firebase Authentication errors
  if (error.message) {
    if (error.message.includes('cancelled') || error.message.includes('canceled')) {
      return 'Sign-in was cancelled. Please try again.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('too many requests')) {
      return 'Too many failed attempts. Please try again later.';
    }
    if (error.message.includes('disabled')) {
      return 'This account has been disabled. Please contact support.';
    }
    if (error.message.includes('not allowed')) {
      return 'Google sign-in is not enabled. Please contact support.';
    }
  }

  // Handle Firebase Web SDK errors
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

export function isUserAdmin(user: any): boolean {
  // This will be enhanced when we implement proper admin checking
  return user?.email?.endsWith('@uci.edu') || false;
}
