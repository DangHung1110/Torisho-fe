'use client';
import {
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Divider,
  Stack,
  Container,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { IconBrandDiscord, IconBrandGoogle, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/auth.service';

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
      const result = await AuthService.login({ username, password });
      // Token is now saved in localStorage by AuthService
      // Redirect to adventure page on success
      router.push('/adventure');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
      {/* Left Side: Form - 2/3 width */}
      <div className="w-full lg:w-[67%] flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-5xl flex flex-col">

          <Title order={1} className="text-gray-900 mb-10 !text-4xl md:!text-5xl font-extrabold tracking-tight">
            Welcome back!
          </Title>

          {/* Main Content: Inputs and Social Buttons Side by Side */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Column 1: Input Fields */}
            <div className="flex-1 w-full lg:w-auto lg:max-w-[500px] relative">
              <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {error && (
                  <Alert variant="light" color="red" title="Login Failed" icon={<IconInfoCircle />}>
                    {error}
                  </Alert>
                )}
                <TextInput
                  label="Username"
                  placeholder="Your username"
                  size="md"
                  radius="md"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  classNames={{
                    label: 'text-gray-900 font-semibold mb-1.5',
                    input: 'bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all h-11',
                  }}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  size="md"
                  radius="md"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  classNames={{
                    label: 'text-gray-900 font-semibold mb-1.5',
                    input: 'bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all h-11',
                  }}
                />

                <Checkbox
                  label="Keep me logged in"
                  size="md"
                  className="mt-2"
                  classNames={{
                    label: 'text-gray-700 text-sm',
                    input: 'border-gray-300 cursor-pointer',
                  }}
                />

                <Button
                  fullWidth
                  size="lg"
                  radius="md"
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 mt-4 h-12 text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                >
                  Login
                </Button>
              </form>
            </div>

            {/* Column 2: Social Login Buttons */}
            <div className="w-full lg:w-[300px] flex flex-col justify-start items-center pt-0">
              <Divider
                label="Or continue with"
                labelPosition="center"
                my="sm"
                className="mb-6 text-gray-500 font-normal w-full"
                classNames={{ label: 'text-sm text-gray-500' }}
              />
              <div className="flex flex-col gap-3 w-full">
                <Button
                  variant="default"
                  leftSection={<IconBrandDiscord size={18} className="text-[#5865F2]" />}
                  fullWidth
                  size="md"
                  radius="md"
                  className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium h-11 transition-colors"
                  onClick={handleDiscordLogin}
                >
                  Continue with Discord
                </Button>

                <Button
                  variant="default"
                  leftSection={<IconBrandGoogle size={18} />}
                  fullWidth
                  size="md"
                  radius="md"
                  className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium h-11 transition-colors"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              </div>
            </div>
          </div>

          <Text ta="left" mt="xl" className="text-gray-600 mt-8 text-sm">
            Don&apos;t have an account?{' '}
            <Anchor component={Link} href="/register" fw={600} c="blue" className="text-blue-500 hover:text-blue-600">
              Register
            </Anchor>
          </Text>
        </div>
      </div>

      {/* Right Side: Background - 1/3 width */}
      <div className="hidden lg:block w-[33%] relative bg-[#062343]">
        <div className="relative h-full flex items-center justify-center p-12 text-center">
          {/* Decorative text - Torisho */}
          <div className="text-9xl font-black rotate-12 select-none text-white/10 opacity-60">
            Torisho
          </div>
        </div>
      </div>
    </div>
  );
}
