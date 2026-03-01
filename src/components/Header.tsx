'use client';

import Link from 'next/link';
import { Button, Menu, Avatar, Group, Text } from '@mantine/core';
import { useAuth } from '../libs/useAuth';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* Container căn giữa */}
      <div className="w-full flex justify-center px-6 pointer-events-auto">
        {/* Navbar pill */}
        <div
          className="
            w-full max-w-3xl
            h-[100px]
            bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60
            rounded-full
            shadow-xl shadow-black/5
            px-8
            flex items-center justify-around
            border border-white/40
            transition-all duration-300
          "
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white text-xl">🐔</span>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-orange-500 transition-colors">
              Torisho
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {['Features', 'Pricing', 'Explore', 'Roadmap'].map((item) => (
              <Button
                key={item}
                component={Link}
                href={`#${item.toLowerCase()}`}
                variant="subtle"
                color="gray"
                radius="xl"
                size="sm"
                className="font-bold hover:bg-gray-100/50 text-gray-600 hover:text-gray-900 transition-all data-[hover]:bg-gray-100"
              >
                {item}
              </Button>
            ))}
          </nav>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  leftSection={
                    <Avatar 
                      src={user.avatarUrl} 
                      alt={user.username}
                      size="sm"
                      radius="xl"
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  className="hover:bg-gray-100/50 transition-all"
                >
                  <Text size="sm" fw={600} className="text-gray-700">
                    {user.username}
                  </Text>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <Text size="xs" c="dimmed">{user.email}</Text>
                </Menu.Label>
                <Menu.Item component={Link} href="/adventure">
                  🗺️ Adventure
                </Menu.Item>
                <Menu.Item component={Link} href="/profile">
                  👤 Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red" 
                  onClick={handleLogout}
                >
                  🚪 Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group gap="xs">
              <Button
                component={Link}
                href="/login"
                variant="subtle"
                color="gray"
                size="md"
                radius="xl"
                className="font-bold hover:bg-gray-100/50 text-gray-600 hover:text-gray-900 transition-all"
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="gradient"
                gradient={{ from: 'orange', to: 'red' }}
                size="md"
                radius="xl"
                className="shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 font-bold"
              >
                Register
              </Button>
            </Group>
          )}
        </div>
      </div>
    </header>
  );
}
