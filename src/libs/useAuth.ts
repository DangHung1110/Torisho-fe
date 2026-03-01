'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const isAuth = AuthService.isAuthenticated();
    
    setUser(currentUser);
    setIsAuthenticated(isAuth);
    setLoading(false);
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
