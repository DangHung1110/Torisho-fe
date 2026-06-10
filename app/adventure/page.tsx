'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconArrowRight,
  IconBook2,
  IconChevronDown,
  IconCircleCheck,
  IconLock,
  IconMap,
  IconSearch,
} from '@tabler/icons-react';
import LearningShell from '@/src/components/LearningShell';
import { useAuth } from '@/src/libs/useAuth';
import { LearningService } from '@/src/services/learning.service';
import {
  ChapterLessonsResponse,
  LevelChaptersResponse,
  LessonListItem,
} from '@/src/types/learning';
import { JLPTLevel } from '@/src/types/room';

type LevelTone = {
  title: string;
  description: string;
  color: string;
  soft: string;
  text: string;
  chapters: string;
};

const journeyArtwork =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDRtRsDkVizsE-min34jfG6UasXsHIPgc2qpgQYZJjUm7pCTbliMPUjxG_8rjS56gy0zmeXEFc1yzET2jh2UGphRInW-pgVXrKRlvr8MEFEVhXGA9FU-Cy9-A4TfbzfjBt1ni2pVa1NOyaxtglZpjJjpS1rsIP1BRpbsmHAOUcRft86DIiRrbM-LIZkvBYoXHpnnJMS-TvUzgn2PvUTLyUHoTqHAVy4YxozJ0QSBjHnMoKiuy76ACSTbL3wNrCPOpS9RurarvxD63s';

const levelOrder = [JLPTLevel.N5, JLPTLevel.N4, JLPTLevel.N3, JLPTLevel.N2, JLPTLevel.N1];

const levelMeta: Record<JLPTLevel, LevelTone> = {
  [JLPTLevel.N5]: {
    title: 'Basics & Foundations',
    description: 'Start with kana, greetings, core particles, and everyday sentence patterns.',
    color: '#00796b',
    soft: '#e4f6ef',
    text: '#005047',
    chapters: '12 Chapters • 48 Lessons',
  },
  [JLPTLevel.N4]: {
    title: 'Everyday Communication',
    description: 'Build natural travel, school, work, and daily conversation patterns.',
    color: '#00658a',
    soft: '#e4f4fb',
    text: '#004c69',
    chapters: '15 Chapters • 60 Lessons',
  },
  [JLPTLevel.N3]: {
    title: 'Intermediate Fluency',
    description: 'Connect ideas with longer readings, richer grammar, and stronger kanji habits.',
    color: '#5b8fd5',
    soft: '#eaf3ff',
    text: '#255b90',
    chapters: '18 Chapters • 72 Lessons',
  },
  [JLPTLevel.N2]: {
    title: 'Advanced Reading',
    description: 'Handle essays, news language, nuanced grammar, and professional vocabulary.',
    color: '#f5a623',
    soft: '#fff1d6',
    text: '#835500',
    chapters: '20 Chapters • 80 Lessons',
  },
  [JLPTLevel.N1]: {
    title: 'Mastery & Nuance',
    description: 'Refine precision, literary expression, advanced kanji, and fast comprehension.',
    color: '#9b72cf',
    soft: '#f1e9fb',
    text: '#5f3b8f',
    chapters: '22 Chapters • 88 Lessons',
  },
};

const createChapterKey = (level: JLPTLevel, chapterOrder: number) =>
  `${level}-${chapterOrder}`;

