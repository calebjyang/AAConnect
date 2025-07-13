import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

// Singleton pattern to ensure plugins are loaded only once
class AuthManager {
  private static instance: AuthManager;
  private capacitorAuth: any = null;
  private isPluginLoaded = false;
  private pluginLoadPromise: Promise<any> | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private async loadCapacitorPlugin(): Promise<any> {
    if (this.isPluginLoaded) {
      return this.capacitorAuth;
    }

    if (this.pluginLoadPromise) {
      return this.pluginLoadPromise;
    }

    this.pluginLoadPromise = (async () => {
      try {
        // Import the plugin module
        const authModule = await import('@capacitor-firebase/authentication');
        
        // Extract the plugin and immediately wrap it to prevent Promise-like behavior
        const rawPlugin = authModule.FirebaseAuthentication;
        
        // Create a safe wrapper that only exposes the methods we need
        const safePlugin = {
          signOut: rawPlugin.signOut.bind(rawPlugin),
          addListener: rawPlugin.addListener.bind(rawPlugin),
        };
        
        // Ensure the wrapper is not Promise-like
        Object.defineProperty(safePlugin, 'then', {
          value: undefined,
          writable: false,
          configurable: false,
        });
        
        this.capacitorAuth = safePlugin;
        this.isPluginLoaded = true;
        console.log('Capacitor Firebase Auth plugin loaded successfully');
        return this.capacitorAuth;
      } catch (error) {
        console.warn('Capacitor Firebase Auth plugin not available:', error);
        this.capacitorAuth = null;
        this.isPluginLoaded = true;
        return null;
      }
    })();

    return this.pluginLoadPromise;
  }

  async signOut(): Promise<void> {
    if (!isNative) {
      const { getAuth, signOut } = await import('firebase/auth');
      const { getFirebaseApp } = await import('./firebaseClient');
      const auth = getAuth(getFirebaseApp());
      await signOut(auth);
      return;
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firebase Auth plugin not available');
    }

    try {
      await plugin.signOut();
    } catch (error) {
      console.error('Native signOut error:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<any> {
    if (isNative) {
      throw new Error('Google sign-in is not implemented for native. Use native UI or implement with Capacitor plugin.');
    }

    const { GoogleAuthProvider, signInWithPopup, getAuth, browserLocalPersistence, setPersistence } = await import('firebase/auth');
    const { getFirebaseApp } = await import('./firebaseClient');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const auth = getAuth(getFirebaseApp());
    await setPersistence(auth, browserLocalPersistence);
    return signInWithPopup(auth, provider);
  }

  async addAuthStateListener(callback: (event: any) => void): Promise<() => void> {
    if (!isNative) {
      const { onAuthStateChanged, getAuth } = await import('firebase/auth');
      const { getFirebaseApp } = await import('./firebaseClient');
      const auth = getAuth(getFirebaseApp());
      // Wrap callback to always provide { user }
      return onAuthStateChanged(auth, (user) => callback({ user }));
    }

    const plugin = await this.loadCapacitorPlugin();
    if (!plugin) {
      throw new Error('Capacitor Firebase Auth plugin not available');
    }

    try {
      await plugin.addListener('authStateChange', callback);
      return () => {
        // Note: Capacitor plugins don't return unsubscribe functions like Firebase Web SDK
        // The listener will be automatically cleaned up when the plugin is destroyed
      };
    } catch (error) {
      console.error('Native addAuthStateListener error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const authManager = AuthManager.getInstance();

export async function signOutUser() {
  return authManager.signOut();
}

export async function signInWithGoogle() {
  return authManager.signInWithGoogle();
}

export async function addAuthStateListener(callback: (event: any) => void): Promise<() => void> {
  return authManager.addAuthStateListener(callback);
}

export function getAuthErrorMessage(error: any): string {
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
