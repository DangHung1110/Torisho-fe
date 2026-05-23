'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import HanziWriter from 'hanzi-writer';
import { RotateCcw, X } from 'lucide-react';
import { KanjiDetail } from '../../types/kanji';
import { kanjiService } from '../../services/kanji.service';

interface KanjiModalProps {
  character: string | null;
  onClose: () => void;
}

export default function KanjiModal({ character, onClose }: KanjiModalProps) {
  const [data, setData] = useState<KanjiDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  useEffect(() => {
    let active = true;

    if (!character) {
      return () => {
        active = false;
      };
    }

    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      setError(null);
      setData(null);
    });

    kanjiService
      .get(character)
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load kanji.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [character]);

  useEffect(() => {
    if (!data || !canvasRef.current || !character) return;

    canvasRef.current.innerHTML = '';
    writerRef.current = HanziWriter.create(canvasRef.current, character, {
      width: 160,
      height: 160,
      padding: 10,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 100,
      strokeColor: '#3d2a17',
      radicalColor: '#f5a623',
      charDataLoader: (char, onComplete) => {
        const encodedChar = encodeURIComponent(char);
        const jpUrl = `https://cdn.jsdelivr.net/npm/hanzi-writer-data-jp@0.0.1/${encodedChar}.json`;
        const cnUrl = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodedChar}.json`;

        void fetch(jpUrl)
          .then(async (res) => {
            if (res.ok) return res.json();

            const fallbackRes = await fetch(cnUrl);
            if (fallbackRes.ok) return fallbackRes.json();

            const jpReason = await res.text();
            const cnReason = await fallbackRes.text();
            throw new Error(
              `Failed to load stroke data. JP(${res.status}): ${jpReason}. CN(${fallbackRes.status}): ${cnReason}`,
            );
          })
          .then((charData) => {
            onComplete(charData);
          })
          .catch((err) => {
            console.warn('Error loading stroke data:', err);
          });
      },
    });

    const timer = window.setTimeout(() => {
      writerRef.current?.animateCharacter();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [data, character]);

  if (!character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close kanji details"
        className="absolute inset-0 cursor-default bg-[#211a12]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-xl border border-[#d7c3ae] bg-white shadow-[0_24px_60px_rgba(26,20,16,0.18)]">
        <div className="flex items-center justify-between border-b border-[#d7c3ae] bg-[#fff8f4] px-6 py-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#835500]">
              Kanji detail
            </p>
            <h2 className="torisho-display text-2xl font-bold text-[#211a12]">Stroke order</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#665744] transition hover:bg-[#fff1e4] hover:text-[#211a12]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 w-24 rounded bg-[#eee0d2]" />
              <div className="h-4 w-1/2 rounded bg-[#eee0d2]" />
              <div className="h-4 w-1/3 rounded bg-[#eee0d2]" />
            </div>
          ) : error ? (
            <div className="py-10 text-center text-[#93000a]">{error}</div>
          ) : data ? (
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1 space-y-5">
                <div>
                  <div className="torisho-jp mb-2 text-7xl font-black text-[#835500]">
                    {data.character}
                  </div>
                  <div className="text-xl font-bold uppercase text-[#211a12]">
                    {data.meanings[0] ?? 'Kanji'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-lg">
                    <span className="w-12 shrink-0 font-bold text-[#007165]">On</span>
                    <span className="text-[#3d2a17]">{data.onyomi ?? '-'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-lg">
                    <span className="w-12 shrink-0 font-bold text-[#007165]">Kun</span>
                    <span className="text-[#3d2a17]">{data.kunyomi ?? '-'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-[#665744]">
                    Meaning
                  </h4>
                  <p className="font-medium text-[#835500]">{data.meanings.join(', ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#d7c3ae] bg-[#fff8f4] p-3">
                    <h4 className="text-sm font-bold text-[#665744]">JLPT Level</h4>
                    <p className="font-bold text-[#211a12]">
                      {data.jlptLevel ? `N${data.jlptLevel}` : '-'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#d7c3ae] bg-[#fff8f4] p-3">
                    <h4 className="text-sm font-bold text-[#665744]">Stroke Count</h4>
                    <p className="font-bold text-[#211a12]">{data.strokeCount ?? '-'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-[#665744]">
                    Related Words
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.relatedWords.slice(0, 5).map((rw) => (
                      <Link
                        key={rw.dictionaryEntryId}
                        href={`/dictionary/${rw.dictionaryEntryId}`}
                        onClick={onClose}
                        className="group flex flex-col rounded-lg border border-[#d7c3ae] bg-white p-2 no-underline transition hover:bg-[#fff1e4]"
                      >
                        <span className="text-xs text-[#665744]">{rw.reading}</span>
                        <span className="text-lg font-bold text-[#835500]">{rw.keyword}</span>
                      </Link>
                    ))}
                    {data.relatedWords.length === 0 && (
                      <span className="text-[#665744]">No related words yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center">
                <div
                  className="relative overflow-hidden rounded-lg border border-[#d7c3ae] bg-white shadow-sm"
                  style={{
                    width: '160px',
                    height: '160px',
                    backgroundImage:
                      'linear-gradient(#eee0d2 1px, transparent 1px), linear-gradient(90deg, #eee0d2 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    backgroundPosition: 'center center',
                  }}
                >
                  <div ref={canvasRef} className="absolute inset-0 flex items-center justify-center" />

                  <button
                    type="button"
                    onClick={() => writerRef.current?.animateCharacter()}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-[#665744] shadow-sm transition hover:text-[#211a12]"
                    title="Replay stroke order"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <p className="mt-3 max-w-[180px] text-center text-sm text-[#665744]">
                  Replay to watch the writing order again.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
