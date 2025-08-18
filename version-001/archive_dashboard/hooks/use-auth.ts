import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, AuthServiceError, SignInRequest, User } from '@/lib/auth-service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check session
  const checkSession = useCallback(async () => {
    if (isSigningIn || isSigningOut) return;
    
    try {
      setIsLoading(true);
      const response = await authService.getSession();
      setUser(response.user);
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isSigningIn, isSigningOut]);

  // Sign in function
  const signIn = useCallback(async (
    credentials: SignInRequest,
    redirectTo?: string
  ) => {
    try {
      setIsSigningIn(true);
      setError(null);
      
      const response = await authService.signIn(credentials);
      setUser(response.user);
      
      // Redirect after successful sign in
      if (redirectTo) {
        router.push(redirectTo);
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof AuthServiceError 
        ? error.message 
        : 'Sign in failed. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }, [router]);

  // Sign out function
  const signOut = useCallback(async (redirectTo?: string) => {
    try {
      setIsSigningOut(true);
      setError(null);
      
      await authService.signOut();
      setUser(null);
      
      // Redirect after sign out
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      const errorMessage = error instanceof AuthServiceError 
        ? error.message 
        : 'Sign out failed. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if auth is ready (not loading and not in auth operations)
  const isReady = !isLoading && !isSigningIn && !isSigningOut;

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isSigningIn,
    isSigningOut,
    isReady,
    error,
    
    // Actions
    signIn,
    signOut,
    checkSession,
    clearError,
  };
}
