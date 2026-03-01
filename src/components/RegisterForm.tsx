'use client';
import {
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Group,
  Stack,
  Divider,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { IconBrandDiscord, IconBrandGoogle, IconChevronsRight, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/auth.service';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("You must agree to the Terms of Service");
      return;
    }

    setLoading(true);

    try {
      await AuthService.register({ username, email, fullname, password, confirmPassword });
      // Redirect to login page after successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Side: Form Area */}
      <div className="w-full lg:w-[65%] xl:w-[67%] flex flex-col p-8 md:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">

          {/* Header / Logo - Chicken in Orange-Red Circle */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 shadow-md">
              <span className="text-white text-2xl">🐔</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Torisho</span>
          </div>

          {/* Heading */}
          <Title order={1} className="text-gray-900 mb-2 !text-4xl md:!text-5xl font-extrabold tracking-tight">
            Ready to Master Japanese?
          </Title>
          <Text c="dimmed" size="lg" mb="xl" className="text-gray-500 mb-8">
            Start your journey now!
          </Text>

          {/* Main Content: Inputs and Social Buttons Side by Side */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Column 1: Input Fields */}
            <div className="flex-1 w-full lg:w-auto lg:max-w-[500px] relative">
              <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                {error && (
                  <Alert variant="light" color="red" title="Registration Failed" icon={<IconInfoCircle />}>
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
                    label: 'text-gray-700 font-semibold mb-1.5',
                    input: 'bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all h-11',
                  }}
                />
                <TextInput
                  label="Email"
                  placeholder="hello@gmail.com"
                  size="md"
                  radius="md"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  classNames={{
                    label: 'text-gray-700 font-semibold mb-1.5',
                    input: 'bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all h-11',
                  }}
                />
                <TextInput
                  label="Full Name"
                  placeholder="Your full name"
                  size="md"
                  radius="md"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  classNames={{
                    label: 'text-gray-700 font-semibold mb-1.5',
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
                    label: 'text-gray-700 font-semibold mb-1.5',
                    input: 'bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all h-11',
                  }}
                />
                <PasswordInput
                  label="Confirm"
                  placeholder="Confirm password"
                  size="md"
                  radius="md"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  classNames={{
                    label: 'text-gray-700 font-semibold mb-1.5',
                    input: 'bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all h-11',
                  }}
                />

                <Checkbox
                  label={
                    <span className="text-sm text-gray-700">
                      I agree with the{' '}
                      <Anchor href="#" size="sm" c="blue" className="font-medium">
                        Terms of Service
                      </Anchor>{' '}
                      and essential functional cookies
                    </span>
                  }
                  mt="md"
                  size="md"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.currentTarget.checked)}
                  classNames={{
                    label: 'text-gray-700',
                    input: 'border-gray-300 cursor-pointer',
                  }}
                />

                <Button
                  fullWidth
                  mt="xl"
                  size="lg"
                  radius="xl"
                  type="submit"
                  className="bg-blue-400 hover:bg-blue-500 text-white font-semibold h-12 text-base shadow-md shadow-blue-400/30 transition-all hover:shadow-lg hover:shadow-blue-400/40 mt-6"
                  rightSection={<IconChevronsRight size={18} />}
                >
                  Register
                </Button>
              </form>
            </div>

            {/* Column 2: Social Login Buttons */}
            <div className="w-full lg:w-[300px] h-full flex flex-col justify-start items-center pt-0 justify-center!">
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

          {/* Bottom Link */}
          <Text ta="left" mt="xl" className="mt-12 text-gray-500 text-sm">
            Already have an account?{' '}
            <Anchor component={Link} href="/login" fw={600} c="blue" className="text-blue-500 hover:text-blue-600">
              Sign in
            </Anchor>
          </Text>
        </div>
      </div>

      {/* Right Side: Image/Illustration - Placeholder for background */}
      <div className="hidden lg:block w-[35%] xl:w-[33%] relative bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
        {/* Placeholder - User will add illustration later */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50 flex items-center justify-center p-12">
          <div className="text-center text-blue-300/50">
            <div className="text-9xl mb-4 opacity-30">🐼</div>
          </div>
        </div>
      </div>
    </div>
  );
}
