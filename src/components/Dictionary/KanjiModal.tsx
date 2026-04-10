'use client';

import { useEffect, useState } from 'react';
import { KanjiDetail } from '../../types/kanji';
import { kanjiService } from '../../services/kanji.service';
import Link from 'next/link';

interface KanjiModalProps {
  character: string | null;
  onClose: () => void;
}

export default function KanjiModal({ character, onClose }: KanjiModalProps) {
  const [data, setData] = useState<KanjiDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!character) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    kanjiService.get(character)
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load kanji.');
        setData(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => { active = false; };
  }, [character]);

  if (!character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 max-w-2xl w-full rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-slate-50 p-4 text-4xl font-black text-slate-800">{character}</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Kanji: {character}</h3>
              {loading ? (
                <p className="mt-1 text-sm text-slate-400">Loading…</p>
              ) : error ? (
                <p className="mt-1 text-sm text-rose-600">{error}</p>
              ) : data ? (
                <p className="mt-1 text-sm text-slate-500">{data.meanings.join(', ')}</p>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {loading && (
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-50" />
            </div>
          )}

          {data && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Readings</div>
                <div className="text-sm text-slate-700">Onyomi: {data.onyomi ?? '—'}</div>
                <div className="text-sm text-slate-700">Kunyomi: {data.kunyomi ?? '—'}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Info</div>
                <div className="text-sm text-slate-700">Strokes: {data.strokeCount ?? '—'}</div>
                <div className="text-sm text-slate-700">JLPT: {data.jlptLevel ?? '—'}</div>
              </div>

              <div className="col-span-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Meanings</div>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {data.meanings.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Related words</div>
                <div className="mt-2 grid gap-2">
                  {data.relatedWords.map((rw) => (
                    <Link
                      key={rw.dictionaryEntryId}
                      href={`/dictionary/${rw.dictionaryEntryId}`}
                      className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-white"
                      onClick={onClose}
                    >
                      <div className="flex items-center justify-between">
                        <div className="truncate font-medium">{rw.keyword}</div>
                        <div className="ml-3 text-sm text-slate-400">{rw.reading}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
