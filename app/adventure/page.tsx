'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Title, Text, Button, TextInput,
  ActionIcon, Loader,
} from '@mantine/core';
import {
  IconSearch, IconBookmark, IconArrowDown, IconChevronDown,
  IconMap, IconChevronRight, IconInfoCircle,
} from '@tabler/icons-react';
import DashboardHeader from '../../src/components/DashboardHeader';
import { useAuth } from '../../src/libs/useAuth';
import { LearningService } from '../../src/services/learning.service';
import {
  ChapterLessonsResponse,
  LevelChaptersResponse,
} from '../../src/types/learning';
import { JLPTLevel } from '../../src/types/room';

type AdventureLevelCode = 'PRE-N5' | JLPTLevel;

type AdventureItem = {
  title: string;
  level: AdventureLevelCode;
  image: string;
  info: string;
  expandable: boolean;
};

const adventures: AdventureItem[] = [
  {
    title: 'Isle of New Beginnings',
    level: 'PRE-N5',
    image: '/images/adventure/pre-n5-banner.svg',
    info: 'Start your journey here!',
    expandable: false,
  },
  {
    title: 'Fledgling Forest',
    level: JLPTLevel.N5,
    image: '/images/adventure/n5-banner.svg',
    info: 'Master the basics.',
    expandable: true,
  },
  {
    title: 'Depths of Devotion',
    level: JLPTLevel.N4,
    image: '/images/adventure/n4-banner.svg',
    info: 'Learn deeper concepts.',
    expandable: true,
  },
  {
    title: 'Jungle of Tenacity',
    level: JLPTLevel.N3,
    image: '/images/adventure/n3-banner.svg',
    info: 'Things get wild here.',
    expandable: true,
  },
  {
    title: 'Sands of Mastery',
    level: JLPTLevel.N2,
    image: '/images/adventure/n2-banner.svg',
    info: 'The final frontier.',
    expandable: true,
  },
  {
    title: 'Peak of Enlightenment',
    level: JLPTLevel.N1,
    image: '/images/adventure/n1-banner.svg',
    info: 'Master nuance and advanced reading.',
    expandable: true,
  },
];

const isJlptLevel = (level: AdventureLevelCode): level is JLPTLevel =>
  level !== 'PRE-N5';

const createChapterKey = (level: JLPTLevel, chapterOrder: number) =>
  `${level}-${chapterOrder}`;

const getLevelTone = (level: JLPTLevel) => {
  switch (level) {
    case JLPTLevel.N5:
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        chip: 'bg-emerald-50 text-emerald-700',
        soft: 'bg-emerald-50/55',
        hover: 'hover:border-emerald-200 hover:bg-emerald-50/40',
      };
    case JLPTLevel.N4:
      return {
        badge: 'bg-sky-50 text-sky-700 border-sky-100',
        chip: 'bg-sky-50 text-sky-700',
        soft: 'bg-sky-50/55',
        hover: 'hover:border-sky-200 hover:bg-sky-50/40',
      };
    case JLPTLevel.N3:
      return {
        badge: 'bg-teal-50 text-teal-700 border-teal-100',
        chip: 'bg-teal-50 text-teal-700',
        soft: 'bg-teal-50/55',
        hover: 'hover:border-teal-200 hover:bg-teal-50/40',
      };
    case JLPTLevel.N2:
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-100',
        chip: 'bg-amber-50 text-amber-700',
        soft: 'bg-amber-50/55',
        hover: 'hover:border-amber-200 hover:bg-amber-50/40',
      };
    case JLPTLevel.N1:
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        chip: 'bg-indigo-50 text-indigo-700',
        soft: 'bg-indigo-50/55',
        hover: 'hover:border-indigo-200 hover:bg-indigo-50/40',
      };
  }
};

