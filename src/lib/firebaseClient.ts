import { initializeApp, getApps, getApp } from 'firebase/app';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};



export function getFirebaseApp() {
  try {
    // On native platforms, don't initialize the Web SDK - let the native SDK handle it
    if (isNative) {
      console.log('Native platform detected, using existing Firebase app');
      // Just return the existing app if it exists, don't initialize
      const apps = getApps();
      if (apps.length > 0) {
        return apps[0];
      } else {
        console.warn('No Firebase app found on native platform - this should be initialized by the native SDK');
        // On native, we might not need to return an app at all for auth operations
        return undefined;
      }
    }
    
    // Web platform - initialize as normal
    if (!getApps().length) {
      console.log('Web platform detected, initializing Firebase Web SDK');
      initializeApp(firebaseConfig);
    }
    return getApp();
  } catch (error) {
    console.error('Firebase Web SDK not available for getFirebaseApp:', error);
    throw new Error('Firebase Web SDK not available. Please check your configuration.');
  }
} 