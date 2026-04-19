// app/login/google-callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { AuthService } from '@/src/services/auth.service';

type CallbackStatus = 'loading' | 'error';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(base64 + padding);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const finishGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const providerError = params.get('error');
      const providerErrorDescription = params.get('error_description');
      const idToken = params.get('id_token');
      const returnedState = params.get('state');

      const expectedState = sessionStorage.getItem('google_oauth_state');
      const expectedNonce = sessionStorage.getItem('google_oauth_nonce');

      sessionStorage.removeItem('google_oauth_state');
      sessionStorage.removeItem('google_oauth_nonce');

      if (providerError) {
        setError(providerErrorDescription || `Google login failed: ${providerError}`);
        setStatus('error');
        return;
      }

      if (!idToken) {
        setError('Google did not return an ID token. Please try again.');
        setStatus('error');
        return;
      }

      if (expectedState && returnedState !== expectedState) {
        setError('Google login state is invalid. Please try again.');
        setStatus('error');
        return;
      }

      if (expectedNonce) {
        const payload = decodeJwtPayload(idToken);
        const tokenNonce = typeof payload?.nonce === 'string' ? payload.nonce : null;

        if (!tokenNonce || tokenNonce !== expectedNonce) {
          setError('Google login nonce is invalid. Please try again.');
          setStatus('error');
          return;
        }
      }

      try {
        await AuthService.externalLogin({
          provider: 'Google',
          providerToken: idToken,
        });

        router.replace('/adventure');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unable to sign in with Google right now.';
        setError(message);
        setStatus('error');
      }
    };

    void finishGoogleLogin();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Paper radius="lg" p="xl" withBorder className="w-full max-w-md border-gray-200">
          <Stack align="center" gap="sm">
            <Loader color="blue" />
            <Title order={3}>Completing Google sign-in...</Title>
            <Text c="dimmed" ta="center" size="sm">
              Please wait while we connect your account.
            </Text>
          </Stack>
        </Paper>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Paper radius="lg" p="xl" withBorder className="w-full max-w-md border-gray-200">
        <Stack gap="md">
          <Title order={3}>Google sign-in failed</Title>
          <Alert color="red" icon={<IconInfoCircle size={18} />} variant="light">
            {error}
          </Alert>
          <Button component={Link} href="/login" radius="xl">
            Back to login
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
