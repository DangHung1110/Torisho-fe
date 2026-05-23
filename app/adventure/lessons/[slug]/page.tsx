'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconBookmarkPlus,
  IconBook2,
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
} from '@tabler/icons-react';
import { useAuth } from '@/src/libs/useAuth';
import { LearningService } from '@/src/services/learning.service';
import {
  LessonDetailResponse,
  LessonExampleItem,
  LessonGrammarDetailItem,
  LessonReadingDetailItem,
  LessonVocabularyDetailItem,
} from '@/src/types/learning';
import { JLPTLevel } from '@/src/types/room';

const previewLesson: LessonDetailResponse = {
  id: 'preview-lesson',
  slug: 'lesson-3-basic-particles',
  title: 'Basic Particles',
  description: 'Learn the fundamentals of topic and object markers in Japanese sentences.',
  order: 3,
  sourceLevel: JLPTLevel.N5,
  hasQuiz: true,
  chapterId: 'preview-chapter',
  chapterTitle: 'Greetings & Introductions',
  chapterOrder: 1,
  levelId: 'n5',
  levelCode: JLPTLevel.N5,
  levelName: 'JLPT N5',
  vocabulary: [
    {
      id: 'watashi',
      sortOrder: 1,
      term: '私',
      reading: 'わたし',
      note: 'watashi',
      isCommon: true,
      meanings: [{ glosses: ['I, me'] }],
      examples: [{ ja: '私は学生です。', en: 'I am a student.', romaji: 'Watashi wa gakusei desu.' }],
    },
    {
      id: 'gakusei',
      sortOrder: 2,
      term: '学生',
      reading: 'がくせい',
      note: 'gakusei',
      isCommon: true,
      meanings: [{ glosses: ['Student'] }],
      examples: [{ ja: '彼は学生です。', en: 'He is a student.', romaji: 'Kare wa gakusei desu.' }],
    },
  ],
  grammar: [
    {
      id: 'wa-desu',
      sortOrder: 1,
      grammarPoint: '〜は〜です',
      meaningEn: 'A is B',
      explanation: 'Use は to mark the topic, then です to finish a polite statement.',
      examples: [{ ja: '私は学生です。', en: 'I am a student.' }],
    },
  ],
  reading: [
    {
      id: 'intro-reading',
      sortOrder: 1,
      title: 'A Short Introduction',
      content: '私は学生です。日本語を勉強します。',
      translation: 'I am a student. I study Japanese.',
    },
  ],
};

