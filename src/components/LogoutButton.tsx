'use client';

import { Button } from '@mantine/core';
import { useAuth } from '../libs/useAuth';

interface LogoutButtonProps {
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function LogoutButton({ variant = 'default', size = 'md', fullWidth = false }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleLogout}
      color="red"
    >
      Logout
    </Button>
  );
}
