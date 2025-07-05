import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if user is admin in Firestore
    const adminDoc = await adminDb.collection('admins').doc(decodedToken.email || '').get();
    const isAdmin = adminDoc.exists;

    return NextResponse.json({ 
      isAdmin,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      }
    });
  } catch (error) {
    // Log error for debugging but don't expose sensitive details
    console.error('Admin verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
} 