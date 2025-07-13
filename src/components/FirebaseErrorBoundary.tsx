"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isFirebaseError: boolean;
}

/**
 * Error boundary specifically designed to catch Firebase-related errors
 * 
 * This component catches errors that occur during Firebase operations,
 * particularly the "FirebaseFirestore.then()" error that can occur
 * when React tries to treat Capacitor plugins as Promises.
 */
export class FirebaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isFirebaseError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a Firebase-related error
    const isFirebaseError = 
      error.message.includes('FirebaseFirestore.then()') ||
      error.message.includes('Firebase') ||
      error.message.includes('Capacitor') ||
      error.message.includes('plugin') ||
      error.message.includes('Promise');

    return {
      hasError: true,
      error,
      isFirebaseError,
    };
  }

  public componentDidCatch() {
    // FirebaseErrorBoundary caught an error
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      isFirebaseError: false,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Firebase error UI
      if (this.state.isFirebaseError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Firebase Connection Error
              </h2>
              
              <p className="text-gray-600 mb-4">
                {Capacitor.isNativePlatform() 
                  ? "There was an issue connecting to Firebase on your device. This might be a temporary network or configuration problem."
                  : "There was an issue connecting to Firebase. Please check your internet connection and try again."
                }
              </p>
              
              {this.state.error && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reload App
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Generic error UI for non-Firebase errors
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Please try again or reload the app.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with FirebaseErrorBoundary
 */
export function withFirebaseErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithFirebaseErrorBoundary(props: P) {
    return (
      <FirebaseErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </FirebaseErrorBoundary>
    );
  };
} 