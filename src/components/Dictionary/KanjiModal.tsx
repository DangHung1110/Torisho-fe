// src/components/Dictionary/KanjiModal.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
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

  // Fetch Kanji Data
  useEffect(() => {
    let active = true;
    if (!character) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    kanjiService.get(character)
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

    return () => { active = false; };
  }, [character]);

  // Initialize HanziWriter Animation
  useEffect(() => {
    if (!data || !canvasRef.current || !character) return;

    // Clear canvas old content (if exists) before creating new instance
    canvasRef.current.innerHTML = '';

    writerRef.current = HanziWriter.create(canvasRef.current, character, {
      width: 160,
      height: 160,
      padding: 10,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 100,
      strokeColor: '#334155', //  (slate-700)
      radicalColor: '#e11d48', // (rose-600)
      // config data loader to point to Japanese Kanji data set
      charDataLoader: (char, onComplete) => {
        const encodedChar = encodeURIComponent(char);
        // Pin to 0.0.1 because latest (0.0.2) is missing JSON assets on npm.
        const jpUrl = `https://cdn.jsdelivr.net/npm/hanzi-writer-data-jp@0.0.1/${encodedChar}.json`;
        const cnUrl = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodedChar}.json`;

        void fetch(jpUrl)
          .then(async (res) => {
            if (res.ok) return res.json();

            // Fallback to the default dataset when JP data is unavailable.
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
            console.warn('Error loading SVG stroke:', err);
          });
      }
    });

    // run animation when just loaded
    setTimeout(() => {
      writerRef.current?.animateCharacter();
    }, 500);

  }, [data, character]);

  if (!character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Kanji</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-24 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
            </div>
          ) : error ? (
            <div className="text-center text-rose-500 py-10">{error}</div>
          ) : data ? (
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Left Column: Kanji Info */}
              <div className="flex-1 space-y-5">
                <div>
                  <div className="text-6xl font-black text-rose-600 mb-2">{data.character}</div>
                  <div className="text-xl font-bold text-slate-700 uppercase">
                    {data.meanings[0]} {/* First meaning as main meaning */}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-lg">
                    <span className="font-semibold text-emerald-700 w-12 shrink-0">On</span>
                    <span className="text-emerald-600">{data.onyomi ?? '—'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-lg">
                    <span className="font-semibold text-emerald-700 w-12 shrink-0">Kun</span>
                    <span className="text-emerald-600">{data.kunyomi ?? '—'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-slate-500">Meaning</h4>
                  <p className="text-blue-600 font-medium">{data.meanings.join(', ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-slate-500">JLPT Level</h4>
                    <p className="text-blue-600 font-medium">N{data.jlptLevel ?? '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-slate-500">Stroke Count</h4>
                    <p className="text-blue-600 font-medium">{data.strokeCount ?? '—'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-500">Related Words</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {data.relatedWords.slice(0, 5).map((rw) => (
                      <Link 
                        key={rw.dictionaryEntryId} 
                        href={`/dictionary/${rw.dictionaryEntryId}`}
                        onClick={onClose}
                        className="group flex flex-col items-center hover:bg-slate-50 p-1 rounded transition"
                      >
                        <span className="text-xs text-rose-400 group-hover:text-rose-600">{rw.reading}</span>
                        <span className="text-lg font-medium text-rose-600">{rw.keyword}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Animation Box */}
              <div className="shrink-0 flex flex-col items-center">
                <div 
                  className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                  style={{
                    width: '160px',
                    height: '160px',
                    // CSS tạo nền lưới kẻ ô (Grid) giống vở tập viết
                    backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    backgroundPosition: 'center center'
                  }}
                >
                  {/* Container cho SVG của HanziWriter */}
                  <div ref={canvasRef} className="absolute inset-0 flex items-center justify-center"></div>
                  
                  {/* Nút Replay Animation */}
                  <button
                    onClick={() => writerRef.current?.animateCharacter()}
                    className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 text-slate-400 hover:text-slate-700 shadow-sm transition"
                    title="Viết lại"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}