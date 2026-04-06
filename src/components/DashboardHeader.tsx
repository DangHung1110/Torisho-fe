// src/components/DashboardHeader.tsx
'use client';

import { Burger, TextInput, Menu, Avatar, Text, Modal, Button, Stack, Group } from '@mantine/core';
import { IconSearch, IconBell, IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../libs/useAuth';
import Image from 'next/image';
import { RoomService } from '../services/room.service';
import { JLPTLevel } from '../types/room';

const navLink =
  'px-1.5 py-1 text-base tracking-[0.3px] font-bold no-underline transition-colors';

const activeNavText = 'font-extrabold text-gray-700';
const inactiveNavText = 'font-bold text-gray-400 hover:text-gray-600';

export default function DashboardHeader() {
  const [opened, setOpened] = useState(false);
  const [speakingModalOpened, setSpeakingModalOpened] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | null>(null);
  const [dictionaryKeyword, setDictionaryKeyword] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const previousUrlRef = useRef<string | null>(null);

  const getNavClass = (href: string) => {
    const isActive = href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

    return isActive
      ? `${navLink} ${activeNavText}`
      : `${navLink} ${inactiveNavText}`;
  };

  const studyListsActive = speakingModalOpened || pathname === '/speaking' || pathname.startsWith('/speaking/');

  const handleLogout = async () => {
    await logout();
  };

  const openSpeakingModal = () => {
    if (typeof window !== 'undefined') {
      previousUrlRef.current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (window.location.pathname !== '/speaking') {
        window.history.pushState({ speakingModal: true }, '', '/speaking');
      }
    }
    setJoinError('');
    setSpeakingModalOpened(true);
  };

  const closeSpeakingModal = () => {
    setSpeakingModalOpened(false);
    setJoinError('');
    setSelectedLevel(null);

    if (typeof window !== 'undefined' && previousUrlRef.current && window.location.pathname === '/speaking') {
      const previousUrl = previousUrlRef.current;
      if (previousUrl !== '/speaking') {
        window.history.replaceState(window.history.state, '', previousUrl);
      }
    }

    previousUrlRef.current = null;
  };

  const handleJoinSpeakingRoom = async () => {
    if (!selectedLevel) {
      setJoinError('Please select a JLPT level first.');
      return;
    }

    try {
      setIsJoining(true);
      setJoinError('');

      const result = await RoomService.findOrCreateRoom(selectedLevel);
      if (result.room?.id) {
        setSpeakingModalOpened(false);
        previousUrlRef.current = null;
        router.push(`/speaking/room/${result.room.id}`);
        return;
      }

      setJoinError('Unable to join room. Please try again.');
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'Failed to join speaking room.');
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (speakingModalOpened && typeof window !== 'undefined' && window.location.pathname !== '/speaking') {
        setSpeakingModalOpened(false);
        setJoinError('');
        setSelectedLevel(null);
        previousUrlRef.current = null;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [speakingModalOpened]);

  const displayInitial =
    user?.username?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? '?';

  const handleDictionarySearch = () => {
    const keyword = dictionaryKeyword.trim();
    if (!keyword) {
      return;
    }

    router.push(`/dictionary?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <>
      <Modal
        opened={speakingModalOpened}
        onClose={closeSpeakingModal}
        title="Speaking Practice"
        centered
        radius="lg"
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">Choose a level and join room directly from popup.</Text>

          <Group gap="xs" wrap="wrap">
            {[JLPTLevel.N5, JLPTLevel.N4, JLPTLevel.N3, JLPTLevel.N2, JLPTLevel.N1].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'filled' : 'default'}
                color={selectedLevel === level ? 'blue' : 'gray'}
                radius="xl"
                size="xs"
                onClick={() => setSelectedLevel(level)}
                disabled={isJoining}
              >
                {level}
              </Button>
            ))}
          </Group>

          {joinError && (
            <Text size="xs" c="red">{joinError}</Text>
          )}

          <Group justify="flex-end">
            <Button variant="default" radius="xl" onClick={closeSpeakingModal}>
              Close
            </Button>
            <Button radius="xl" onClick={handleJoinSpeakingRoom} loading={isJoining}>
              Join Room
            </Button>
          </Group>
        </Stack>
      </Modal>

      <header className="sticky top-0 z-50 w-full bg-transparent pb-2 pt-3 sm:pt-4">
      <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
        <div className="flex h-16 w-full max-w-[1040px] items-center gap-5 rounded-2xl border border-gray-100/90 bg-white/95 px-6 shadow-[0_4px_24px_rgba(15,23,42,0.08)] backdrop-blur-md supports-backdrop-filter:bg-white/90 sm:gap-6 sm:px-8 lg:px-10">
        {/* Left: brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-3 no-underline">
          <div className="h-10 w-10 overflow-hidden rounded-full shadow-md transition-transform duration-300 group-hover:rotate-12">
            <Image src="/images/torisho-logo.png" alt="Torisho" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <span className="hidden text-lg font-extrabold tracking-tight text-gray-800 transition-colors group-hover:text-orange-500 sm:block">
            Torisho
          </span>
        </Link>

        {/* Center: main nav (spread across middle of header) */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex">
          <Link href="/" className={getNavClass('/')}>
            Home
          </Link>
          <Link href="/adventure" className={getNavClass('/adventure')}>
            Adventure
          </Link>
          <Menu shadow="md" width={200} radius="md" position="bottom" offset={8}>
            <Menu.Target>
              <button
                type="button"
                className={studyListsActive
                  ? `${navLink} ${activeNavText} flex cursor-pointer items-center gap-1 border-0 bg-transparent`
                  : `${navLink} ${inactiveNavText} flex cursor-pointer items-center gap-1 border-0 bg-transparent`
                }
              >
                Study Lists <IconChevronDown size={14} stroke={1.5} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={openSpeakingModal}>
                Speaking
              </Menu.Item>
              <Menu.Item>Vocabulary List</Menu.Item>
              <Menu.Item>Grammar Notes</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu shadow="md" width={180} radius="md">
            <Menu.Target>
              <button
                type="button"
                className={`${navLink} ${inactiveNavText} flex cursor-pointer items-center gap-1 border-0 bg-transparent`}
              >
                Resources <IconChevronDown size={14} stroke={1.5} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => router.push('/dictionary')}>Dictionary</Menu.Item>
              <Menu.Item>Grammar</Menu.Item>
              <Menu.Item>Kanji</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </nav>

        {/* Right: search, streak, account */}
        <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4 md:gap-5">
          <TextInput
            placeholder="Search Dictionary..."
            value={dictionaryKeyword}
            onChange={(event) => setDictionaryKeyword(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleDictionarySearch();
              }
            }}
            rightSection={
              <button
                type="button"
                onClick={handleDictionarySearch}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Search dictionary"
              >
                <IconSearch size={16} stroke={1.75} />
              </button>
            }
            radius="xl"
            size="sm"
            className="hidden w-[200px] sm:block lg:w-[240px]"
            classNames={{
              input:
                'h-10 border-gray-200/80 bg-gray-50/90 text-sm transition-all focus:border-blue-200 focus:bg-white',
            }}
          />

          <button
            type="button"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 sm:flex"
            aria-label="Notifications"
          >
            <IconBell size={18} stroke={1.75} />
          </button>

          <Menu shadow="lg" width={200} position="bottom-end" radius="lg">
            <Menu.Target>
              <button
                type="button"
                className="cursor-pointer rounded-full border-0 bg-transparent p-0 ring-2 ring-transparent transition-all hover:ring-gray-200"
              >
                <Avatar alt={user?.username || user?.email || 'User'} radius="xl" size={36} className="shadow-sm">
                  {displayInitial}
                </Avatar>
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <Text size="xs" c="dimmed" truncate>
                  {user?.email}
                </Text>
              </Menu.Label>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item>Settings</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Burger opened={opened} onClick={() => setOpened((o) => !o)} hiddenFrom="md" size="sm" />
        </div>
      </div>
      </div>
      </header>
    </>
  );
}
