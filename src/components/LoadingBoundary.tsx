"use client";
import React, { Suspense } from 'react';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error?: Error }>;
}

const DefaultLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aacf-blue mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const DefaultErrorFallback = ({ error }: { error?: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-red-600 mb-4">Something went wrong</div>
      <p className="text-gray-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-aacf-blue text-white rounded-lg hover:bg-blue-700 transition"
      >
        Reload Page
      </button>
    </div>
  </div>
);

export default function LoadingBoundary({ 
  children, 
  fallback = <DefaultLoadingFallback />,
  errorFallback = DefaultErrorFallback
}: LoadingBoundaryProps) {
  return (
    <ErrorBoundary ErrorFallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Simple Error Boundary for this component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; ErrorFallback: React.ComponentType<{ error?: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; ErrorFallback: React.ComponentType<{ error?: Error }> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LoadingBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { ErrorFallback } = this.props;
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
} 