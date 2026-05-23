'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconChevronDown,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { RESULT_STORAGE_KEY } from '@/src/components/quiz/QuizRunner';
import { StoredQuizResult } from '@/src/types/quiz';

const RESULT_MASCOT_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuABhRHRixGwQhUz3gEQoR98njLARLb62nt3KW6VZEd2ipt8aZfM4Toodd_bHStMuejGHOlRBGikI0CrlKYY5pqLB_AFa_IZXxoKiRsyDonL4PM_Mf8GV6MeIyXVx67Slo4K5119ZjIIusnRZ_rmkipDuFY2a8of5yYS-c7EY7Xrk4d1I4XrIKH7WNk8HLrG3TjJ3M9RKlr3jdNFU1qb5Z0p0onQTA0qO4Pu5gYlVPVQJlchA_UXCaFazcr2Y1eabVW7O-RjnojYqNc';

export default function QuizResultPage() {
  const router = useRouter();
  const [storedResult] = useState<StoredQuizResult | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawResult = window.sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!rawResult) {
      return null;
    }

    try {
      return JSON.parse(rawResult) as StoredQuizResult;
    } catch {
      return null;
    }
  });
  const [showMistakes, setShowMistakes] = useState(true);

  const mistakes = useMemo(
    () => storedResult?.result.questions.filter((question) => !question.isCorrect) ?? [],
    [storedResult?.result.questions]
  );

  if (!storedResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f4] px-6 text-[#211a12]">
        <div className="max-w-xl rounded-xl border border-[#d7c3ae] bg-white p-8 text-center shadow-[0_12px_32px_rgba(26,20,16,0.06)]">
          <h1 className="torisho-display text-3xl font-bold">No quiz result found</h1>
          <p className="mt-3 text-[#665744]">Finish a quiz first, then the result will appear here.</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] no-underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { result, source } = storedResult;
  const retryHref = source.kind === 'lesson' && source.lessonId ? `/quiz/lesson/${source.lessonId}` : '/quiz/daily';

  return (
    <main className="min-h-screen bg-[#fff8f4] px-5 py-8 text-[#211a12]">
      <header className="mx-auto flex h-14 max-w-[1200px] items-center justify-between border-b border-[#d7c3ae]">
        <Link href="/dashboard" className="torisho-display text-3xl font-bold text-[#835500] no-underline">
          Torisho
        </Link>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-[#3d2a17] transition-colors hover:text-[#835500]"
        >
          <IconX size={19} /> Exit Quiz
        </button>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-9 py-9">
        <section className="text-center">
          <img
            src={RESULT_MASCOT_URL}
            alt="Torisho quiz result mascot"
            className="mx-auto h-40 w-40 rounded-full border border-[#d7c3ae] object-cover shadow-sm"
          />
          <h1 className="torisho-display mt-7 text-4xl font-bold md:text-5xl">Yoku dekimashita!</h1>
          <p className="mt-4 text-lg text-[#3d2a17]">Well done. Here is how you performed on {source.title}.</p>
          <div className="mt-10 flex flex-col items-center">
            <div className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-[#f5a623] bg-white">
              <span className="torisho-display text-7xl font-bold text-[#f5a623]">
                {Math.round(result.score)}
              </span>
            </div>
            <p className="mt-4 text-lg">/ 100</p>
            <p className="mt-2 text-[#3d2a17]">
              {result.correctAnswers} correct out of {result.totalQuestions} questions
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
          <h2 className="torisho-display border-b border-[#d7c3ae] pb-4 text-2xl font-bold">
            Skill Breakdown
          </h2>
          <div className="mt-5 space-y-4">
            {result.skillScores.length > 0 ? (
              result.skillScores.map((score) => (
                <div key={score.skill}>
                  <div className="mb-2 flex justify-between">
                    <span>{score.skill}</span>
                    <span className="font-bold">{Math.round(score.score)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full border border-[#d7c3ae] bg-[#f4e6d8]">
                    <div className="h-full rounded-full bg-[#f5a623]" style={{ width: `${clamp(score.score)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#665744]">No skill breakdown returned for this attempt.</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
          <button
            type="button"
            onClick={() => setShowMistakes((value) => !value)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="torisho-display text-2xl font-bold">Review mistakes ({mistakes.length})</h2>
            <IconChevronDown className={`transition-transform ${showMistakes ? 'rotate-180' : ''}`} />
          </button>
          {showMistakes && (
            <div className="mt-5 space-y-4 border-t border-[#d7c3ae] pt-5">
              {mistakes.length > 0 ? (
                mistakes.map((question) => (
                  <article key={question.questionId} className="rounded-lg border border-[#d7c3ae] bg-[#fff8f4] p-5">
                    <h3 className="font-bold">{question.content}</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#ffc2bd] bg-[#ffdad6] px-3 py-1 text-[#93000a]">
                        <IconX size={16} /> {question.selectedOptionText}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#62fae3] bg-[#dffff9] px-3 py-1 text-[#005047]">
                        ✓ {question.correctOptionText}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-[#0f6c2f]">No mistakes in this attempt.</p>
              )}
            </div>
          )}
        </section>

        <section className="flex flex-col justify-center gap-4 border-t border-[#d7c3ae] pt-7 sm:flex-row">
          <Link
            href="/adventure"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#835500] px-8 py-3 font-bold text-[#3d2a17] no-underline"
          >
            <IconArrowLeft size={19} /> Review Lesson
          </Link>
          <Link
            href={retryHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#835500] px-8 py-3 font-bold text-[#3d2a17] no-underline"
          >
            <IconRefresh size={19} /> Retry Quiz
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-[#f5a623] px-8 py-3 font-bold text-[#291800] no-underline"
          >
            Back to Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}
