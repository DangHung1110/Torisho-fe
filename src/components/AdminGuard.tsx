'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '../libs/rbac';
import { useAuth } from '../libs/useAuth';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!isAdmin(user)) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading || !isAuthenticated || !isAdmin(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] text-[#524534]">
        Loading admin workspace...
      </div>
    );
  }

  return <>{children}</>;
}
