/**
 * Chat Error Boundary
 * 
 * Catches errors in the chat components and provides fallback UI
 */

'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@workspace/ui/components/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat Error Boundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ⚠️ Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md">
            The chat interface encountered an unexpected error. Please contact support if the problem continues.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 p-4 bg-gray-100 rounded-lg text-left max-w-lg w-full">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          
          <Button
            onClick={this.handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper
 */
export function withChatErrorBoundary<T extends object>(
  Component: React.ComponentType<T>
) {
  const WrappedComponent = (props: T) => (
    <ChatErrorBoundary>
      <Component {...props} />
    </ChatErrorBoundary>
  );
  
  WrappedComponent.displayName = `withChatErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}