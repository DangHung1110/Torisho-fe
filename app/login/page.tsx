'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/src/components/LoginForm';
import { useAuth } from '@/src/libs/useAuth';
import { getPostLoginPath } from '@/src/libs/rbac';

export default function LoginPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(getPostLoginPath(user));
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <LoginForm />;
}
