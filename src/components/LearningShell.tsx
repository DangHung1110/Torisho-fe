'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconBook,
  IconBook2,
  IconCompass,
  IconCards,
  IconMicrophone2,
  IconHelpCircle,
  IconLayoutDashboard,
  IconLogout,
  IconPlayerPlay,
  IconSettings,
} from '@tabler/icons-react';
import { useAuth } from '@/src/libs/useAuth';

type LearningShellProps = {
  active: 'dashboard' | 'lessons' | 'adventure' | 'vocabulary' | 'flashcards' | 'speaking' | 'settings';
  children: React.ReactNode;
};

const navItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard },
  { key: 'lessons', label: 'Lessons', href: '/adventure', icon: IconBook2 },
  { key: 'adventure', label: 'Adventure', href: '/adventure', icon: IconCompass },
  { key: 'flashcards', label: 'Flashcard', href: '/flashcards', icon: IconCards },
  { key: 'speaking', label: 'Speaking', href: '/speaking', icon: IconMicrophone2 },
  { key: 'vocabulary', label: 'Dictionary', href: '/dictionary', icon: IconBook },
  { key: 'settings', label: 'Settings', href: '#', icon: IconSettings },
] as const;

export default function LearningShell({ active, children }: LearningShellProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff8f4] text-[#211a12]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-[#d7c3ae] bg-[#fff1e4] px-5 py-6 lg:flex">
        <Link href="/dashboard" className="mb-7 flex items-center gap-3 no-underline">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[0] shadow-sm ring-1 ring-[#d7c3ae]">
            <span className="text-xl">{'\uD83D\uDC14'}</span>
          </span>
          <span>
            <span className="torisho-display block text-2xl font-bold leading-none text-[#835500]">
              Torisho
            </span>
            <span className="mt-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#3d2a17]">
              Learning Progress
            </span>
          </span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-lg px-4 text-base no-underline transition-colors ${
                  isActive
                    ? 'bg-[#f5a623] font-bold text-[#291800]'
                    : 'text-[#3d2a17] hover:bg-[#f4e6d8]'
                }`}
              >
                <Icon size={22} stroke={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#d7c3ae] pt-5">
          <Link
            href="/adventure"
            className="mb-6 flex h-12 items-center justify-center gap-3 rounded-full bg-[#f5a623] px-5 text-base font-bold text-[#291800] no-underline transition-colors hover:bg-[#ffb955]"
          >
            <IconPlayerPlay size={21} />
            Start Lesson
          </Link>

          <div className="space-y-2">
            <Link
              href="#"
              className="flex h-10 items-center gap-3 rounded-lg px-4 text-base text-[#3d2a17] no-underline transition-colors hover:bg-[#f4e6d8]"
            >
              <IconHelpCircle size={23} stroke={1.8} />
              Help
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-full items-center gap-3 rounded-lg px-4 text-left text-base text-[#3d2a17] transition-colors hover:bg-[#f4e6d8]"
            >
              <IconLogout size={23} stroke={1.8} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[#d7c3ae] bg-[#fff8f4]/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="torisho-display text-2xl font-bold text-[#835500] no-underline">
            Torisho
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#d7c3ae] px-4 py-2 text-sm font-bold text-[#3d2a17]"
          >
            Logout
          </button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.slice(0, 6).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold no-underline ${
                active === item.key ? 'bg-[#f5a623] text-[#291800]' : 'bg-white text-[#3d2a17]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="min-h-screen lg:ml-72">{children}</main>
    </div>
  );
}
