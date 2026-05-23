'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconArrowRight, IconInfoCircle } from '@tabler/icons-react';
import { AuthService } from '../services/auth.service';

const registerArtwork =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDP_96wqNc0lgfpjLf1EvKzPFIsWr4Ii7_yD5o8NU8AGIuRw-ZrixvNdlCXwWYUfj5Ml6ZNXIbqszMxMpKDusb0dZMV7rLTttK689o7-MK6DN6zbAioe7_e7AVW8nDaK1LRqSSnB2Nt-Vi_DCyd9uP9Gx8pF34CayEFVCZfk_5tNvz2R3cIRkOQ6QtUFtQJmnIUwXRDrH6D-hcwY5-L0WXr9wQa0467QcKkfbmdirAmWdDds4mI12tDSF6pzb16ZenP4vGKyEn5bDY';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({ username, email, fullname, password, confirmPassword });
      router.push('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="torisho-auth-grid bg-white text-[#211a12]">
      <main className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[#fffdfb] py-10 lg:py-8">
        <div className="torisho-auth-form">
          <Link href="/" className="mb-8 flex w-fit items-center gap-3 no-underline lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[0] shadow-sm ring-1 ring-[#d7c3ae]">
              <span className="text-2xl">{'\uD83D\uDC14'}</span>
            </span>
            <span className="font-[var(--font-display)] text-2xl font-bold text-[#7a4300]">Torisho</span>
          </Link>

          <div className="mb-9 text-center">
            <h1 className="torisho-display text-5xl font-bold leading-tight text-[#7a4300]">
              Start your journey
            </h1>
            <p className="mt-3 text-xl text-[#3d2a17]">Create your free Torisho account</p>
          </div>

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg border border-[#ffdad6] bg-[#fff1ef] px-4 py-3 text-sm text-[#93000a]">
              <IconInfoCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <AuthField
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              required
            />
            <AuthField
              label="Full Name"
              value={fullname}
              onChange={setFullname}
              placeholder="Enter your full name"
            />
            <AuthField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              type="email"
              required
            />
            <AuthField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Create a password"
              type="password"
              required
            />
            <AuthField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your password"
              type="password"
              required
            />

            <label className="flex items-center gap-3 pt-2 text-base text-[#3d2a17]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.currentTarget.checked)}
                className="h-5 w-5 rounded border-[#d7c3ae] text-[#f5a623] accent-[#f5a623]"
              />
              <span>I agree to the Terms of Service</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#f5a623] px-6 text-sm font-extrabold uppercase tracking-[0.08em] text-[#291800] transition-all hover:bg-[#ffb955] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Account'}
              <IconArrowRight size={18} />
            </button>
          </form>

          <div className="my-7 flex items-center gap-5">
            <div className="h-px flex-1 bg-[#d7c3ae]" />
            <span className="text-base text-[#665744]">or</span>
            <div className="h-px flex-1 bg-[#d7c3ae]" />
          </div>

          <button
            type="button"
            onClick={() => AuthService.loginWithGoogle()}
            className="flex h-[52px] w-full items-center justify-center gap-4 rounded-full border border-[#d7c3ae] bg-white px-6 text-lg font-medium text-[#211a12] transition-colors hover:bg-[#fff8f4]"
          >
            <GoogleLogo />
            Continue with Google
          </button>

          <p className="mt-10 text-center text-base text-[#3d2a17]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#211a12] underline decoration-[#d7c3ae] underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </main>

      <aside className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#006b5f] via-[#64885a] to-[#f5a623] px-14 py-12 text-white lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,.22),_transparent_58%)]" />
        <div className="relative z-10 flex max-w-[560px] flex-col items-center text-center">
          <div className="relative h-[320px] w-[320px] bg-white shadow-[0_24px_42px_rgba(54,37,20,0.20)] ring-1 ring-white/60">
            <Image
              src={registerArtwork}
              alt="Torisho chicken sensei studying Japanese"
              fill
              priority
              unoptimized
              sizes="320px"
              className="object-contain p-5"
            />
          </div>

          <h2 className="torisho-display mt-14 text-5xl font-bold leading-tight text-white drop-shadow-sm">
            Join thousands of Japanese learners
          </h2>
          <p className="mt-8 text-xl leading-8 text-white/90">
            Master reading, writing, and vocabulary with Torisho&apos;s guided curriculum.
          </p>
        </div>
      </aside>
    </div>
  );
}

function AuthField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#211a12]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        placeholder={placeholder}
        className="torisho-auth-input rounded-full"
      />
    </label>
  );
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