export default function LessonDetailPage() {
  const { isAuthenticated, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('vocabulary');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [savingAction, setSavingAction] = useState<'save' | 'complete' | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    const loadLesson = async () => {
      setLoadingLesson(true);
      setLessonError(null);

      try {
        const response = await LearningService.getLessonBySlug(slug);
        if (!cancelled) {
          setLesson(response);
        }
      } catch (error) {
        if (!cancelled) {
          if (slug.startsWith('lesson-')) {
            setLesson(previewLesson);
          } else {
            setLessonError(error instanceof Error ? error.message : 'Failed to load lesson');
          }
        }
      } finally {
        if (!cancelled) {
          setLoadingLesson(false);
        }
      }
    };

    void loadLesson();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const updateSectionFromHash = () => {
      const nextSection = window.location.hash.replace('#', '');
      if (['vocabulary', 'grammar', 'reading', 'quiz'].includes(nextSection)) {
        setActiveSection(nextSection);
      }
    };

    updateSectionFromHash();
    window.addEventListener('hashchange', updateSectionFromHash);

    return () => window.removeEventListener('hashchange', updateSectionFromHash);
  }, []);

  useEffect(() => {
    if (!lesson || lesson.id === previewLesson.id) {
      return;
    }

    void LearningService.startLesson(slug).catch(() => undefined);
  }, [lesson, slug]);

  const lessonProgressPercent = getSectionProgress(activeSection);

  const showActionMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(null), 2600);
  };

  const handleSaveProgress = async () => {
    setSavingAction('save');

    try {
      await LearningService.updateLessonProgress(slug, {
        lessonProgressPercent,
        section: activeSection,
        vocabularyProgress: activeSection === 'vocabulary' ? lessonProgressPercent : undefined,
        grammarProgress: activeSection === 'grammar' ? lessonProgressPercent : undefined,
        readingProgress: activeSection === 'reading' ? lessonProgressPercent : undefined,
      });
      showActionMessage('Đã lưu tiến trình bài học.');
    } catch (error) {
      showActionMessage(error instanceof Error ? error.message : 'Không thể lưu tiến trình.');
    } finally {
      setSavingAction(null);
    }
  };

  const handleCompleteLesson = async () => {
    setSavingAction('complete');

    try {
      await LearningService.completeLesson(slug, {
        lessonProgressPercent: 100,
        chapterProgressPercent: 100,
        vocabularyProgress: 100,
        grammarProgress: 100,
        readingProgress: 100,
        section: 'complete',
      });
      showActionMessage('Đã đánh dấu hoàn thành bài học.');
    } catch (error) {
      showActionMessage(error instanceof Error ? error.message : 'Không thể hoàn thành bài học.');
    } finally {
      setSavingAction(null);
    }
  };

  if (loading || !isAuthenticated || loadingLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] text-[#665744]">
        Preparing lesson...
      </div>
    );
  }

  if (!lesson || lessonError) {
    return (
      <div className="min-h-screen bg-[#fff8f4] px-6 py-10">
        <div className="mx-auto max-w-[960px]">
          <button
            type="button"
            onClick={() => router.push('/adventure')}
            className="mb-6 flex items-center gap-2 rounded-full border border-[#d7c3ae] bg-white px-5 py-3 font-bold text-[#3d2a17]"
          >
            <IconArrowLeft size={18} /> Back to Adventure
          </button>
          <div className="rounded-xl border border-[#ffdad6] bg-white p-8 text-[#93000a]">
            <h1 className="torisho-display text-3xl font-bold">Unable to open this lesson</h1>
            <p className="mt-3">{lessonError ?? 'The lesson could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f4] pb-32 text-[#211a12]">
      <header className="sticky top-0 z-30 border-b border-[#d7c3ae] bg-[#fff8f4]/95 shadow-sm backdrop-blur">
        {isHeaderExpanded ? (
          <div className="mx-auto max-w-[1420px] px-6 py-5 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-base text-[#3d2a17]">
                <button
                  type="button"
                  aria-label="Back to adventure"
                  onClick={() => router.push('/adventure')}
                  className="mr-2 rounded-full p-2 transition-colors hover:bg-[#fff1e4]"
                >
                  <IconArrowLeft size={22} />
                </button>
                <span>{lesson.chapterTitle}</span>
                <IconChevronRight size={17} />
                <span>{lesson.levelCode}</span>
                <IconChevronRight size={17} />
                <span>Chapter {lesson.chapterOrder}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsHeaderExpanded(false)}
                className="rounded-full border border-[#d7c3ae] bg-white px-4 py-2 text-sm font-bold text-[#835500] transition-colors hover:bg-[#fff1e4]"
              >
                Hide header
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#00796b] px-4 py-1 text-sm font-extrabold text-white">
                JLPT {lesson.levelCode}
              </span>
              {lesson.hasQuiz && (
                <span className="flex items-center gap-2 rounded-full bg-[#62fae3] px-4 py-1 text-sm font-extrabold text-[#00201c]">
                  <IconCircleCheck size={17} /> Quiz available
                </span>
              )}
            </div>

            <h1 className="torisho-display mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Lesson {lesson.order}: {lesson.title}
            </h1>
            {lesson.description && (
              <p className="mt-2 max-w-4xl text-lg text-[#3d2a17]">{lesson.description}</p>
            )}

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#eee0d2]">
              <div
                className="h-full rounded-full bg-[#f5a623]"
                style={{ width: `${lessonProgressPercent}%` }}
              />
            </div>

            <LessonTabs activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        ) : (
          <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-4 px-6 py-3 lg:px-10">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#835500]">
                JLPT {lesson.levelCode} · Chapter {lesson.chapterOrder}
              </p>
              <h1 className="truncate text-lg font-bold text-[#211a12]">
                Lesson {lesson.order}: {lesson.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsHeaderExpanded(true)}
              className="shrink-0 rounded-full border border-[#d7c3ae] bg-white px-4 py-2 text-sm font-bold text-[#835500] transition-colors hover:bg-[#fff1e4]"
            >
              Show header
            </button>
          </div>
        )}
      </header>

      {actionMessage && (
        <div className="fixed right-6 top-24 z-50 rounded-xl border border-[#d7c3ae] bg-white px-5 py-4 font-bold text-[#3d2a17] shadow-[0_16px_38px_rgba(26,20,16,0.12)]">
          {actionMessage}
        </div>
      )}

      <div className="mx-auto max-w-[1420px] space-y-8 px-6 py-10 lg:px-10">
        <section id="vocabulary" className="scroll-mt-36 space-y-8">
          {lesson.vocabulary.map((item) => (
            <VocabularyCard key={item.id} item={item} />
          ))}
        </section>

        <section id="grammar" className="scroll-mt-36 border-t border-[#d7c3ae] pt-9">
          <h2 className="torisho-display text-3xl font-bold">Grammar</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {lesson.grammar.length ? (
              lesson.grammar.map((item) => <GrammarCard key={item.id} item={item} />)
            ) : (
              <p className="rounded-xl border border-[#d7c3ae] bg-white p-6 text-[#665744]">
                Grammar notes will appear here for this lesson.
              </p>
            )}
          </div>
        </section>

        <section id="reading" className="scroll-mt-36 border-t border-[#d7c3ae] pt-9">
          <h2 className="torisho-display text-3xl font-bold">Reading</h2>
          <div className="mt-5 space-y-5">
            {lesson.reading.length ? (
              lesson.reading.map((item) => <ReadingCard key={item.id} item={item} />)
            ) : (
              <p className="rounded-xl border border-[#d7c3ae] bg-white p-6 text-[#665744]">
                Reading practice will appear here for this lesson.
              </p>
            )}
          </div>
        </section>

        <section id="quiz" className="scroll-mt-36 border-t border-[#d7c3ae] pt-9">
          <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#835500]">
                  Lesson quiz
                </p>
                <h2 className="torisho-display mt-2 text-3xl font-bold">
                  Check what you remember from this lesson
                </h2>
                <p className="mt-3 text-lg text-[#665744]">
                  Questions are loaded from the backend quiz prepared for this lesson.
                </p>
              </div>
              {lesson.hasQuiz && lesson.id !== previewLesson.id ? (
                <button
                  type="button"
                  onClick={() => router.push(`/quiz/lesson/${lesson.id}`)}
                  className="flex h-14 shrink-0 items-center justify-center rounded-full bg-[#f5a623] px-8 text-lg font-bold text-[#291800] transition-colors hover:bg-[#ffb955]"
                >
                  Start Quiz
                </button>
              ) : (
                <span className="rounded-full border border-[#d7c3ae] bg-[#fff1e4] px-6 py-3 font-bold text-[#665744]">
                  Quiz not available
                </span>
              )}
            </div>
          </div>
        </section>
      </div>

      <footer className="fixed bottom-6 right-6 z-40">
        <div className="flex items-center gap-3 rounded-full border border-[#d7c3ae] bg-white/95 p-2 shadow-[0_16px_38px_rgba(26,20,16,0.12)] backdrop-blur">
          <span className="hidden items-center gap-2 px-3 text-sm font-bold text-[#3d2a17] md:flex">
            <IconBook2 size={18} /> {activeSection}
          </span>
          <button
            type="button"
            onClick={handleSaveProgress}
            disabled={savingAction !== null}
            className="h-11 rounded-full border border-[#d7c3ae] px-5 text-sm font-bold text-[#3d2a17] transition-colors hover:bg-[#fff1e4] disabled:opacity-60"
          >
            {savingAction === 'save' ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleCompleteLesson}
            disabled={savingAction !== null}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f5a623] px-5 text-sm font-bold text-[#291800] transition-colors hover:bg-[#ffb955] disabled:opacity-60"
          >
            {savingAction === 'complete' ? 'Completing...' : 'Complete'} <IconCheck size={18} />
          </button>
        </div>
      </footer>
    </main>
  );
}

