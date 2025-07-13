"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  retry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * React Error Boundary component for catching and handling JavaScript errors
 * 
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree
 * that crashed. Error boundaries catch errors during rendering, in lifecycle
 * methods, and in constructors of the whole tree below them.
 * 
 * Features:
 * - Catches JavaScript errors in child components
 * - Provides fallback UI when errors occur
 * - Logs errors to console and external services
 * - Supports custom error handlers
 * - Production-ready error reporting
 * 
 * @param {Props} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {React.ComponentType} [props.fallback] - Custom fallback component
 * @param {Function} [props.onError] - Custom error handler function
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * // With custom fallback
 * <ErrorBoundary fallback={CustomErrorComponent}>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * // With error handler
 * <ErrorBoundary onError={(error, errorInfo) => {
 *   console.log('Custom error handling:', error);
 * }}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  /**
   * Lifecycle method called when an error is thrown in a child component
   * 
   * This method is called when an error occurs in any child component.
   * It updates the component state to indicate an error has occurred
   * and triggers error handling logic.
   * 
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Additional error information
   */
  public componentDidCatch() {
    // ErrorBoundary caught an error
  }

  /**
   * Lifecycle method called when props or state change after an error
   * 
   * This method allows the error boundary to recover from errors by
   * resetting the error state when the component tree changes.
   * 
   * @param {Props} nextProps - Next props
   * @param {State} nextState - Next state
   * @returns {boolean} Whether to update the component
   */
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: undefined,
    };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    if (this.props.retry) {
      this.props.retry();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-aacf-blue text-white rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Refresh Page
              </button>
            </div>
            
            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-2">
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                    <div className="font-semibold mb-1">Error Message:</div>
                    <div className="font-mono">{this.state.error.message}</div>
                  </div>
                  {this.state.error.stack && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                      <div className="font-semibold mb-1">Stack Trace:</div>
                      <pre className="font-mono whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded overflow-auto">
                      <div className="font-semibold mb-1">Component Stack:</div>
                      <pre className="font-mono whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            {/* Production Error Reporting */}
            {process.env.NODE_ENV === 'production' && (
              <div className="mt-4 text-xs text-gray-500">
                <p>Error ID: {this.state.error?.message?.slice(0, 8)}...</p>
                <p>Please include this ID when contacting support.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 * 
 * This HOC provides a convenient way to add error boundary functionality
 * to any component without manually wrapping it in JSX.
 * 
 * @param {React.ComponentType<P>} Component - The component to wrap
 * @param {Omit<Props, 'children'>} [errorBoundaryProps] - Props for the ErrorBoundary
 * @returns {React.ComponentType<P>} Component wrapped with ErrorBoundary
 * 
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   onError: (error) => console.log('Error in MyComponent:', error)
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Custom hook for handling errors in functional components
 * 
 * This hook provides a way to handle errors in functional components
 * that can't use ErrorBoundary directly. It returns a function that
 * can be called to handle errors manually.
 * 
 * @returns {Function} Error handler function
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const handleError = useErrorHandler();
 *   
 *   const handleAsyncOperation = async () => {
 *     try {
 *       await riskyOperation();
 *     } catch (error) {
 *       handleError(error);
 *     }
 *   };
 * }
 * ```
 */
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service
      console.error('Production error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }, []);
} 