'use client';

import { useEffect, useRef, useState } from 'react';
import { kanjiService } from '@/src/services/kanji.service';

const CANVAS_SIZE = 300;
const LINE_WIDTH = 8;
const STROKE_COLOR = '#2b1d12';
const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(#eadfd3 1px, transparent 1px), linear-gradient(90deg, #eadfd3 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

type KanjiHandwritingPanelProps = {
  onCandidateSelect: (character: string) => void;
  onClose?: () => void;
};

export default function KanjiHandwritingPanel({
  onCandidateSelect,
  onClose,
}: KanjiHandwritingPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentStroke = useRef<number[]>([]);
  const strokesRef = useRef<number[][]>([]);
  const recognizeTimerRef = useRef<number | null>(null);
  const isDrawingRef = useRef(false);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const [strokes, setStrokes] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (recognizeTimerRef.current) {
        window.clearTimeout(recognizeTimerRef.current);
        recognizeTimerRef.current = null;
      }
    };
  }, []);

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = STROKE_COLOR;
    return ctx;
  };

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    return {
      x: Math.round((event.clientX - rect.left) * scaleX),
      y: Math.round((event.clientY - rect.top) * scaleY),
    };
  };

  const redrawAll = (allStrokes: number[][]) => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    for (const stroke of allStrokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0], stroke[1]);
      for (let i = 2; i < stroke.length; i += 2) {
        ctx.lineTo(stroke[i], stroke[i + 1]);
      }
      ctx.stroke();
    }
  };

  const recognize = async (nextStrokes: number[][]) => {
    if (!nextStrokes.length) {
      setCandidates([]);
      setIsRecognizing(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsRecognizing(true);
    setErrorMessage(null);

    try {
      const result = await kanjiService.recognize({
        strokes: nextStrokes,
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
      });

      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      const normalized = Array.isArray(result)
        ? result.map((item) => item.trim()).filter(Boolean)
        : [];
      setCandidates(normalized);
    } catch (error) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setErrorMessage('Cannot recognize handwriting right now.');
    } finally {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setIsRecognizing(false);
    }
  };

  const scheduleRecognize = (nextStrokes: number[][]) => {
    if (recognizeTimerRef.current) {
      window.clearTimeout(recognizeTimerRef.current);
    }

    recognizeTimerRef.current = window.setTimeout(() => {
      recognizeTimerRef.current = null;
      void recognize(nextStrokes);
    }, 350);
  };

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();

    const point = getPoint(event);
    const ctx = getContext();
    if (!point || !ctx) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    currentStroke.current = [point.x, point.y];
    isDrawingRef.current = true;
    setIsDrawing(true);
  };

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    event.preventDefault();

    const point = getPoint(event);
    const ctx = getContext();
    if (!point || !ctx) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    currentStroke.current.push(point.x, point.y);
  };

  const endStroke = (event?: React.PointerEvent<HTMLCanvasElement>) => {
    if (event) {
      event.preventDefault();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    if (!isDrawingRef.current || currentStroke.current.length === 0) {
      isDrawingRef.current = false;
      setIsDrawing(false);
      return;
    }

    const finished = [...currentStroke.current];
    currentStroke.current = [];
    isDrawingRef.current = false;
    setIsDrawing(false);

    const nextStrokes = [...strokesRef.current, finished];
    strokesRef.current = nextStrokes;
    setStrokes(nextStrokes);
    scheduleRecognize(nextStrokes);
  };

  const undoStroke = () => {
    const nextStrokes = strokesRef.current.slice(0, -1);
    strokesRef.current = nextStrokes;
    setStrokes(nextStrokes);
    redrawAll(nextStrokes);

    if (!nextStrokes.length) {
      setCandidates([]);
      setErrorMessage(null);
      setIsRecognizing(false);
      return;
    }

    scheduleRecognize(nextStrokes);
  };

  const clearCanvas = () => {
    const ctx = getContext();
    ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    currentStroke.current = [];
    strokesRef.current = [];
    setStrokes([]);
    setCandidates([]);
    setErrorMessage(null);
    if (recognizeTimerRef.current) {
      window.clearTimeout(recognizeTimerRef.current);
      recognizeTimerRef.current = null;
    }
    setIsRecognizing(false);
  };

  const handleCandidateClick = (character: string) => {
    onCandidateSelect(character);
  };

  return (
    <div className="rounded-2xl border border-[#d7c3ae] bg-white p-6 shadow-[0_12px_30px_rgba(26,20,16,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#835500]">
            Handwriting OCR
          </p>
          <h3 className="torisho-display mt-2 text-2xl font-bold text-[#211a12]">Draw a kanji</h3>
          <p className="mt-2 text-sm text-[#665744]">
            Use your mouse or touch. Kanjis will appear below.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            disabled={!strokes.length}
            className="rounded-full border border-[#d7c3ae] px-4 py-2 text-xs font-bold text-[#835500] transition enabled:hover:border-[#f5a623] enabled:hover:text-[#211a12] disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={undoStroke}
            disabled={!strokes.length}
            className="rounded-full border border-[#d7c3ae] px-4 py-2 text-xs font-bold text-[#835500] transition enabled:hover:border-[#f5a623] enabled:hover:text-[#211a12] disabled:opacity-50"
          >
            Undo
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d7c3ae] px-4 py-2 text-xs font-bold text-[#665744] transition hover:border-[#f5a623] hover:text-[#211a12]"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#d7c3ae] bg-[#fffdfb] p-3">
        <div className="relative mx-auto h-[320px] w-full max-w-[640px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={GRID_STYLE}
          />
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute inset-0 h-full w-full rounded-lg bg-transparent shadow-sm touch-none"
            onPointerDown={startStroke}
            onPointerMove={continueStroke}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
            onPointerCancel={endStroke}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {isRecognizing && (
          <span className="rounded-full bg-[#fff1e4] px-3 py-2 text-xs font-bold text-[#835500]">
            Recognizing...
          </span>
        )}
        {errorMessage && (
          <span className="rounded-full bg-[#fff1ef] px-3 py-2 text-xs font-bold text-[#93000a]">
            {errorMessage}
          </span>
        )}
      </div>

      <div className="mt-4 border-t border-[#eee0d2] pt-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#835500]">
          Candidates
        </p>
        <div className="mt-2 flex flex-wrap items-center text-lg">
          {candidates.length === 0 ? (
            <span className="text-sm text-[#665744]">Draw a kanji to see candidates.</span>
          ) : (
            candidates.map((character, index) => (
              <span key={`${character}-${index}`} className="flex items-center">
                {index > 0 && <span className="mx-2 text-[#d7c3ae]">|</span>}
                <button
                  type="button"
                  onClick={() => handleCandidateClick(character)}
                  className="torisho-jp text-2xl font-semibold text-[#211a12] transition hover:text-[#835500]"
                >
                  {character}
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