function LessonTabs({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const tabs = ['vocabulary', 'grammar', 'reading', 'quiz'];

  return (
    <nav className="mt-5 flex gap-7 overflow-x-auto text-lg">
      {tabs.map((tab) => (
        <a
          key={tab}
          href={`#${tab}`}
          onClick={() => setActiveSection(tab)}
          className={`border-b-2 pb-3 font-medium capitalize no-underline ${
            activeSection === tab
              ? 'border-[#f5a623] text-[#835500]'
              : 'border-transparent text-[#3d2a17] hover:border-[#d7c3ae]'
          }`}
        >
          {tab}
        </a>
      ))}
    </nav>
  );
}

function getSectionProgress(section: string) {
  switch (section) {
    case 'grammar':
      return 55;
    case 'reading':
      return 75;
    case 'quiz':
      return 90;
    case 'complete':
      return 100;
    default:
      return 35;
  }
}

function VocabularyCard({ item }: { item: LessonVocabularyDetailItem }) {
  const meaning = getMeaningText(item.meanings);
  const example = getExample(item.examples);

  return (
    <article className="rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_12px_32px_rgba(26,20,16,0.05)] md:p-10">
      <div className="grid gap-8 md:grid-cols-[340px_1fr] md:gap-12">
        <div className="flex flex-col justify-center border-[#eee0d2] md:border-r md:pr-12">
          {item.note && <div className="text-lg text-[#3d2a17]">{item.note}</div>}
          <div className="torisho-jp mt-3 text-7xl font-bold leading-none">{item.term}</div>
          <div className="torisho-jp mt-4 text-xl text-[#3d2a17]">{item.reading}</div>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="torisho-display text-3xl font-bold">{meaning}</h2>
            <div className="flex gap-2">
              {item.isCommon && <Badge tone="warm">Common</Badge>}
              <Badge tone="cool">N5</Badge>
            </div>
          </div>

          <div className="mt-7 rounded-lg border border-[#d7c3ae] bg-[#fff1e4] p-6">
            <p className="torisho-jp text-2xl">
              {renderJapaneseExample(example.ja, item.term)}
            </p>
            <p className="mt-3 text-lg text-[#3d2a17]">
              {getRomajiExample(example, item.note, item.reading)}
            </p>
            <p className="mt-4 border-t border-[#d7c3ae] pt-4 text-xl">{example.en || `Example for ${meaning}.`}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="flex h-12 items-center gap-3 rounded-full border border-[#d7c3ae] px-6 text-lg text-[#3d2a17] transition-colors hover:bg-[#fff1e4]">
              <IconBookmarkPlus size={21} /> Save to Flashcard
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function GrammarCard({ item }: { item: LessonGrammarDetailItem }) {
  return (
    <article className="rounded-xl border border-[#d7c3ae] bg-white p-6">
      <div className="torisho-jp rounded-lg border-l-4 border-[#f5a623] bg-[#fff1e4] p-4 text-3xl">
        {item.grammarPoint}
      </div>
      <h3 className="torisho-display mt-5 text-2xl font-bold">{item.meaningEn}</h3>
      {item.explanation && <p className="mt-3 text-lg leading-8 text-[#3d2a17]">{item.explanation}</p>}
    </article>
  );
}

function ReadingCard({ item }: { item: LessonReadingDetailItem }) {
  return (
    <article className="rounded-xl border border-[#d7c3ae] bg-white p-6">
      <h3 className="torisho-display text-2xl font-bold">{item.title}</h3>
      <p className="torisho-jp mt-4 text-2xl leading-10">{item.content}</p>
      {item.translation && <p className="mt-4 border-t border-[#eee0d2] pt-4 text-lg text-[#3d2a17]">{item.translation}</p>}
    </article>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'warm' | 'cool' }) {
  return (
    <span
      className={`rounded-full border px-4 py-2 text-sm ${
        tone === 'warm'
          ? 'border-[#d7c3ae] bg-[#fff1e4] text-[#3d2a17]'
          : 'border-[#b5dddd] bg-[#e8f7f3] text-[#005047]'
      }`}
    >
      {children}
    </span>
  );
}

function parseUnknown(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function getMeaningText(value: unknown): string {
  const parsed = parseUnknown(value);

  if (typeof parsed === 'string') {
    return parsed;
  }

  if (Array.isArray(parsed)) {
    const first = parsed[0] as { glosses?: unknown; meaning?: unknown } | string | undefined;

    if (typeof first === 'string') {
      return first;
    }

    if (Array.isArray(first?.glosses)) {
      return first.glosses.filter((part): part is string => typeof part === 'string').join(', ');
    }

    if (typeof first?.meaning === 'string') {
      return first.meaning;
    }
  }

  if (parsed && typeof parsed === 'object' && 'glosses' in parsed) {
    const glosses = (parsed as { glosses?: unknown }).glosses;
    if (Array.isArray(glosses)) {
      return glosses.filter((part): part is string => typeof part === 'string').join(', ');
    }
  }

  return 'Meaning';
}

function getExample(value: unknown): LessonExampleItem {
  const parsed = parseUnknown(value);

  if (Array.isArray(parsed)) {
    const first = parsed[0];
    if (first && typeof first === 'object') {
      return first as LessonExampleItem;
    }
  }

  if (parsed && typeof parsed === 'object') {
    return parsed as LessonExampleItem;
  }

  return {};
}

function renderJapaneseExample(sentence: string | undefined, term: string) {
  const text = sentence || `${term}は学生です。`;
  const parts = text.split(term);

  if (parts.length === 1) {
    return text;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 && <span className="font-bold text-[#f5a623]">{term}</span>}
          {part}
        </span>
      ))}
    </>
  );
}

function getRomajiExample(
  example: LessonExampleItem,
  note: string | null | undefined,
  reading: string
) {
  const romaji = example.romaji;

  if (typeof romaji === 'string') {
    return romaji;
  }

  return note && /^[a-zA-Z\s-]+$/.test(note) ? note : reading;
}
