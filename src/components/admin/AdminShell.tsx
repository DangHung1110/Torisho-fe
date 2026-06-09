'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconBook,
  IconBook2,
  IconChartBar,
  IconFileImport,
  IconHelpCircle,
  IconLayoutDashboard,
  IconLogout,
  IconMessageCircle,
  IconSettings,
  IconShieldLock,
  IconUsers,
} from '@tabler/icons-react';
import { useAuth } from '@/src/libs/useAuth';

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: IconLayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: IconUsers },
  { label: 'Curriculum', href: '/admin/curriculum', icon: IconFileImport },
  { label: 'Quizzes', href: '/admin/quizzes', icon: IconBook2 },
  { label: 'Dictionary', href: '/admin/dictionary', icon: IconBook },
  { label: 'Speaking Rooms', href: '/admin/speaking-rooms', icon: IconMessageCircle },
  { label: 'Reports', href: '/admin/reports', icon: IconChartBar },
  { label: 'Settings', href: '/admin/settings', icon: IconSettings },
] as const;

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff8f4] text-[#211a12]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 flex-col border-r border-[#d7c3ae] bg-[#fff1e4] px-6 py-7 lg:flex">
        <Link href="/admin/dashboard" className="mb-8 flex items-center gap-3 no-underline">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#d7c3ae]">
            <IconShieldLock size={25} className="text-[#835500]" />
          </span>
          <span>
            <span className="torisho-display block text-3xl font-bold leading-none text-[#835500]">
              Torisho
            </span>
            <span className="mt-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#3d2a17]">
              Admin Workspace
            </span>
          </span>
        </Link>

        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-12 items-center gap-4 rounded-lg px-5 text-lg no-underline transition-colors ${
                  isActive
                    ? 'bg-[#f5a623] font-bold text-[#291800]'
                    : 'text-[#3d2a17] hover:bg-[#f4e6d8]'
                }`}
              >
                <Icon size={24} stroke={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#d7c3ae] pt-5">
          <Link
            href="/dashboard"
            className="mb-7 flex h-14 items-center justify-center gap-3 rounded-full bg-[#f5a623] px-5 text-lg font-bold text-[#291800] no-underline transition-colors hover:bg-[#ffb955]"
          >
            <IconLayoutDashboard size={21} />
            User Dashboard
          </Link>

          <div className="space-y-2">
            <Link
              href="#"
              className="flex h-11 items-center gap-4 rounded-lg px-5 text-lg text-[#3d2a17] no-underline transition-colors hover:bg-[#f4e6d8]"
            >
              <IconHelpCircle size={23} stroke={1.8} />
              Help
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-full items-center gap-4 rounded-lg px-5 text-left text-lg text-[#3d2a17] transition-colors hover:bg-[#f4e6d8]"
            >
              <IconLogout size={23} stroke={1.8} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[#d7c3ae] bg-[#fff8f4]/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="torisho-display text-2xl font-bold text-[#835500] no-underline">
            Torisho Admin
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold no-underline ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? 'bg-[#f5a623] text-[#291800]'
                  : 'bg-white text-[#3d2a17]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="min-h-screen lg:ml-80">{children}</main>
    </div>
  );
}
