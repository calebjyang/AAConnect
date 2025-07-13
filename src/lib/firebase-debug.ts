import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

/**
 * Firebase Debug Utility
 * 
 * This utility provides debugging and monitoring capabilities for Firebase operations,
 * particularly useful for identifying when and where the "FirebaseFirestore.then()" error occurs.
 */

interface DebugInfo {
  timestamp: string;
  platform: string;
  operation: string;
  path?: string;
  error?: string;
  stack?: string;
}

class FirebaseDebugger {
  private static instance: FirebaseDebugger;
  private debugLog: DebugInfo[] = [];
  private isEnabled = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): FirebaseDebugger {
    if (!FirebaseDebugger.instance) {
      FirebaseDebugger.instance = new FirebaseDebugger();
    }
    return FirebaseDebugger.instance;
  }

  logOperation(operation: string, path?: string, error?: Error) {
    if (!this.isEnabled) return;

    const debugInfo: DebugInfo = {
      timestamp: new Date().toISOString(),
      platform: isNative ? 'native' : 'web',
      operation,
      path,
      error: error?.message,
      stack: error?.stack,
    };

    this.debugLog.push(debugInfo);
    console.log('Firebase Debug:', debugInfo);

    // Check for specific error patterns
    if (error?.message?.includes('FirebaseFirestore.then()')) {
      console.error('🚨 FIREBASE PLUGIN PROMISE ERROR DETECTED 🚨');
      console.error('This error occurs when React tries to treat the Capacitor plugin as a Promise');
      console.error('Debug info:', debugInfo);
      console.error('Stack trace:', error.stack);
    }
  }

  getDebugLog(): DebugInfo[] {
    return [...this.debugLog];
  }

  clearDebugLog() {
    this.debugLog = [];
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

export const firebaseDebugger = FirebaseDebugger.getInstance();

/**
 * Wrapper function to monitor Firebase operations
 */
export function withFirebaseDebug<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const path = args[0] as string;
    
    try {
      firebaseDebugger.logOperation(operation, path);
      const result = await fn(...args);
      return result;
    } catch (error) {
      firebaseDebugger.logOperation(operation, path, error as Error);
      throw error;
    }
  };
}

/**
 * Check if we're in a React Suspense context
 */
export function isInSuspenseContext(): boolean {
  // This is a heuristic - React doesn't expose this information directly
  // But we can check for common patterns that indicate Suspense usage
  const stack = new Error().stack || '';
  return stack.includes('Suspense') || stack.includes('React.lazy');
}

/**
 * Validate that a value is not a Promise-like object
 */
export function validateNotPromiseLike(value: any, context: string): void {
  if (value && typeof value === 'object') {
    // Check if it has a .then method (Promise-like)
    if (typeof value.then === 'function') {
      console.warn(`⚠️ Promise-like object detected in ${context}:`, value);
      console.warn('This might cause React to treat it as a Promise');
    }
    
    // Check if it's a Capacitor plugin object
    if (value.constructor && value.constructor.name.includes('Firebase')) {
      console.warn(`⚠️ Firebase plugin object detected in ${context}:`, value);
      console.warn('Make sure this object is not being returned or exposed to React');
    }
  }
}

/**
 * Safe wrapper for async operations that might be called in Suspense context
 */
export function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Use setTimeout to ensure we're not in a Suspense context
    setTimeout(async () => {
      try {
        const result = await operation();
        validateNotPromiseLike(result, context);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
} 