'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconCheck,
  IconCircleCheck,
  IconClock,
  IconX,
} from '@tabler/icons-react';
import { useAuth } from '@/src/libs/useAuth';
import { QuizService } from '@/src/services/quiz.service';
import { QuizDetail, StoredQuizResult } from '@/src/types/quiz';

type QuizRunnerProps =
  | {
      mode: 'daily';
    }
  | {
      mode: 'lesson';
      lessonId: string;
    };

const RESULT_STORAGE_KEY = 'torisho_quiz_result';

export default function QuizRunner(props: QuizRunnerProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadQuiz = async () => {
      setIsLoadingQuiz(true);
      setLoadError(null);

      try {
        const loadedQuiz =
          props.mode === 'daily'
            ? (await QuizService.getDailyQuiz()).quiz
            : await QuizService.getLessonQuiz(props.lessonId);

        if (!cancelled) {
          setQuiz(loadedQuiz);
          setRemainingSeconds(Math.max(1, loadedQuiz.estimatedMinutes) * 60);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load quiz.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingQuiz(false);
        }
      }
    };

    void loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, props]);

  useEffect(() => {
    if (!quiz || remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quiz, remainingSeconds]);

  const questions = quiz?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.questionId] : undefined;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const skillLabel = useMemo(() => {
    const skill = currentQuestion?.skill || quiz?.type || 'Quiz';
    return skill.replace(/([a-z])([A-Z])/g, '$1 $2');
  }, [currentQuestion?.skill, quiz?.type]);

  const handleSelect = (optionId: string) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionId]: optionId,
    }));
  };

  const handleNext = async () => {
    if (!quiz || !currentQuestion || !selectedOptionId) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await QuizService.submitQuiz(quiz.quizId, {
        answers: questions
          .filter((question) => answers[question.questionId])
          .map((question) => ({
            questionId: question.questionId,
            selectedOptionId: answers[question.questionId],
          })),
      });

      const storedResult: StoredQuizResult = {
        result,
        source: {
          kind: props.mode,
          lessonId: props.mode === 'lesson' ? props.lessonId : undefined,
          title: quiz.title,
        },
      };

      window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(storedResult));
      router.push('/quiz/result');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated || isLoadingQuiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] text-[#665744]">
        Loading quiz...
      </div>
    );
  }

  if (loadError || !quiz || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f4] px-6 text-[#211a12]">
        <div className="max-w-xl rounded-xl border border-[#d7c3ae] bg-white p-8 text-center shadow-[0_12px_32px_rgba(26,20,16,0.06)]">
          <h1 className="torisho-display text-3xl font-bold">Quiz is not ready</h1>
          <p className="mt-3 text-[#665744]">{loadError ?? 'There are no questions in this quiz yet.'}</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mt-6 rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#fff8f4] text-[#211a12]">
      <header className="sticky top-0 z-40 border-b border-[#d7c3ae] bg-[#fff8f4]/95 backdrop-blur">
        <div className="flex h-20 items-center justify-between px-5 lg:px-10">
          <div className="flex items-center gap-5">
            <span className="torisho-display text-3xl font-bold text-[#835500]">Torisho</span>
            <span className="hidden h-8 w-px bg-[#d7c3ae] sm:block" />
            <h1 className="torisho-display text-2xl font-bold">{quiz.isDaily ? 'Daily Quiz' : quiz.title}</h1>
          </div>
          <div className="hidden text-center text-sm font-extrabold uppercase tracking-[0.14em] text-[#3d2a17] md:block">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-[#3d2a17] transition-colors hover:bg-[#fff1e4]"
          >
            Exit Quiz <IconX size={19} />
          </button>
        </div>
        <div className="h-1 bg-[#eee0d2]">
          <div className="h-full bg-[#f5a623]" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between bg-[#fff1e4] px-5 py-3 shadow-sm lg:px-10">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#62fae3] bg-[#e9fffb] px-3 py-1 text-sm font-bold text-[#005047]">
              <IconBook size={16} /> {skillLabel}
            </span>
            <span className="rounded-full border border-[#d7c3ae] bg-[#f4e6d8] px-3 py-1 text-sm font-bold capitalize text-[#3d2a17]">
              {currentQuestion.difficulty || 'Normal'}
            </span>
          </div>
          <span className="inline-flex items-center gap-2 text-lg font-bold text-[#835500]">
            <IconClock size={20} /> {formatTime(remainingSeconds)}
          </span>
        </div>
      </header>

      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(#d7c3ae 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10 w-full max-w-5xl">
          <div className="text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-[#835500]">
              {answeredCount}/{questions.length} answered
            </p>
            <h2 className="torisho-display text-3xl font-bold leading-tight md:text-5xl">
              {currentQuestion.content}
            </h2>
            {currentQuestion.source && (
              <div className="relative mx-auto mt-9 inline-flex min-w-64 justify-center rounded-xl border border-[#d7c3ae] bg-white px-12 py-8 shadow-[0_12px_32px_rgba(26,20,16,0.06)]">
                <span className="torisho-jp text-6xl font-bold">{currentQuestion.source}</span>
                <span className="absolute left-4 top-4 h-5 w-5 border-l border-t border-[#d7c3ae]" />
                <span className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-[#d7c3ae]" />
              </div>
            )}
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const selected = selectedOptionId === option.optionId;

              return (
                <button
                  key={option.optionId}
                  type="button"
                  onClick={() => handleSelect(option.optionId)}
                  className={`relative min-h-28 rounded-lg border p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(26,20,16,0.08)] ${
                    selected
                      ? 'border-2 border-[#f5a623] bg-[#fff1e4] text-[#835500]'
                      : 'border-[#d7c3ae] bg-white text-[#3d2a17] hover:border-[#f5a623]'
                  }`}
                >
                  <span className="torisho-jp text-3xl">{option.text}</span>
                  {selected && (
                    <IconCircleCheck className="absolute right-4 top-4 text-[#f5a623]" size={25} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="sticky bottom-0 z-40 border-t border-[#d7c3ae] bg-white/85 px-5 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-lg font-medium text-[#3d2a17] transition-colors hover:bg-[#fff1e4] disabled:opacity-40"
          >
            <IconArrowLeft size={22} /> Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOptionId || isSubmitting}
            className="flex items-center gap-3 rounded-full border border-[#835500] px-7 py-3 text-lg font-bold text-[#835500] transition-colors hover:bg-[#f5a623] hover:text-[#291800] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
            {currentIndex === questions.length - 1 ? <IconCheck size={22} /> : <IconArrowRight size={22} />}
          </button>
        </div>
      </footer>
    </main>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export { RESULT_STORAGE_KEY };
