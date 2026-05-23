'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/src/components/LoginForm';
import { useAuth } from '@/src/libs/useAuth';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to the learning dashboard
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <LoginForm />;
}
