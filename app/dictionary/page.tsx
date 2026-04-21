// app/dictionary/page.tsx  ← Search Results Page
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Noto_Sans_JP } from 'next/font/google';
import DashboardHeader from '../../src/components/DashboardHeader';
import { dictionaryService } from '../../src/services/dictionary.service';
import { WordSearchResult } from '../../src/types/dictionary';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

// ─── Word Card (search result item) ────────────────────────────────────────
function WordResultCard({ word, keyword }: { word: WordSearchResult; keyword: string }) {
  const detailHref = keyword
    ? `/dictionary/${word.id}?keyword=${encodeURIComponent(keyword)}`
    : `/dictionary/${word.id}`;

  return (
    <Link
      href={detailHref}
      className="group flex w-full items-stretch gap-5 rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
    >
      {/* Left: Kanji + reading */}
      <div className="flex min-w-[80px] flex-col justify-center gap-0.5">
        <span
          className={`${notoSansJp.className} text-3xl font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-blue-700`}
        >
          {word.kanji ?? word.kana}
        </span>
        {word.kanji && (
          <span className={`${notoSansJp.className} text-sm text-slate-400`}>
            {word.matchedReading ?? word.kana}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-slate-100" />

      {/* Right: Tags + meanings */}
      <div className="flex flex-1 flex-col justify-center gap-2">
        {word.isCommon && (
          <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Common
          </span>
        )}
        <p className="text-sm font-medium text-slate-700">
          {word.primaryMeaning}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex items-center self-center text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function SearchSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-stretch gap-5 rounded-2xl border border-slate-100 bg-white px-6 py-5">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-16 rounded-lg bg-slate-200" />
            <div className="h-3.5 w-12 rounded bg-slate-100" />
          </div>
          <div className="w-px self-stretch bg-slate-100" />
          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="h-3 w-14 rounded-full bg-slate-100" />
            <div className="h-4 w-48 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
function DictionarySearchPageContent() {
  const searchParams = useSearchParams();
  const keyword = useMemo(() => searchParams.get('keyword')?.trim() ?? '', [searchParams]);

  const [results, setResults] = useState<WordSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!keyword) {
        setResults([]);
        setErrorMessage(null);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const words = await dictionaryService.search(keyword);
        if (active) setResults(words);
      } catch (err) {
        if (active) {
          setResults([]);
          setErrorMessage(err instanceof Error ? err.message : 'Unable to search right now.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, [keyword]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <DashboardHeader />

      <main className="w-full pb-16 pt-8">
        <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-[1040px]">
            {/* ── Centered narrow container ── */}
            <div className="flex w-full justify-center">
              <div className="w-full max-w-2xl">

                {/* Heading */}
                <div className="mb-6">
                  
                  
                  {keyword ? (
                    <h1 className="mt-1 text-2xl font-bold text-slate-800">
                      Results for{' '}
                      <span className="text-blue-600">&ldquo;{keyword}&rdquo;</span>
                    </h1>
                  ) : (
                    <h1 className="mt-1 text-2xl font-bold text-slate-800">
                      Search Japanese words
                    </h1>
                  )}

                  {errorMessage && (
                    <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
                      {errorMessage}
                    </p>
                  )}
                </div>

                {/* Content */}
                {!keyword ? (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
                    <p className="text-5xl leading-none">( ^_^ )</p>
                    <p className="mt-5 text-lg font-semibold text-slate-700">Enter a keyword to start</p>
                    <p className="mt-1.5 text-sm text-slate-400">Try: 標準, ひょうじゅん, standard</p>
                  </div>
                ) : isLoading ? (
                  <SearchSkeleton />
                ) : results.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
                    <p className="text-4xl leading-none">(o_o)</p>
                    <p className="mt-4 text-base font-semibold text-slate-700">No words found</p>
                    <p className="mt-1 text-sm text-slate-400">Try a different keyword or shorter phrase.</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      {results.length} {results.length === 1 ? 'word' : 'words'} found
                    </p>
                    <div className="space-y-3">
                      {results.map((word) => (
                        <WordResultCard key={word.id} word={word} keyword={keyword} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DictionarySearchPageFallback() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <DashboardHeader />

      <main className="w-full pb-16 pt-8">
        <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-[1040px]">
            <div className="flex w-full justify-center">
              <div className="w-full max-w-2xl">
                <SearchSkeleton />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DictionarySearchPage() {
  return (
    <Suspense fallback={<DictionarySearchPageFallback />}>
      <DictionarySearchPageContent />
    </Suspense>
  );
}