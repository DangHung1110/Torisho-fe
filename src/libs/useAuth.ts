'use client';

import { useCallback, useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth';

function getAuthSnapshot() {
  return {
    user: AuthService.getCurrentUser(),
    isAuthenticated: AuthService.isAuthenticated(),
    loading: false,
  };
}

export function useAuth() {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  }>(() => {
    if (typeof window === 'undefined') {
      return { user: null, isAuthenticated: false, loading: true };
    }

    return getAuthSnapshot();
  });

  const updateAuthState = useCallback(() => {
    setAuthState(getAuthSnapshot());
  }, []);

  useEffect(() => {
    // Listen for storage changes (login/logout in other tabs or after navigation)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('torisho_')) {
        updateAuthState();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      updateAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [updateAuthState]);

  const logout = async () => {
    try {
      await AuthService.logout();
      setAuthState((current) => ({ ...current, user: null, isAuthenticated: false }));
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState((current) => ({ ...current, user: null, isAuthenticated: false }));
    }
  };

  return { ...authState, logout };
}
