'use client';

import { Container, Group, Burger, Text, Avatar, TextInput, ActionIcon, Menu, UnstyledButton } from '@mantine/core';
import { IconSearch, IconBell, IconFlame, IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../libs/useAuth';

export default function DashboardHeader() {
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 h-[70px]">
      <Container size="xl" className="h-full">
        <div className="flex justify-between items-center h-full">
            
          {/* Left Side: Logo & Navigation */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline">
                 <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm border border-gray-100">
                     {/* Replace with Image if available, using emoji/text for now as per previous code */}
                    <span className="text-2xl">🐼</span> 
                 </div>
                 {/* Explicitly hidden on small screens if needed, but screenshot shows header is quite full */}
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
                 <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 no-underline transition-colors">Home</Link>
                 <Link href="/adventure" className="text-gray-800 font-bold no-underline">Adventure</Link>
                 <Link href="#" className="text-gray-500 font-bold hover:text-gray-800 no-underline transition-colors">Study Lists</Link>
                 
                 <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <UnstyledButton className="flex items-center gap-1 text-gray-500 font-bold hover:text-gray-800 transition-colors">
                            Resources <IconChevronDown size={14} />
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item>Dictionary</Menu.Item>
                        <Menu.Item>Grammar</Menu.Item>
                        <Menu.Item>Kanji</Menu.Item>
                    </Menu.Dropdown>
                 </Menu>
            </nav>
          </div>

          {/* Right Side: Search & User */}
          <div className="flex items-center gap-4">
            
            {/* Search Input */}
            <TextInput
                placeholder="Search Dictionary.."
                rightSection={<IconSearch size={16} className="text-gray-400" />}
                radius="xl"
                size="sm"
                className="w-64 hidden sm:block bg-gray-100/50"
                classNames={{
                    input: 'bg-gray-100 border-transparent focus:bg-white transition-all'
                }}
            />

            {/* Icons */}
            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                <IconFlame size={22} className="text-gray-400 hover:text-orange-500 transition-colors" />
            </ActionIcon>

            {/* Avatar */}
            <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                   <button className="rounded-full ring-2 ring-transparent hover:ring-gray-200 transition-all">
                        <Avatar 
                            alt={user?.email || "User"} 
                            radius="xl" 
                            size="md"
                        >
                            {user?.email?.[0].toUpperCase()}
                        </Avatar>
                   </button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>{user?.email}</Menu.Label>
                    <Menu.Item>Profile</Menu.Item>
                    <Menu.Item>Settings</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" onClick={handleLogout}>Logout</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            
            <Burger opened={opened} onClick={() => setOpened((o) => !o)} hiddenFrom="md" size="sm" />
          </div>

        </div>
      </Container>
    </header>
  );
}
