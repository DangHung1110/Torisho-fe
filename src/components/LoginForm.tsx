'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  IconArrowRight,
  IconBrandDiscord,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
} from '@tabler/icons-react';
import { AuthService } from '../services/auth.service';

const loginArtwork =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDP_96wqNc0lgfpjLf1EvKzPFIsWr4Ii7_yD5o8NU8AGIuRw-ZrixvNdlCXwWYUfj5Ml6ZNXIbqszMxMpKDusb0dZMV7rLTttK689o7-MK6DN6zbAioe7_e7AVW8nDaK1LRqSSnB2Nt-Vi_DCyd9uP9Gx8pF34CayEFVCZfk_5tNvz2R3cIRkOQ6QtUFtQJmnIUwXRDrH6D-hcwY5-L0WXr9wQa0467QcKkfbmdirAmWdDds4mI12tDSF6pzb16ZenP4vGKyEn5bDY';

const quoteText = '\u5343\u91cc\u306e\u9053\u3082\u4e00\u6b69\u304b\u3089';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.login({ username, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="torisho-auth-grid bg-white text-[#211a12]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#f5a623] px-14 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.36) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.36) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <Link href="/" className="relative z-10 flex w-fit items-center gap-3 no-underline">
          <span className="font-[var(--font-display)] text-4xl font-bold text-white">Torisho</span>
        </Link>

        <div className="relative z-10 mx-auto flex max-w-[500px] flex-1 flex-col items-center justify-center pb-6 text-center">
          <div className="relative h-[310px] w-[310px] bg-white shadow-[0_22px_38px_rgba(87,55,7,0.18)] ring-1 ring-white/60">
            <Image
              src={loginArtwork}
              alt="Torisho chicken sensei studying Japanese"
              fill
              priority
              unoptimized
              sizes="320px"
              className="object-contain p-5"
            />
          </div>
          <p className="torisho-jp mt-11 text-5xl font-bold leading-tight text-white drop-shadow-sm">
            {quoteText}
          </p>
          <p className="torisho-display mt-4 max-w-[440px] text-2xl italic leading-snug text-white/90">
            &quot;A journey of a thousand miles begins with a single step&quot;
          </p>
        </div>
      </aside>

      <main className="flex min-h-screen w-full items-center justify-center bg-[#fffdfb] py-10 lg:py-0">
        <div className="torisho-auth-form">
          <Link href="/" className="mb-10 flex w-fit items-center gap-3 no-underline lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[0] shadow-sm ring-1 ring-[#d7c3ae]">
              <span className="text-2xl">{'\uD83D\uDC14'}</span>
            </span>
            <span className="font-[var(--font-display)] text-2xl font-bold text-[#7a4300]">Torisho</span>
          </Link>

          <div className="mb-10">
            <h1 className="torisho-display text-5xl font-bold leading-tight text-[#211a12]">
              Welcome back
            </h1>
            <p className="mt-3 text-xl text-[#3d2a17]">Continue your Japanese journey.</p>
          </div>

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg border border-[#ffdad6] bg-[#fff1ef] px-4 py-3 text-sm text-[#93000a]">
              <IconInfoCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#3d2a17]">
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. musashi99"
                className="torisho-auth-input rounded-lg"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#3d2a17]">
                  Password
                </span>
                <span className="flex items-center gap-3 text-sm">
                  {showForgot && <span className="text-xs font-semibold text-[#835500]">Coming soon</span>}
                  <button
                    type="button"
                    className="text-[#3d2a17] underline decoration-[#d7c3ae] underline-offset-4 transition-colors hover:text-[#835500]"
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot?
                  </button>
                </span>
              </span>
              <span className="relative block">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="torisho-auth-input rounded-lg pr-14"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-[#b99d80] transition-colors hover:text-[#835500]"
                >
                  {showPassword ? <IconEye size={22} /> : <IconEyeOff size={22} />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#f5a623] px-6 text-lg font-bold text-[#291800] transition-all hover:bg-[#ffb955] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
              <IconArrowRight size={19} />
            </button>
          </form>

          <div className="my-8 flex items-center gap-5">
            <div className="h-px flex-1 bg-[#d7c3ae]" />
            <span className="text-sm font-bold uppercase text-[#3d2a17]">or</span>
            <div className="h-px flex-1 bg-[#d7c3ae]" />
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => AuthService.loginWithGoogle()}
              className="flex h-[52px] w-full items-center justify-center gap-4 rounded-full border border-[#d7c3ae] bg-[#fff8f4] px-6 text-lg font-medium text-[#211a12] transition-colors hover:bg-white"
            >
              <GoogleLogo />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => AuthService.loginWithDiscord()}
              className="flex h-[52px] w-full items-center justify-center gap-4 rounded-full border border-[#d7c3ae] bg-[#f4e6d8] px-6 text-lg font-medium text-[#665744] transition-colors hover:bg-[#eee0d2]"
            >
              <IconBrandDiscord size={22} />
              Continue with Discord
            </button>
          </div>

          <p className="mt-10 text-center text-base text-[#3d2a17]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-[#835500] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
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
