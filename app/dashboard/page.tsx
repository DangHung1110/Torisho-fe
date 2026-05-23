'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconArrowRight,
  IconBook,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconFlame,
  IconLanguage,
} from '@tabler/icons-react';
import LearningShell from '@/src/components/LearningShell';
import { useAuth } from '@/src/libs/useAuth';
import { DashboardService } from '@/src/services/dashboard.service';
import { DashboardLevelProgress, DashboardResponse } from '@/src/types/dashboard';

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;
    const now = new Date();

    const loadDashboard = async () => {
      setLoadingDashboard(true);
      setDashboardError(null);

      try {
        const result = await DashboardService.getMe(now.getFullYear(), now.getMonth() + 1);
        if (!cancelled) {
          setDashboard(result);
        }
      } catch (error) {
        if (!cancelled) {
          setDashboardError(
            error instanceof Error ? error.message : 'Unable to load dashboard data'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDashboard(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const displayName = dashboard?.profile.fullName || dashboard?.profile.username || user?.username || 'Learner';
  const dateText = formatDate(dashboard?.today.date);
  const studiedDays = useMemo(
    () => new Set((dashboard?.calendar.studyDates ?? []).map((date) => Number(date.slice(-2)))),
    [dashboard?.calendar.studyDates]
  );

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] text-[#665744]">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <LearningShell active="dashboard">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1240px] space-y-10">
          {dashboardError && (
            <div className="rounded-xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-[#93000a]">
              {dashboardError}
            </div>
          )}

          <section className="border-b border-[#d7c3ae] pb-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h1 className="torisho-display text-4xl font-bold leading-tight text-[#211a12] md:text-5xl">
                Good morning, {displayName} {'\uD83D\uDC4B'}
              </h1>
              <p className="text-lg text-[#3d2a17]">{dateText}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d7c3ae] bg-[#fff1e4] px-6 text-lg font-bold">
                <IconFlame size={23} className="text-[#835500]" />
                {dashboard?.streak.current ?? 0} day streak
              </span>
              <span className="text-lg text-[#3d2a17]">
                Longest: {dashboard?.streak.longest ?? 0} days
              </span>
              <span
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-6 text-lg font-bold ${
                  dashboard?.streak.studiedToday
                    ? 'border-[#bfe5cf] bg-[#e8f7ee] text-[#0f6c2f]'
                    : 'border-[#d7c3ae] bg-white text-[#665744]'
                }`}
              >
                <IconCheck size={19} />
                {dashboard?.streak.studiedToday ? 'Studied today' : 'Not studied today'}
              </span>
            </div>
          </section>

          {loadingDashboard && (
            <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 text-[#665744]">
              Loading your current progress...
            </div>
          )}

          {!loadingDashboard && dashboard && (
            <>
              <section className="grid grid-cols-1 gap-7 xl:grid-cols-3">
                <DailyWordCard dashboard={dashboard} />
                <DailyQuizCard dashboard={dashboard} />
                <ContinueLearningCard dashboard={dashboard} />
              </section>

              <section>
                <h2 className="torisho-display mb-6 text-3xl font-bold">Your JLPT Progress</h2>
                {dashboard.progressByLevel.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
                    {dashboard.progressByLevel.map((item) => (
                      <LevelProgressCard key={item.levelId} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyCard>Start a lesson to create your first JLPT progress record.</EmptyCard>
                )}
              </section>

              <section className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_390px]">
                <KnowledgeBase dashboard={dashboard} />
                <CalendarCard dashboard={dashboard} studiedDays={studiedDays} />
              </section>
            </>
          )}
        </div>
      </div>
    </LearningShell>
  );
}

function DailyWordCard({ dashboard }: { dashboard: DashboardResponse }) {
  const dailyWord = dashboard.today.dailyWord;

  return (
    <article className="flex min-h-[320px] flex-col rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_10px_28px_rgba(26,20,16,0.05)]">
      <span className="w-fit rounded-full bg-[#f5a623] px-4 py-1.5 text-sm font-extrabold tracking-[0.08em] text-[#291800]">
        Daily Word
      </span>
      {dailyWord ? (
        <>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="torisho-jp text-7xl font-bold text-[#211a12]">{dailyWord.term}</div>
            <div className="torisho-jp mt-6 text-4xl text-[#3d2a17]">{dailyWord.reading}</div>
            <p className="mt-3 text-xl text-[#211a12]">{dailyWord.meaning}</p>
          </div>
          <Link href="/dictionary" className="flex items-center gap-2 text-lg font-bold text-[#835500] no-underline">
            View in Dictionary <IconArrowRight size={19} />
          </Link>
        </>
      ) : (
        <p className="my-auto text-center text-lg text-[#665744]">No daily word available yet.</p>
      )}
    </article>
  );
}

function DailyQuizCard({ dashboard }: { dashboard: DashboardResponse }) {
  const quiz = dashboard.today.dailyQuiz?.quiz;

  return (
    <article className="flex min-h-[320px] flex-col rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_10px_28px_rgba(26,20,16,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-[#d7c3ae] bg-[#fff1e4] px-4 py-1 text-sm font-extrabold tracking-[0.08em]">
          Daily Quiz
        </span>
        {quiz && (
          <span className="text-sm font-bold text-[#3d2a17]">
            ~{quiz.estimatedMinutes} min · {quiz.questionCount} questions
          </span>
        )}
      </div>
      {quiz ? (
        <>
          <div className="mt-7 flex gap-3">
            <span className="rounded-full bg-[#3ac2ff] px-4 py-1 text-sm font-bold text-[#001e2c]">
              {quiz.title}
            </span>
          </div>
          <div className="mt-auto">
            <p className="mb-5 flex items-center gap-2 text-lg text-[#0f6c2f]">
              <IconCheck size={20} /> Today&apos;s quiz ready
            </p>
            <Link
              href="/quiz/daily"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#f5a623] text-lg font-bold text-[#291800] no-underline transition-colors hover:bg-[#ffb955]"
            >
              Start Daily Quiz
            </Link>
          </div>
        </>
      ) : (
        <p className="my-auto text-center text-lg text-[#665744]">No daily quiz generated yet.</p>
      )}
    </article>
  );
}

function ContinueLearningCard({ dashboard }: { dashboard: DashboardResponse }) {
  const current = dashboard.continueLearning;

  return (
    <article className="flex min-h-[320px] flex-col rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_10px_28px_rgba(26,20,16,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-[#d7c3ae] bg-[#fff1e4] px-4 py-1 text-sm font-extrabold tracking-[0.08em]">
          Continue Learning
        </span>
        {current && (
          <span className="rounded-full bg-[#62fae3] px-4 py-1 text-sm font-bold text-[#00201c]">
            JLPT {current.levelCode}
          </span>
        )}
      </div>
      {current ? (
        <>
          <h2 className="torisho-display mt-7 text-3xl font-bold leading-snug">
            {current.chapterTitle}
          </h2>
          <p className="mt-3 text-lg text-[#3d2a17]">{current.lessonTitle}</p>
          <div className="mt-auto">
            <div className="mb-2 flex justify-between text-sm font-extrabold tracking-[0.08em]">
              <span>Progress</span>
              <span>{formatPercent(current.lessonProgressPercent)}%</span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#eee0d2]">
              <div
                className="h-full rounded-full bg-[#835500]"
                style={{ width: `${clampPercent(current.lessonProgressPercent)}%` }}
              />
            </div>
            <Link
              href={`/adventure/lessons/${current.lessonSlug}`}
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-[#d7c3ae] text-lg font-bold text-[#211a12] no-underline transition-colors hover:bg-[#fff1e4]"
            >
              Resume Lesson <IconArrowRight size={19} />
            </Link>
          </div>
        </>
      ) : (
        <div className="my-auto text-center">
          <p className="text-lg text-[#665744]">No active lesson yet.</p>
          <Link
            href="/adventure"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#f5a623] px-7 font-bold text-[#291800] no-underline"
          >
            Start a path
          </Link>
        </div>
      )}
    </article>
  );
}

function LevelProgressCard({ item }: { item: DashboardLevelProgress }) {
  const active = item.status.toLowerCase().includes('progress');

  return (
    <article className="rounded-xl border border-[#d7c3ae] bg-white p-5 shadow-[0_10px_28px_rgba(26,20,16,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${active ? 'bg-[#62fae3] text-[#00201c]' : 'bg-[#eee0d2] text-[#665744]'}`}>
          {item.levelCode}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${active ? 'border-[#f5a623] bg-[#f5a623] text-[#291800]' : 'border-[#d7c3ae] bg-[#fff8f4] text-[#665744]'}`}>
          {item.status || 'Not Started'}
        </span>
      </div>
      <div className="torisho-display my-4 text-right text-5xl font-bold text-[#211a12]">
        {formatPercent(item.completionPercent)}%
      </div>
      {[
        ['Vocab', item.vocabularyProgress],
        ['Grammar', item.grammarProgress],
        ['Reading', item.readingProgress],
      ].map(([label, value]) => (
        <div key={String(label)} className="mb-2 flex items-center gap-3">
          <span className="w-16 text-sm font-bold text-[#665744]">{label}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eee0d2]">
            <span className="block h-full rounded-full bg-[#835500]" style={{ width: `${clampPercent(Number(value))}%` }} />
          </span>
        </div>
      ))}
      <div className="mt-5 border-t border-[#d7c3ae] pt-3 text-center text-sm font-extrabold tracking-[0.08em] text-[#3d2a17]">
        {item.completedChapters}/{item.totalChapters} Chapters
      </div>
    </article>
  );
}

function KnowledgeBase({ dashboard }: { dashboard: DashboardResponse }) {
  const stats = [
    { label: 'Vocabulary', value: dashboard.quickStats.vocabularyLearned, icon: IconBook },
    { label: 'Grammar', value: dashboard.quickStats.grammarLearned, icon: IconFileText },
    { label: 'Kanji', value: dashboard.quickStats.kanjiLearned, icon: IconLanguage },
  ];

  return (
    <div>
      <h2 className="torisho-display mb-6 text-3xl font-bold">Knowledge Base</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="flex items-center justify-between rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]"
            >
              <span>
                <span className="block text-sm font-extrabold tracking-[0.08em] text-[#3d2a17]">
                  {stat.label}
                </span>
                <span className="torisho-display mt-2 block text-5xl font-bold">{stat.value}</span>
              </span>
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d7c3ae] bg-[#fff1e4] text-[#835500]">
                <Icon size={30} stroke={1.7} />
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CalendarCard({
  dashboard,
  studiedDays,
}: {
  dashboard: DashboardResponse;
  studiedDays: Set<number>;
}) {
  const year = dashboard.calendar.year || new Date().getFullYear();
  const month = dashboard.calendar.month || new Date().getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const cells = [
    ...Array.from({ length: firstDay }, (_, index) => ({ day: index + 1, inMonth: false })),
    ...Array.from({ length: daysInMonth }, (_, index) => ({ day: index + 1, inMonth: true })),
  ];
  const today = new Date();

  return (
    <article className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_10px_28px_rgba(26,20,16,0.04)]">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="torisho-display text-3xl font-bold">
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month - 1))}
        </h2>
        <div className="flex gap-2">
          <button className="rounded-full p-2 hover:bg-[#fff1e4]" aria-label="Previous month">
            <IconChevronLeft size={19} />
          </button>
          <button className="rounded-full p-2 hover:bg-[#fff1e4]" aria-label="Next month">
            <IconChevronRight size={19} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold text-[#3d2a17]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-lg">
        {cells.map((cell, index) => {
          const studied = cell.inMonth && studiedDays.has(cell.day);
          const isToday =
            cell.inMonth &&
            today.getFullYear() === year &&
            today.getMonth() + 1 === month &&
            today.getDate() === cell.day;

          return (
            <span
              key={`${cell.day}-${index}`}
              className={`flex h-10 items-center justify-center rounded-full ${
                !cell.inMonth
                  ? 'text-transparent'
                  : studied
                    ? 'bg-[#f5a623] font-bold text-[#291800]'
                    : isToday
                      ? 'border-2 border-[#835500] font-bold text-[#835500]'
                      : 'text-[#211a12]'
              }`}
            >
              {cell.day}
            </span>
          );
        })}
      </div>
    </article>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 text-center text-lg text-[#665744]">
      {children}
    </div>
  );
}

function formatDate(value?: string) {
  const date = value ? new Date(value) : new Date();

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function formatPercent(value: number) {
  return Math.round(clampPercent(value));
}
