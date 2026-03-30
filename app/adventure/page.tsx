'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Title, Text, Button, TextInput,
  ActionIcon, Loader
} from '@mantine/core';
import {
  IconSearch, IconBookmark, IconArrowDown, IconChevronDown,
  IconMap, IconChevronRight, IconInfoCircle
} from '@tabler/icons-react';
import DashboardHeader from '../../src/components/DashboardHeader';
import { useAuth } from '../../src/libs/useAuth';

const adventures = [
  {
    title: 'Isle of New Beginnings',
    level: 'PRE-N5',
    image: 'https://images.unsplash.com/photo-1596395817730-811c7d2429a3?q=80&w=2000&auto=format&fit=crop',
    info: 'Start your journey here!',
    emoji: '🏝️'
  },
  {
    title: 'Fledgling Forest',
    level: 'N5',
    image: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2000&auto=format&fit=crop',
    info: 'Master the basics.',
    emoji: '⛩️'
  },
  {
    title: 'Depths of Devotion',
    level: 'N4',
    image: 'https://images.unsplash.com/photo-1627916607164-7b6951910ef0?q=80&w=2000&auto=format&fit=crop',
    info: 'Learn deeper concepts.',
    emoji: '🐙'
  },
  {
    title: 'Jungle of Tenacity',
    level: 'N3',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop',
    info: 'Things get wild here.',
    emoji: '🌳'
  },
  {
    title: 'Sands of Mastery',
    level: 'N2',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop',
    info: 'The final frontier.',
    emoji: '🏜️'
  }
];

export default function AdventurePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader color="orange" size="lg" />
          <Text c="dimmed" size="sm">Loading your adventure...</Text>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      <DashboardHeader />
      <div className="flex w-full justify-center px-3 sm:px-4">
        <div className="box-border w-full flex max-w-[900px] pt-8 sm:pt-10 flex-col gap-12 items-center pt-2!">
        <div className="mx-auto mb-8 flex w-full flex-col items-center gap-10 text-center">
          <Title
            order={2}
            className="w-full text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#334155] sm:text-[1.9rem]"
          >
            The Adventure Dashboard
          </Title>

          <TextInput
            placeholder="Search.."
            radius="xl"
            size="md"
            className="w-full max-w-[350px] rounded-full border border-gray-200/90 bg-white pl-11 text-[14px] shadow-[0_2px_12px_rgba(15,23,42,0.06)] focus:border-blue-200 focus:bg-white"
            leftSection={<IconSearch size={18} className="text-gray-400" stroke={1.5} />}
            rightSectionWidth={44}
            rightSection={
              <button
                type="button"
                className="mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#5bb8f5] text-white shadow-sm transition-transform hover:scale-[1.02]"
                aria-label="Search"
              >
                <IconSearch size={16} stroke={2} />
              </button>
            }
            classNames={{
              input:
                'h-10 rounded-full border border-gray-200/90 bg-white pl-11 text-[14px] shadow-[0_2px_12px_rgba(15,23,42,0.06)]',
            }}
          />

          <Button
            leftSection={<IconBookmark size={16} stroke={1.5} />}
            variant="default"
            radius="xl"
            size="sm"
            className="h-9 w-full border border-gray-200/90 bg-[#f1f5f9] px-4 text-[14px] font-semibold text-gray-700 hover:bg-[#e8edf3]"
          >
            My Bookmarks
          </Button>

          <button
            type="button"
            className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[14px] font-semibold text-gray-500 transition-colors hover:text-gray-800"
          >
            Show Quick Filters
            <IconChevronDown size={18} stroke={2} className="text-gray-400" aria-hidden />
          </button>

          <div className="flex w-[300px] flex-col gap-1.5">
            <Button
              leftSection={<IconArrowDown size={15} stroke={1.75} />}
              radius="xl"
              size="sm"
              color="blue"
              variant="filled"
              className="h-9 w-full bg-[#5bb8f5] text-[14px] font-semibold hover:bg-[#4aadf0]"
            >
              Scroll to Current Tile
            </Button>
            <Button
              leftSection={<div className="h-2.5 w-2.5 rounded-full border-2 border-white" />}
              radius="xl"
              size="sm"
              color="green"
              variant="filled"
              className="h-9 w-full bg-[#4acb8b] text-[14px] font-semibold hover:bg-[#3dbe7f]"
            >
              Open Current Tile Modal
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-10">
          {adventures.map((adv, index) => (
            <div
              key={index}
              className="group relative h-24 w-full max-w-full shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.10)] transition-all duration-300 hover:shadow-[0_5px_14px_rgba(15,23,42,0.16)]"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%), url(${adv.image}) center/cover no-repeat`,
              }}
            >
              <div className="relative z-10 flex h-full min-h-0 w-full items-center justify-between">
                <div className="min-w-0 flex-1">
                  <Title
                    order={4}
                    className="truncate pl-6 text-[20px] font-bold leading-tight tracking-tight text-white"
                    style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
                  >
                    {adv.title} ({adv.level})
                  </Title>
                </div>

                <div className="flex h-full shrink-0 items-center gap-3 pr-4 text-white">
                  <IconChevronRight size={22} stroke={2.2} className="text-white/95" aria-hidden />
                  <ActionIcon
                    variant="transparent"
                    className="h-8 w-8 rounded-full border border-white/85 text-white/95 transition-all hover:bg-white/10 hover:text-white"
                    radius="xl"
                    size="md"
                    aria-label="Zone information"
                  >
                    <IconInfoCircle size={18} stroke={2} />
                  </ActionIcon>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Fixed MAP button — bottom center of viewport, outside banners */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <div className="pointer-events-auto">
          <Button
            leftSection={<IconMap size={16} stroke={1.5} />}
            variant="filled"
            color="violet"
            radius="xl"
            size="sm"
            className="h-10 px-5 font-bold shadow-lg"
          >
            MAP
          </Button>
        </div>
      </div>
    </div>
  );
}