export default function AdventurePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [openLevel, setOpenLevel] = useState<JLPTLevel | null>(null);
  const [chaptersByLevel, setChaptersByLevel] = useState<
    Partial<Record<JLPTLevel, LevelChaptersResponse>>
  >({});
  const [levelErrors, setLevelErrors] = useState<
    Partial<Record<JLPTLevel, string | null>>
  >({});
  const [loadingLevel, setLoadingLevel] = useState<JLPTLevel | null>(null);

  const [openChapterKey, setOpenChapterKey] = useState<string | null>(null);
  const [lessonsByChapterKey, setLessonsByChapterKey] = useState<
    Record<string, ChapterLessonsResponse>
  >({});
  const [loadingChapterKey, setLoadingChapterKey] = useState<string | null>(null);
  const [chapterErrors, setChapterErrors] = useState<Record<string, string | null>>(
    {}
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleToggleLevel = async (level: AdventureLevelCode) => {
    if (!isJlptLevel(level)) {
      return;
    }

    if (openLevel === level) {
      setOpenLevel(null);
      setOpenChapterKey(null);
      return;
    }

    setOpenLevel(level);
    setOpenChapterKey(null);

    if (chaptersByLevel[level] || loadingLevel === level) {
      return;
    }

    setLoadingLevel(level);
    setLevelErrors((prev) => ({
      ...prev,
      [level]: null,
    }));

    try {
      const response = await LearningService.getLevelChapters(level);
      setChaptersByLevel((prev) => ({
        ...prev,
        [level]: response,
      }));
    } catch (error) {
      setLevelErrors((prev) => ({
        ...prev,
        [level]: error instanceof Error ? error.message : 'Failed to load chapters',
      }));
    } finally {
      setLoadingLevel(null);
    }
  };

  const handleToggleChapter = async (level: JLPTLevel, chapterOrder: number) => {
    const chapterKey = createChapterKey(level, chapterOrder);

    if (openChapterKey === chapterKey) {
      setOpenChapterKey(null);
      return;
    }

    setOpenChapterKey(chapterKey);

    if (lessonsByChapterKey[chapterKey]) {
      return;
    }

    setLoadingChapterKey(chapterKey);
    setChapterErrors((prev) => ({
      ...prev,
      [chapterKey]: null,
    }));

    try {
      const response = await LearningService.getChapterLessons(level, chapterOrder);
      setLessonsByChapterKey((prev) => ({
        ...prev,
        [chapterKey]: response,
      }));
    } catch (error) {
      setChapterErrors((prev) => ({
        ...prev,
        [chapterKey]: error instanceof Error ? error.message : 'Failed to load lessons',
      }));
    } finally {
      setLoadingChapterKey(null);
    }
  };

  const handleOpenLesson = (slug: string) => {
    router.push(`/adventure/lessons/${slug}`);
  };

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
      <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-[1040px]">
          <div className="box-border mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-8 sm:pt-10">
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
              className="h-9 border border-gray-200/90 bg-[#f1f5f9] px-4 text-[14px] font-semibold text-gray-700 hover:bg-[#e8edf3]"
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

          <div className="flex w-full flex-col gap-6">
            {adventures.map((adv) => {
              const levelCode = isJlptLevel(adv.level) ? adv.level : null;
              const isOpen = levelCode !== null && openLevel === levelCode;
              const levelData = levelCode ? chaptersByLevel[levelCode] : null;
              const levelError = levelCode ? levelErrors[levelCode] : null;
              const levelIsLoading = levelCode !== null && loadingLevel === levelCode;
              const tone = levelCode ? getLevelTone(levelCode) : null;

              return (
                <section key={adv.level} className="flex w-full flex-col gap-3">
                  <div
                    onClick={() => void handleToggleLevel(adv.level)}
                    className={`group relative h-28 w-full max-w-full shrink-0 overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.10)] transition-all duration-300 hover:shadow-[0_5px_14px_rgba(15,23,42,0.16)] ${adv.expandable ? 'cursor-pointer' : 'cursor-default'}`}
                    style={{
                      background: `linear-gradient(to right, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 60%), url(${adv.image}) center/cover no-repeat`,
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
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-slate-700 shadow-sm">
                          {adv.expandable
                            ? levelData
                              ? `${levelData.totalChapters} chapters`
                              : 'Browse chapters'
                            : 'Coming soon'}
                        </span>

                        {adv.expandable ? (
                          isOpen ? (
                            <IconChevronDown size={22} stroke={2.2} className="text-white/95" aria-hidden />
                          ) : (
                            <IconChevronRight size={22} stroke={2.2} className="text-white/95" aria-hidden />
                          )
                        ) : (
                          <IconChevronRight size={22} stroke={2.2} className="text-white/95" aria-hidden />
                        )}

                        <ActionIcon
                          variant="transparent"
                          className="h-8 w-8 rounded-full border border-white/85 text-white/95 transition-all hover:bg-white/10 hover:text-white"
                          radius="xl"
                          size="md"
                          aria-label="Zone information"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <IconInfoCircle size={18} stroke={2} />
                        </ActionIcon>
                      </div>
                    </div>
                  </div>

                  {isOpen && levelCode && tone && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_26px_rgba(15,23,42,0.06)] sm:p-4">
                      {levelIsLoading && (
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <Loader size="sm" color="orange" />
                          <Text size="sm" c="dimmed">
                            Loading chapters...
                          </Text>
                        </div>
                      )}

                      {!levelIsLoading && levelError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                          <Text size="sm" c="red">
                            {levelError}
                          </Text>
                        </div>
                      )}

                      {!levelIsLoading &&
                        !levelError &&
                        levelData &&
                        levelData.chapters.length > 0 && (
                          <div className="flex flex-col gap-3">
                            {levelData.chapters.map((chapter) => {
                              const chapterKey = createChapterKey(levelCode, chapter.order);
                              const isChapterOpen = openChapterKey === chapterKey;
                              const lessonData = lessonsByChapterKey[chapterKey];
                              const chapterIsLoading = loadingChapterKey === chapterKey;
                              const chapterError = chapterErrors[chapterKey];

                              return (
                                <article
                                  key={chapter.id}
                                  className={`overflow-hidden rounded-xl border border-slate-200 ${tone.soft}`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => void handleToggleChapter(levelCode, chapter.order)}
                                    className="flex w-full items-center justify-between gap-4 bg-white/85 px-4 py-3 text-left transition-colors hover:bg-white"
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold ${tone.badge}`}
                                      >
                                        {chapter.order}
                                      </span>
                                      <div className="min-w-0">
                                        <Text fw={700} className="truncate text-slate-900">
                                          {chapter.title}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                          {chapter.lessonCount} lessons
                                        </Text>
                                      </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${tone.chip}`}>
                                        Chapter {chapter.order}
                                      </span>
                                      {isChapterOpen ? (
                                        <IconChevronDown size={18} stroke={2.2} className="text-slate-500" />
                                      ) : (
                                        <IconChevronRight size={18} stroke={2.2} className="text-slate-500" />
                                      )}
                                    </div>
                                  </button>

                                  {isChapterOpen && (
                                    <div className="border-t border-slate-200 bg-slate-50/75 p-3">
                                      {chapterIsLoading && (
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4">
                                          <Loader size="sm" color="orange" />
                                          <Text size="sm" c="dimmed">
                                            Loading lessons...
                                          </Text>
                                        </div>
                                      )}

                                      {!chapterIsLoading && chapterError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                                          <Text size="sm" c="red">
                                            {chapterError}
                                          </Text>
                                        </div>
                                      )}

                                      {!chapterIsLoading &&
                                        !chapterError &&
                                        lessonData &&
                                        lessonData.lessons.length > 0 && (
                                          <div className="flex flex-col gap-2">
                                            {lessonData.lessons.map((lesson) => (
                                              <button
                                                key={lesson.id}
                                                type="button"
                                                onClick={() => handleOpenLesson(lesson.slug)}
                                                className={`rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-all ${tone.hover}`}
                                              >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                  <div className="min-w-0">
                                                    <Text fw={700} className="leading-6 text-slate-900">
                                                      Lesson {lesson.order}: {lesson.title}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                      {lesson.slug}
                                                    </Text>
                                                  </div>

                                                  <div className="flex flex-wrap items-center justify-end gap-2">
                                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.chip}`}>
                                                      Vocab {lesson.vocabularyCount}
                                                    </span>
                                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.chip}`}>
                                                      Grammar {lesson.grammarCount}
                                                    </span>
                                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.chip}`}>
                                                      Reading {lesson.readingCount}
                                                    </span>
                                                    <IconChevronRight size={16} stroke={2.2} className="text-slate-400" />
                                                  </div>
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        )}

                                      {!chapterIsLoading &&
                                        !chapterError &&
                                        lessonData &&
                                        lessonData.lessons.length === 0 && (
                                          <Text size="sm" c="dimmed">
                                            No lessons found for this chapter.
                                          </Text>
                                        )}
                                    </div>
                                  )}
                                </article>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
        </div>
      </div>

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
