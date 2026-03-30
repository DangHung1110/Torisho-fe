'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Menu, Avatar, Group, Text } from '@mantine/core';
import { useAuth } from '../libs/useAuth';
import Image from 'next/image';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const navButtonClassNames = { label: '!text-base !font-extrabold !tracking-[0.2px]' };

  const handleLogout = async () => {
    await logout();
  };

  const isHomePage = pathname === '/';
  const isDashboardPage = ['/adventure', '/speaking'].some((path) => pathname?.startsWith(path));

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex justify-center">
      <div className="pointer-events-auto flex w-full justify-center px-8! sm:px-10! lg:px-12!">
        <div
          className="
            flex h-[80px] w-full items-center justify-between gap-3 border border-gray-200/60 bg-white/80 px-7! shadow-lg shadow-black/[0.06] backdrop-blur-xl transition-all duration-300
            supports-[backdrop-filter]:bg-white/65 sm:gap-5 sm:px-9!
            rounded-full
          "
          style={{ maxWidth: '900px' }}
        >
          <Link href="/" className="group flex flex-shrink-0 items-center gap-3 no-underline">
            <div className="h-10 w-10 overflow-hidden rounded-full shadow-md transition-transform duration-300 group-hover:rotate-12">
              <Image src="/images/torisho-logo.png" alt="Torisho" width={36} height={36} className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-800 transition-colors group-hover:text-orange-500">
              Torisho
            </span>
          </Link>

          <nav className="mx-2 flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto md:mx-3">
            {isDashboardPage && isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  href="/adventure"
                  variant={pathname?.startsWith('/adventure') ? 'light' : 'subtle'}
                  color={pathname?.startsWith('/adventure') ? 'orange' : 'gray'}
                  radius="xl"
                  size="sm"
                  classNames={navButtonClassNames}
                  className="flex-shrink-0 px-3 text-sm font-extrabold sm:px-4 sm:text-base"
                >
                  Adventure
                </Button>
                <Button
                  component={Link}
                  href="/speaking"
                  variant={pathname?.startsWith('/speaking') ? 'light' : 'subtle'}
                  color={pathname?.startsWith('/speaking') ? 'indigo' : 'gray'}
                  radius="xl"
                  size="sm"
                  classNames={navButtonClassNames}
                  className="flex-shrink-0 px-3 text-sm font-extrabold sm:px-4 sm:text-base"
                >
                  Speaking
                </Button>
              </>
            ) : isHomePage ? (
              <>
                {['Features', 'Pricing', 'Explore', 'Roadmap'].map((item) => (
                  <Button
                    key={item}
                    component={Link}
                    href={`#${item.toLowerCase()}`}
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    size="sm"
                    classNames={navButtonClassNames}
                    className="flex-shrink-0 px-3 text-sm font-bold text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 sm:px-4 sm:text-base"
                  >
                    {item}
                  </Button>
                ))}
              </>
            ) : null}
          </nav>

          <div className="flex flex-shrink-0 items-center justify-end">
            {isAuthenticated && user ? (
              <Menu shadow="lg" width={200} position="bottom-end" radius="lg">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    size="sm"
                    className="px-2"
                    leftSection={
                      <Avatar src={user.avatarUrl} alt={user.username} size={22} radius="xl">
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                  >
                    <Text size="xs" fw={600} className="hidden text-gray-700 sm:inline sm:text-sm">
                      {user.username}
                    </Text>
                  </Button>
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
                  <Menu.Item component={Link} href="/profile">
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap={0} wrap="nowrap">
                <Button
                  component={Link}
                  href="/register"
                  size="md"
                  radius="xl"
                  className="h-12 border-0 bg-gradient-to-r from-orange-500 to-red-500 px-7 text-base font-extrabold text-white shadow-md shadow-orange-500/20 transition-all hover:shadow-lg sm:h-13 sm:px-8 sm:text-lg"
                >
                  Register
                </Button>
              </Group>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
