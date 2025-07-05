import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Validate required environment variables
const requiredEnvVars = {
  FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required Firebase Admin environment variables: ${missingVars.join(', ')}`);
}

// Only initialize if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: requiredEnvVars.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: requiredEnvVars.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: requiredEnvVars.FIREBASE_ADMIN_CLIENT_EMAIL,
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(); 