export default function AdventurePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [openLevel, setOpenLevel] = useState<JLPTLevel>(JLPTLevel.N5);
  const [chaptersByLevel, setChaptersByLevel] = useState<
    Partial<Record<JLPTLevel, LevelChaptersResponse>>
  >({});
  const [levelErrors, setLevelErrors] = useState<Partial<Record<JLPTLevel, string | null>>>({});
  const [loadingLevel, setLoadingLevel] = useState<JLPTLevel | null>(null);
  const [openChapterKey, setOpenChapterKey] = useState(createChapterKey(JLPTLevel.N5, 2));
  const [lessonsByChapterKey, setLessonsByChapterKey] = useState<
    Record<string, ChapterLessonsResponse>
  >({});
  const [loadingChapterKey, setLoadingChapterKey] = useState<string | null>(null);
  const [chapterErrors, setChapterErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  const loadLevel = useCallback(
    async (level: JLPTLevel) => {
      if (chaptersByLevel[level] || loadingLevel === level) {
        return;
      }

      setLoadingLevel(level);
      setLevelErrors((prev) => ({ ...prev, [level]: null }));

      try {
        const response = await LearningService.getLevelChapters(level);
        setChaptersByLevel((prev) => ({ ...prev, [level]: response }));
      } catch (error) {
        setLevelErrors((prev) => ({
          ...prev,
          [level]: error instanceof Error ? error.message : 'Failed to load chapters',
        }));
      } finally {
        setLoadingLevel(null);
      }
    },
    [chaptersByLevel, loadingLevel]
  );

  useEffect(() => {
    if (isAuthenticated) {
      void loadLevel(JLPTLevel.N5);
    }
  }, [isAuthenticated, loadLevel]);

  const handleToggleLevel = (level: JLPTLevel) => {
    setOpenLevel(level);
    void loadLevel(level);
  };

  const handleToggleChapter = async (level: JLPTLevel, chapterOrder: number) => {
    const chapterKey = createChapterKey(level, chapterOrder);

    setOpenChapterKey((current) => (current === chapterKey ? '' : chapterKey));

    if (lessonsByChapterKey[chapterKey]) {
      return;
    }

    setLoadingChapterKey(chapterKey);
    setChapterErrors((prev) => ({ ...prev, [chapterKey]: null }));

    try {
      const response = await LearningService.getChapterLessons(level, chapterOrder);
      setLessonsByChapterKey((prev) => ({ ...prev, [chapterKey]: response }));
    } catch (error) {
      setChapterErrors((prev) => ({
        ...prev,
        [chapterKey]: error instanceof Error ? error.message : 'Failed to load lessons',
      }));
    } finally {
      setLoadingChapterKey(null);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] text-[#665744]">
        Loading your adventure...
      </div>
    );
  }

  return (
    <LearningShell active="adventure">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1160px] space-y-10">
          <section className="overflow-hidden rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_12px_32px_rgba(26,20,16,0.05)] md:p-10">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_250px]">
              <div>
                <h1 className="torisho-display text-5xl font-bold leading-tight text-[#211a12]">
                  Your JLPT Journey
                </h1>
                <p className="mt-4 text-2xl text-[#3d2a17]">Choose your path and start learning.</p>
              </div>
              <div className="relative mx-auto h-52 w-52 bg-[#fff8f4] shadow-[0_18px_38px_rgba(26,20,16,0.08)] ring-1 ring-[#d7c3ae]">
                <Image
                  src={journeyArtwork}
                  alt="Torisho chicken sensei holding a map"
                  fill
                  priority
                  unoptimized
                  sizes="220px"
                  className="object-contain p-4"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block w-full xl:w-[480px]">
              <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3d2a17]" size={25} />
              <input
                type="search"
                placeholder="Search lessons or chapters..."
                className="h-[74px] w-full rounded-lg border border-[#d7c3ae] bg-white pl-16 pr-5 text-xl text-[#211a12] outline-none transition-shadow placeholder:text-[#857462] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.2)]"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              {['ALL', ...levelOrder].map((label) => (
                <button
                  key={label}
                  className="h-10 rounded-full border border-[#d7c3ae] bg-white px-6 text-sm font-extrabold tracking-[0.12em] text-[#3d2a17] transition-colors hover:bg-[#fff1e4]"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex w-fit rounded-lg border border-[#d7c3ae] bg-white p-2 shadow-sm">
              <button className="rounded-md bg-[#fff1e4] p-3 text-[#835500]" aria-label="List view">
                <IconBook2 size={23} />
              </button>
              <button className="rounded-md p-3 text-[#3d2a17] hover:bg-[#fff1e4]" aria-label="Map view">
                <IconMap size={23} />
              </button>
            </div>
          </section>

          <section className="space-y-7">
            {levelOrder.map((level) => (
              <LevelCard
                key={level}
                level={level}
                isOpen={openLevel === level}
                levelData={chaptersByLevel[level]}
                levelError={levelErrors[level]}
                loadingLevel={loadingLevel === level}
                openChapterKey={openChapterKey}
                lessonsByChapterKey={lessonsByChapterKey}
                loadingChapterKey={loadingChapterKey}
                chapterErrors={chapterErrors}
                onToggleLevel={handleToggleLevel}
                onToggleChapter={handleToggleChapter}
                onOpenLesson={(slug) => router.push(`/adventure/lessons/${slug}`)}
              />
            ))}
          </section>
        </div>
      </div>
    </LearningShell>
  );
}

type LevelCardProps = {
  level: JLPTLevel;
  isOpen: boolean;
  levelData?: LevelChaptersResponse;
  levelError?: string | null;
  loadingLevel: boolean;
  openChapterKey: string;
  lessonsByChapterKey: Record<string, ChapterLessonsResponse>;
  loadingChapterKey: string | null;
  chapterErrors: Record<string, string | null>;
  onToggleLevel: (level: JLPTLevel) => void;
  onToggleChapter: (level: JLPTLevel, chapterOrder: number) => void;
  onOpenLesson: (slug: string) => void;
};

function LevelCard({
  level,
  isOpen,
  levelData,
  levelError,
  loadingLevel,
  openChapterKey,
  lessonsByChapterKey,
  loadingChapterKey,
  chapterErrors,
  onToggleLevel,
  onToggleChapter,
  onOpenLesson,
}: LevelCardProps) {
  const meta = levelMeta[level];
  const chapters = levelData?.chapters ?? [];
  const progress = level === JLPTLevel.N5 ? 45 : 0;
  const locked = [JLPTLevel.N3, JLPTLevel.N2, JLPTLevel.N1].includes(level);

  return (
    <article className="overflow-hidden rounded-xl border border-[#d7c3ae] bg-white shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
      <button
        type="button"
        onClick={() => onToggleLevel(level)}
        className="flex w-full flex-col gap-6 p-7 text-left transition-colors hover:bg-[#fffdfb] md:flex-row md:items-center md:justify-between md:p-9"
      >
        <div className="flex items-center gap-6">
          <span
            className="torisho-display flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-4xl font-bold text-white"
            style={{ backgroundColor: locked ? '#eee0d2' : meta.color, color: locked ? '#665744' : '#fff' }}
          >
            {level}
          </span>
          <span>
            <span className="torisho-display flex items-center gap-3 text-3xl font-bold leading-tight">
              {locked && <IconLock size={24} className="text-[#857462]" />}
              {meta.title}
            </span>
            <span className="mt-2 block text-lg text-[#3d2a17]">
              {levelData ? `${levelData.totalChapters} Chapters` : meta.chapters}
            </span>
          </span>
        </div>

        <div className="w-full md:w-80">
          <div className="mb-2 flex justify-between text-sm font-extrabold tracking-[0.08em]">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#eee0d2]">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: meta.color }} />
          </div>
          <IconChevronDown
            className={`ml-auto mt-4 text-[#665744] transition-transform ${isOpen ? 'rotate-180' : ''}`}
            size={24}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[#d7c3ae] bg-[#fffdfb]">
          {loadingLevel && chapters.length === 0 && <StateRow message="Loading chapters..." />}
          {!loadingLevel && levelError && chapters.length === 0 && (
            <StateRow message={levelError} tone="error" />
          )}

          {chapters.length > 0 &&
            chapters.map((chapter, index) => {
              const chapterKey = createChapterKey(level, chapter.order);
              const chapterOpen = openChapterKey === chapterKey;
              const chapterLoading = loadingChapterKey === chapterKey;
              const chapterError = chapterErrors[chapterKey];
              const lessonData = lessonsByChapterKey[chapterKey];
              const lessons = lessonData?.lessons ?? [];

              return (
                <div key={chapter.id} className="border-b border-[#eee0d2] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onToggleChapter(level, chapter.order)}
                    className={`flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-[#fff8f4] ${
                      index === 1 ? 'border-l-4 border-[#835500] bg-white' : ''
                    }`}
                  >
                    <span className="flex items-center gap-4 text-2xl">
                      {index === 0 ? (
                        <IconCircleCheck size={29} className="text-[#00796b]" />
                      ) : locked ? (
                        <IconLock size={25} className="text-[#857462]" />
                      ) : (
                        <span
                          className="h-7 w-7 rounded-full border-4"
                          style={{ borderColor: index === 1 ? '#f5a623' : '#d7c3ae' }}
                        />
                      )}
                      <span className={locked ? 'text-[#857462]' : 'text-[#211a12]'}>
                        Chapter {chapter.order}: {chapter.title}
                      </span>
                    </span>
                    <span className="flex items-center gap-6 font-bold">
                      {index === 0 ? '100%' : chapterOpen ? <IconChevronDown size={22} /> : <IconChevronDown className="-rotate-90" size={22} />}
                    </span>
                  </button>

                  {chapterOpen && (
                    <div className="space-y-5 bg-[#fff8f4] px-8 py-6 md:pl-16">
                      {chapterLoading && <StateRow message="Loading lessons..." compact />}
                      {!chapterLoading && chapterError && <StateRow message={chapterError} tone="error" compact />}
                      {!chapterLoading &&
                        !chapterError &&
                        lessons.map((lesson, lessonIndex) => (
                          <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            highlighted={lessonIndex === 1}
                            locked={locked || lessonIndex > 1}
                            onOpenLesson={onOpenLesson}
                          />
                        ))}
                      {!chapterLoading && !chapterError && lessons.length === 0 && (
                        <StateRow message="Lessons will appear here when this chapter is ready." compact />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </article>
  );
}

function LessonRow({
  lesson,
  highlighted,
  locked,
  onOpenLesson,
}: {
  lesson: LessonListItem;
  highlighted?: boolean;
  locked?: boolean;
  onOpenLesson: (slug: string) => void;
}) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border bg-white p-5 md:flex-row md:items-center md:justify-between ${
        highlighted ? 'border-[#f5a623] shadow-[0_0_0_2px_rgba(245,166,35,0.18)]' : 'border-[#d7c3ae]'
      } ${locked ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        {locked && <IconLock className="mt-1 text-[#857462]" size={24} />}
        <div>
          <h3 className="text-xl font-medium">
            Lesson {lesson.order}: {lesson.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#c4e7ff] px-3 py-1 text-xs font-bold uppercase text-[#004c69]">
              Vocab
            </span>
            {lesson.grammarCount > 0 && (
              <span className="rounded-full bg-[#ffdad6] px-3 py-1 text-xs font-bold uppercase text-[#93000a]">
                Grammar
              </span>
            )}
            {lesson.readingCount > 0 && (
              <span className="rounded-full bg-[#62fae3] px-3 py-1 text-xs font-bold uppercase text-[#005047]">
                Reading
              </span>
            )}
          </div>
        </div>
      </div>
      {!locked && (
        <button
          type="button"
          onClick={() => onOpenLesson(lesson.slug)}
          className={`flex h-12 items-center justify-center gap-2 rounded-full px-8 text-lg font-medium transition-colors ${
            highlighted
              ? 'bg-[#f5a623] text-[#291800] hover:bg-[#ffb955]'
              : 'border border-[#d7c3ae] bg-[#fff1e4] text-[#3d2a17] hover:bg-[#f4e6d8]'
          }`}
        >
          {highlighted ? 'Continue' : 'Review'} <IconArrowRight size={18} />
        </button>
      )}
    </div>
  );
}

function StateRow({
  message,
  tone = 'default',
  compact = false,
}: {
  message: string;
  tone?: 'default' | 'error';
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-5 py-4 text-sm font-bold ${
        compact ? '' : 'm-6'
      } ${
        tone === 'error'
          ? 'border-[#ffdad6] bg-[#fff1ef] text-[#93000a]'
          : 'border-[#d7c3ae] bg-white text-[#665744]'
      }`}
    >
      {message}
    </div>
  );
}
