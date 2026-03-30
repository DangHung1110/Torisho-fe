'use client';
import {
  Anchor,
  Button,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { IconBrandDiscord, IconBrandGoogle, IconInfoCircle, IconChevronsRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/auth.service';
import Image from 'next/image';

const inputClassNames = {
  root: 'w-full',
  label: 'mb-2 text-xs font-medium text-gray-400',
  input:
    '!h-12 !rounded-full border-0 bg-[var(--auth-input-bg)] px-5 text-[0.9375rem] text-gray-800 shadow-none transition-all placeholder:text-gray-400 focus:!border-transparent focus:!ring-2 focus:!ring-[var(--auth-input-focus)]',
};

const passwordClassNames = {
  ...inputClassNames,
  innerInput: 'h-12',
};

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.login({ username, password });
      router.push('/adventure');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    AuthService.loginWithDiscord();
  };
  const handleGoogleLogin = () => {
    AuthService.loginWithGoogle();
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left: form */}
      <div className="flex w-full items-center justify-center px-6 py-12 md:px-10 lg:w-[56%] lg:min-w-0 lg:px-14 xl:px-16">
        <div className="w-full max-w-[min(100%,680px)] xl:max-w-[720px]">
          <Link href="/" className="group mb-10 flex w-fit items-center gap-2.5 no-underline">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-md">
              <Image src="/images/torisho-logo.png" alt="Torisho" width={40} height={40} className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-bold text-gray-800 transition-colors group-hover:text-orange-500">Torisho</span>
          </Link>

          <Title
            order={1}
            className="mb-10 text-[2rem] font-extrabold leading-tight tracking-tight text-gray-900 sm:text-[2.2rem]"
          >
            Welcome back!
          </Title>

          {error && (
            <Alert
              variant="light"
              color="red"
              title="Login failed"
              icon={<IconInfoCircle size={18} />}
              radius="lg"
              className="mb-6 border border-red-100 bg-red-50/50"
            >
              {error}
            </Alert>
          )}

          <div className="relative">
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: 'md', blur: 2 }}
              loaderProps={{ color: 'blue', type: 'bars' }}
            />

            <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-14">
              <div className="min-w-0 w-full flex-1">
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                  <TextInput
                    label="Username / Email"
                    placeholder="Your username or email"
                    size="md"
                    radius="xl"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    classNames={inputClassNames}
                  />
                  <PasswordInput
                    label="Password"
                    placeholder="••••••••"
                    size="md"
                    radius="xl"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    classNames={passwordClassNames}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    radius="xl"
                    size="lg"
                    rightSection={<IconChevronsRight size={18} stroke={1.5} />}
                    className="mt-1 !h-[3.25rem] border-0 !bg-[var(--auth-primary)] text-base font-bold !text-white shadow-md shadow-blue-400/15 transition-all hover:!bg-[var(--auth-primary-hover)] hover:shadow-lg"
                  >
                    Sign in
                  </Button>
                </form>

                <div className="mt-8 space-y-2">
                  <Text size="sm" className="text-gray-500">
                    No account yet?{' '}
                    <Anchor component={Link} href="/register" fw={600} className="text-[var(--auth-primary)] hover:underline">
                      Register now!
                    </Anchor>
                  </Text>
                  <Text size="sm" className="text-gray-500">
                    Forgot your password?{' '}
                    <Anchor href="#" fw={600} className="text-[var(--auth-primary)] hover:underline">
                      Reset
                    </Anchor>
                  </Text>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 lg:w-[240px] lg:flex-none lg:shrink-0 lg:pt-[9.5rem]">
                <Button
                  variant="default"
                  leftSection={<IconBrandDiscord size={20} className="text-[#5865F2]" />}
                  radius="xl"
                  size="md"
                  fullWidth
                  className="h-12 border border-gray-200/80 bg-[var(--auth-input-bg)] font-medium text-gray-700 hover:bg-gray-200/90"
                  onClick={handleDiscordLogin}
                >
                  Continue with Discord
                </Button>
                <Button
                  variant="default"
                  leftSection={<IconBrandGoogle size={20} />}
                  radius="xl"
                  size="md"
                  fullWidth
                  className="h-12 border border-gray-200/80 bg-[var(--auth-input-bg)] font-medium text-gray-700 hover:bg-gray-200/90"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="relative hidden min-h-screen flex-1 overflow-hidden lg:block">
        <Image
          src="/images/torisho-auth-bg.png"
          alt="Torisho Mascot"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-32 md:w-40" />
      </div>
    </div>
  );
}
