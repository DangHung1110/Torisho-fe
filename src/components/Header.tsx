'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Menu, Text } from '@mantine/core';
import { useAuth } from '../libs/useAuth';

const homeLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Adventure', href: '#adventure' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Roadmap', href: '#roadmap' },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b border-[#d7c3ae] bg-[#fff8f4]/95 backdrop-blur-md">
      <div className="torisho-shell flex h-[74px] items-center justify-between gap-5">
        <Link href="/" className="group flex flex-shrink-0 items-center gap-3 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-[#d7c3ae] transition-transform duration-300 group-hover:rotate-6">
            {'\uD83D\uDC14'}
          </span>
          <span className="torisho-display text-2xl font-bold text-[#7a4300] transition-colors group-hover:text-[#a86400]">
            Torisho
          </span>
        </Link>

        {isHomePage && (
          <nav className="hidden items-center justify-center gap-8 md:flex">
            {homeLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="border-b-2 border-transparent pb-1 text-sm font-semibold text-[#524534] transition-colors hover:border-[#835500] hover:text-[#835500]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex flex-shrink-0 items-center gap-2">
          {isAuthenticated && user ? (
            <Menu shadow="lg" width={210} position="bottom-end" radius="md">
              <Menu.Target>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-[#d7c3ae] bg-white px-3 py-2 text-sm font-semibold text-[#3d2a17] transition-colors hover:bg-[#fff1e4]"
                >
                  <Avatar src={user.avatarUrl} alt={user.username} size={24} radius="xl">
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="hidden sm:inline">{user.username}</span>
                </button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                </Menu.Label>
                <Menu.Item component={Link} href="/adventure">
                  Adventure
                </Menu.Item>
                <Menu.Item component={Link} href="/speaking">
                  Speaking Practice
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={() => void logout()}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-[#d7c3ae] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#3d2a17] transition-colors hover:bg-white sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#291800] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#ffb955] hover:shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
