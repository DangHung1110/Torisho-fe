// app/dictionary/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardHeader from '../../src/components/DashboardHeader';
import SearchResultList from '../../src/components/Dictionary/SearchResultList';
import WordDetail from '../../src/components/Dictionary/WordDetail';
import { dictionaryService } from '../../src/services/dictionary.service';
import { WordDetail as WordDetailType, WordSearchResult } from '../../src/types/dictionary';

export default function DictionaryPage() {
  const searchParams = useSearchParams();
  const keyword = useMemo(() => searchParams.get('keyword')?.trim() ?? '', [searchParams]);

  const [results, setResults] = useState<WordSearchResult[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordSearchResult | null>(null);
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordDetailType | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, WordDetailType>>({});

  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSearchResults() {
      if (!keyword) {
        setResults([]);
        setSelectedWord(null);
        setSelectedWordDetail(null);
        setErrorMessage(null);
        return;
      }

      setIsSearching(true);
      setErrorMessage(null);

      try {
        const words = await dictionaryService.search(keyword);
        if (!active) {
          return;
        }

        setResults(words);
        setSelectedWord(words[0] ?? null);
      } catch (error) {
        if (!active) {
          return;
        }

        setResults([]);
        setSelectedWord(null);
        setSelectedWordDetail(null);
        setErrorMessage(error instanceof Error ? error.message : 'Unable to search dictionary right now.');
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }

    void loadSearchResults();

    return () => {
      active = false;
    };
  }, [keyword]);

  useEffect(() => {
    let active = true;

    async function loadWordDetail() {
      if (!selectedWord) {
        setSelectedWordDetail(null);
        return;
      }

      const cachedWord = detailCache[selectedWord.id];
      if (cachedWord) {
        setSelectedWordDetail(cachedWord);
        return;
      }

      setIsLoadingDetail(true);
      setErrorMessage(null);

      try {
        const detail = await dictionaryService.getDetail(selectedWord.id);
        if (!active) {
          return;
        }

        setDetailCache((previous) => ({
          ...previous,
          [detail.id]: detail,
        }));
        setSelectedWordDetail(detail);
      } catch (error) {
        if (!active) {
          return;
        }

        setSelectedWordDetail(null);
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load word detail right now.');
      } finally {
        if (active) {
          setIsLoadingDetail(false);
        }
      }
    }

    void loadWordDetail();

    return () => {
      active = false;
    };
  }, [selectedWord, detailCache]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-8 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dictionary Search</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            {keyword ? `Results for "${keyword}"` : 'Search Japanese words'}
          </h1>
          {errorMessage ? <p className="mt-2 text-sm text-rose-600">{errorMessage}</p> : null}
        </div>

        {!keyword ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
            <div>
              <p className="text-4xl">( ^_^ )</p>
              <p className="mt-4 text-lg font-semibold text-slate-700">Enter a keyword to start searching</p>
              <p className="mt-1 text-sm text-slate-500">Example: standard, 標準, ひょうじゅん</p>
            </div>
          </div>
        ) : (
          <section className="grid min-h-[72vh] gap-8 md:grid-cols-3 md:gap-8">
            <aside className="flex min-h-0 flex-col rounded-3xl bg-white shadow-sm md:col-span-1">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-700">
                  Search Results <span className="text-slate-400">({results.length})</span>
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <SearchResultList
                  results={results}
                  selectedWordId={selectedWord?.id ?? null}
                  isLoading={isSearching}
                  onSelect={setSelectedWord}
                />
              </div>
            </aside>

            <section className="min-h-0 overflow-y-auto rounded-3xl bg-white p-5 shadow-sm sm:p-6 md:col-span-2">
              <WordDetail wordDetail={selectedWordDetail} isLoading={isLoadingDetail || isSearching} />
            </section>
          </section>
        )}
      </main>
    </div>
  );
}
