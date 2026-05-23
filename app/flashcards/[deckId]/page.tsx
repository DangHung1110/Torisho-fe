'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconEye,
  IconLoader2,
  IconRotateClockwise,
  IconSettings,
} from '@tabler/icons-react';
import { useAuth } from '@/src/libs/useAuth';
import { FlashcardService } from '@/src/services/flashcard.service';
import { FlashcardDeck, FlashcardItem } from '@/src/types/flashcard';

export default function FlashcardStudyPage() {
  const router = useRouter();
  const params = useParams<{ deckId: string | string[] }>();
  const { isAuthenticated, loading } = useAuth();
  const rawDeckId = params?.deckId;
  const deckId = Array.isArray(rawDeckId) ? rawDeckId[0] : rawDeckId;

  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [items, setItems] = useState<FlashcardItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDeck = useCallback(async () => {
    if (!deckId) {
      setErrorMessage('Invalid deck id.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [deckResult, itemResult] = await Promise.all([
        FlashcardService.getDeck(deckId),
        FlashcardService.getDeckItems(deckId),
      ]);
      setDeck(deckResult);
      setItems([...itemResult].sort((a, b) => a.position - b.position));
      setIndex(0);
      setIsRevealed(false);
      setIsComplete(false);
    } catch (error) {
      setDeck(null);
      setItems([]);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load flashcard deck.');
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      void loadDeck();
    }
  }, [isAuthenticated, loadDeck]);

  const currentItem = items[index] ?? null;
  const progress = items.length > 0 ? ((index + 1) / items.length) * 100 : 0;

  const stats = useMemo(() => {
    return {
      total: items.length,
      current: Math.min(index + 1, items.length),
    };
  }, [index, items.length]);

  const handleRating = () => {
    if (index >= items.length - 1) {
      setIsComplete(true);
      return;
    }

    setIndex((current) => current + 1);
    setIsRevealed(false);
  };

  if (loading || isLoading) {
    return (
      <StudyShell progress={0}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <IconLoader2 className="animate-spin text-[#835500]" size={36} />
        </div>
      </StudyShell>
    );
  }

  if (errorMessage) {
    return (
      <StudyShell progress={0}>
        <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
          <p className="rounded-xl border border-[#ffdad6] bg-white px-6 py-5 text-[#93000a]">
            {errorMessage}
          </p>
          <Link
            href="/flashcards"
            className="mt-5 rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] no-underline"
          >
            Back to Decks
          </Link>
        </div>
      </StudyShell>
    );
  }

  if (!currentItem) {
    return (
      <StudyShell progress={0} title={deck?.name}>
        <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
          <div className="rounded-xl border border-[#d7c3ae] bg-white p-8 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <h1 className="torisho-display text-4xl font-bold">No cards yet</h1>
            <p className="mt-3 text-[#665744]">
              Add words from the dictionary to start studying this deck.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/dictionary"
                className="rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] no-underline"
              >
                Open Dictionary
              </Link>
              <Link
                href="/flashcards"
                className="rounded-full border border-[#d7c3ae] px-7 py-3 font-bold text-[#3d2a17] no-underline"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </StudyShell>
    );
  }

  if (isComplete) {
    return (
      <StudyShell progress={100} title={deck?.name}>
        <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
          <div className="rounded-xl border border-[#d7c3ae] bg-white p-9 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <h1 className="torisho-display text-4xl font-bold">Session complete</h1>
            <p className="mt-3 text-lg text-[#665744]">
              You reviewed {items.length} card{items.length === 1 ? '' : 's'}.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4 rounded-xl border border-[#d7c3ae] bg-[#fff8f4] p-5">
              <div>
                <div className="torisho-display text-4xl font-bold text-[#835500]">{items.length}</div>
                <div className="text-sm font-bold uppercase tracking-[0.12em] text-[#665744]">Cards</div>
              </div>
              <div className="border-l border-[#d7c3ae]">
                <div className="torisho-display text-4xl font-bold text-[#007165]">Done</div>
                <div className="text-sm font-bold uppercase tracking-[0.12em] text-[#665744]">Status</div>
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIndex(0);
                  setIsRevealed(false);
                  setIsComplete(false);
                }}
                className="rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800]"
              >
                Study Again
              </button>
              <Link
                href="/flashcards"
                className="rounded-full border border-[#d7c3ae] px-7 py-3 font-bold text-[#3d2a17] no-underline"
              >
                Back to Deck
              </Link>
            </div>
          </div>
        </div>
      </StudyShell>
    );
  }

  return (
    <StudyShell progress={progress} title={`Card ${stats.current} of ${stats.total}`}>
      <main className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1200px] flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-3xl">
          <button
            type="button"
            onClick={() => setIsRevealed((current) => !current)}
            className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-xl border border-[#d7c3ae] bg-white p-10 text-center shadow-[0_18px_40px_rgba(26,20,16,0.06)] transition hover:-translate-y-0.5"
          >
            {!isRevealed ? (
              <>
                <div className="torisho-jp text-6xl font-bold text-[#211a12]">{currentItem.front}</div>
                <div className="mt-auto flex flex-col items-center text-[#857462]">
                  <IconRotateClockwise size={25} />
                  <span className="mt-2">Tap to reveal</span>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                {formatBack(currentItem.back).map((line, lineIndex) => (
                  <p
                    key={`${line}-${lineIndex}`}
                    className={lineIndex === 0 ? 'torisho-jp text-4xl text-[#835500]' : 'text-2xl text-[#211a12]'}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </button>

          <div className="mx-auto mt-9 w-full max-w-xl">
            {!isRevealed ? (
              <button
                type="button"
                onClick={() => setIsRevealed(true)}
                className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#f5a623] text-lg font-bold text-[#291800] shadow-[0_10px_28px_rgba(26,20,16,0.06)] transition hover:bg-[#ffb955]"
              >
                <IconEye size={22} /> Show Answer
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleRating}
                  className="h-14 rounded-full border border-[#ba1a1a] font-bold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                >
                  Again
                </button>
                <button
                  type="button"
                  onClick={handleRating}
                  className="h-14 rounded-full border border-[#857462] font-bold text-[#3d2a17] transition hover:bg-[#eee0d2]"
                >
                  Good
                </button>
                <button
                  type="button"
                  onClick={handleRating}
                  className="h-14 rounded-full border border-[#007165] font-bold text-[#007165] transition hover:bg-[#62fae3]/25"
                >
                  Easy
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </StudyShell>
  );
}

function StudyShell({
  children,
  progress,
  title = 'Flashcard',
}: {
  children: React.ReactNode;
  progress: number;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-[#fff8f4] text-[#211a12]">
      <header className="sticky top-0 z-40 flex h-20 items-center border-b border-[#d7c3ae] bg-white">
        <Link
          href="/flashcards"
          className="absolute left-5 flex items-center gap-2 text-lg text-[#3d2a17] no-underline hover:text-[#835500] md:left-9"
        >
          <IconArrowLeft size={22} /> Back to Deck
        </Link>
        <h1 className="torisho-display mx-auto px-32 text-center text-3xl font-bold leading-tight">
          {title}
        </h1>
        <button
          type="button"
          aria-label="Study settings"
          className="absolute right-5 rounded-full p-2 text-[#3d2a17] hover:bg-[#fff1e4] md:right-9"
        >
          <IconSettings size={26} />
        </button>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-[#eee0d2]">
          <div className="h-full bg-[#f5a623] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>
      {children}
    </div>
  );
}

function formatBack(value: string) {
  return value
    .replaceAll('<br/>', '\n')
    .replaceAll('<br />', '\n')
    .replaceAll('<br>', '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
