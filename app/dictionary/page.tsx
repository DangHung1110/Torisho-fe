'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  IconAdjustmentsHorizontal,
  IconArrowRight,
  IconSearch,
} from '@tabler/icons-react';
import LearningShell from '@/src/components/LearningShell';
import KanjiHandwritingPanel from '@/src/components/Dictionary/KanjiHandwritingPanel';
import { dictionaryService } from '@/src/services/dictionary.service';
import { WordSearchResult } from '@/src/types/dictionary';

function DictionaryPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlKeyword = useMemo(() => searchParams.get('keyword')?.trim() ?? '', [searchParams]);
  const [query, setQuery] = useState(urlKeyword);
  const [debouncedQuery, setDebouncedQuery] = useState(urlKeyword);
  const [results, setResults] = useState<WordSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHandwritingOpen, setIsHandwritingOpen] = useState(true);

  useEffect(() => {
    setQuery(urlKeyword);
    setDebouncedQuery(urlKeyword);
  }, [urlKeyword]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const nextUrl = debouncedQuery
      ? `${pathname}?keyword=${encodeURIComponent(debouncedQuery)}`
      : pathname;

    if (debouncedQuery !== urlKeyword) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [debouncedQuery, pathname, router, urlKeyword]);

  useEffect(() => {
    let active = true;

    const search = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const words = await dictionaryService.search(debouncedQuery);
        if (active) {
          setResults(words);
        }
      } catch (error) {
        if (active) {
          setResults([]);
          setErrorMessage(error instanceof Error ? error.message : 'Unable to search dictionary.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void search();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const handleCandidateSelect = (character: string) => {
    const trimmed = character.trim();
    if (!trimmed) return;
    setQuery((prev) => `${prev}${trimmed}`);
    setDebouncedQuery((prev) => `${prev}${trimmed}`);
    inputRef.current?.focus();
  };

  return (
    <LearningShell active="vocabulary">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1240px]">
          <header>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">
              Từ điển
            </p>
            <h1 className="torisho-display text-5xl font-bold leading-tight text-[#211a12] md:text-6xl">
              Dictionary
            </h1>
            <div className="relative mt-8 max-w-5xl">
              <IconSearch
                className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[#857462]"
                size={26}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-20 w-full rounded-full border border-[#d7c3ae] bg-[#fff8f4] pl-16 pr-6 text-xl text-[#211a12] shadow-[0_10px_28px_rgba(26,20,16,0.04)] outline-none transition-all placeholder:text-[#857462] focus:border-[#f5a623] focus:ring-4 focus:ring-[#f5a623]/20"
                placeholder="Search kanji, kana, romaji, or English... e.g. 食べる, taberu, eat"
                autoFocus
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsHandwritingOpen((prev) => !prev)}
                className="rounded-full border border-[#d7c3ae] bg-white px-5 py-2 text-sm font-extrabold tracking-[0.08em] text-[#835500] transition hover:border-[#f5a623]"
              >
                {isHandwritingOpen ? 'Hide handwriting' : 'Handwriting OCR'}
              </button>
              <span className="text-sm text-[#665744]">
                Draw a kanji and insert it into search.
              </span>
            </div>
          </header>

          {isHandwritingOpen && (
            <section className="mt-6">
              <KanjiHandwritingPanel
                onCandidateSelect={handleCandidateSelect}
                onClose={() => setIsHandwritingOpen(false)}
              />
            </section>
          )}

          {errorMessage && (
            <div className="mt-8 rounded-xl border border-[#ffdad6] bg-[#fff1ef] px-5 py-4 text-[#93000a]">
              {errorMessage}
            </div>
          )}

          <section className="mt-10">
            {!debouncedQuery ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d7c3ae] bg-white p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1e4] text-[#835500]">
                  <IconSearch size={38} />
                </div>
                <h2 className="torisho-display mt-6 text-3xl font-bold">Ready to explore?</h2>
                <p className="mt-3 max-w-lg text-lg text-[#665744]">
                  Start typing a word, reading, romaji, or meaning. Suggestions will update from the backend dictionary.
                </p>
              </div>
            ) : isLoading ? (
              <SearchSkeleton />
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d7c3ae] bg-white p-10 text-center">
                <h2 className="torisho-display text-3xl font-bold">No matching words</h2>
                <p className="mt-3 text-[#665744]">Try a shorter keyword or another reading.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#835500]">
                      Search suggestions
                    </p>
                    <h2 className="torisho-display mt-1 text-3xl font-bold">
                      {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{debouncedQuery}&rdquo;
                    </h2>
                  </div>
                </div>
                <div className="space-y-5">
                  {results.map((word) => (
                    <DictionaryResultCard key={word.id} word={word} keyword={debouncedQuery} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </LearningShell>
  );
}

function DictionaryResultCard({ word, keyword }: { word: WordSearchResult; keyword: string }) {
  const displayTerm = word.kanji || word.kana;
  const reading = word.kanji ? word.kana : word.matchedReading;

  return (
    <Link
      href={`/dictionary/${word.id}?keyword=${encodeURIComponent(keyword)}`}
      className="group flex flex-col gap-5 rounded-xl border border-[#d7c3ae] bg-white p-6 text-[#211a12] no-underline shadow-[0_10px_28px_rgba(26,20,16,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#f5a623] md:flex-row md:items-center md:justify-between md:p-8"
    >
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-10">
        <div className="torisho-jp min-w-36 text-5xl font-bold transition-colors group-hover:text-[#835500]">
          {highlight(displayTerm, keyword)}
        </div>
        <div>
          <p className="torisho-jp text-xl text-[#665744]">
            {reading ? highlight(reading, keyword) : null}
            {word.matchedReading && word.matchedReading !== reading ? ` • ${word.matchedReading}` : null}
          </p>
          <p className="mt-2 text-2xl font-bold">{highlight(word.primaryMeaning, keyword)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {word.isCommon && <Badge tone="warm">Common</Badge>}
        <Badge tone="cool">Dictionary</Badge>
        <IconArrowRight className="text-[#857462] transition-transform group-hover:translate-x-1 group-hover:text-[#835500]" />
      </div>
    </Link>
  );
}

function highlight(text: string, keyword: string) {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    return text;
  }

  const index = text.toLocaleLowerCase().indexOf(trimmedKeyword.toLocaleLowerCase());
  if (index < 0) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-[#ffddb4] px-1 text-[#633f00]">{text.slice(index, index + trimmedKeyword.length)}</mark>
      {text.slice(index + trimmedKeyword.length)}
    </>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'warm' | 'cool' }) {
  return (
    <span
      className={`rounded-full px-4 py-1 text-sm font-bold ${
        tone === 'warm' ? 'bg-[#f5a623] text-[#291800]' : 'bg-[#e8f7f3] text-[#005047]'
      }`}
    >
      {children}
    </span>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-xl border border-[#d7c3ae] bg-white shadow-[0_10px_28px_rgba(26,20,16,0.04)]"
        />
      ))}
    </div>
  );
}

function DictionaryPageFallback() {
  return (
    <LearningShell active="vocabulary">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1240px]">
          <SearchSkeleton />
        </div>
      </div>
    </LearningShell>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={<DictionaryPageFallback />}>
      <DictionaryPageContent />
    </Suspense>
  );
}
