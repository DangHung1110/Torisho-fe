'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateAuthState = () => {
    const currentUser = AuthService.getCurrentUser();
    const isAuth = AuthService.isAuthenticated();
    
    setUser(currentUser);
    setIsAuthenticated(isAuth);
    setLoading(false);
  };

  useEffect(() => {
    updateAuthState();

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
  }, []);

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return { user, isAuthenticated, loading, logout };
}
