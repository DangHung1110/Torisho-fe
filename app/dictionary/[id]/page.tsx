// app/dictionary/[id]/page.tsx  ← Word Detail Page
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Noto_Sans_JP } from 'next/font/google';
import { useParams, useSearchParams } from 'next/navigation';
import DashboardHeader from '../../../src/components/DashboardHeader';
import { dictionaryService } from '../../../src/services/dictionary.service';
import { WordDetail } from '../../../src/types/dictionary';
import { POS_MAP } from '../../../src/constants/pos_map';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

function getPosLabel(pos: string) {
  return POS_MAP[pos] ?? pos;
}

// ─── Left panel: Word card ──────────────────────────────────────────────────
function WordCard({ word }: { word: WordDetail }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Blue flash card */}
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-b from-blue-400 to-blue-500 px-8 py-10 text-center shadow-md">
        {/* Furigana */}
        {word.kanji && (
          <p className={`${notoSansJp.className} text-base font-medium tracking-[0.3em] text-blue-100`}>
            {word.kana}
          </p>
        )}
        {/* Kanji */}
        <p className={`${notoSansJp.className} text-6xl font-black leading-none text-white drop-shadow-sm`}>
          {word.kanji ?? word.kana}
        </p>
        {/* Primary meaning */}
        <p className="mt-1 text-xl font-bold capitalize text-white/90">
          {word.senses?.[0]?.glosses?.[0] ?? ''}
        </p>
      </div>

      
      {/* Is common */}
      {word.isCommon && (
        <div className="w-full">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Common Word
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex w-full gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="mx-auto grid w-full animate-pulse gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div>
        <div className="h-64 rounded-3xl bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-10 w-36 rounded-xl bg-slate-200" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="rounded-2xl bg-slate-100 p-5">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-4 space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3.5 w-full rounded bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="h-3 w-28 rounded bg-slate-200" />
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-100 p-5">
            <div className="h-5 w-3/4 rounded bg-slate-200" />
            <div className="mt-2 h-3.5 w-1/2 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function WordDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const searchParams = useSearchParams();
  const rawWordId = params?.id;
  const wordId = Array.isArray(rawWordId) ? rawWordId[0] : rawWordId;
  const keyword = searchParams.get('keyword')?.trim() ?? '';
  const backHref = keyword ? `/dictionary?keyword=${encodeURIComponent(keyword)}` : '/dictionary';

  const [word, setWord] = useState<WordDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!wordId) {
      setWord(null);
      setError('Invalid word id.');
      setIsLoading(false);
      return () => { active = false; };
    }

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const detail = await dictionaryService.getDetail(wordId);
        if (active) setWord(detail);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load word.');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, [wordId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <DashboardHeader />

      <main className="w-full pb-16 pt-8">
        <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-[1040px]">
            {/* ── Centered container ── */}
            <div className="flex w-full justify-center">
              <div className="w-full max-w-3xl">

                {/* Back link */}
                <Link
                  href={backHref}
                  className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-700"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Back to results
                </Link>

                {isLoading ? (
                  <DetailSkeleton />
                ) : error ? (
                  <div className="rounded-2xl bg-rose-50 p-6 text-center text-sm text-rose-600">{error}</div>
                ) : !word ? null : (
                  <div className="mx-auto grid w-full gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">

                    {/* ── Left: Word Card ── */}
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                      <WordCard word={word} />
                    </aside>

                  {/* ── Right: Detail ── */}
                  <div className="space-y-8">

              {/* Definitions */}
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Definitions
                </p>
                <div className="space-y-3">
                  {word.senses.map((sense, si) => (
                    <div
                      key={si}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {sense.partsOfSpeech.map((pos, pi) => (
                          <span
                            key={pi}
                            className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                          >
                            {getPosLabel(pos)}
                          </span>
                        ))}
                      </div>
                      <ol className="space-y-2">
                        {sense.glosses.map((gloss, gi) => (
                          <li key={gi} className="flex items-baseline gap-3 text-sm text-slate-700">
                            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-bold text-slate-400">
                              {gi + 1}
                            </span>
                            {gloss}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </section>

              {/* Example sentences */}
              {word.examples.length > 0 && (
                <section>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Example sentences
                  </p>
                  <div className="space-y-3">
                    {word.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                      >
                        <p className={`${notoSansJp.className} text-lg font-medium leading-relaxed text-slate-800`}>
                          {ex.japanese}
                        </p>
                        <p className="mt-2 text-sm italic text-slate-400">{ex.english}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}