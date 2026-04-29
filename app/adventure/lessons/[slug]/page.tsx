'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Loader, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import DashboardHeader from '@/src/components/DashboardHeader';
import { useAuth } from '@/src/libs/useAuth';
import { LearningService } from '@/src/services/learning.service';
import { LessonDetailResponse } from '@/src/types/learning';
import LessonHeroSection from '@/src/components/LessonDetail/LessonHeroSection';
import VocabularySection from '@/src/components/LessonDetail/VocabularySection';
import GrammarSection from '@/src/components/LessonDetail/GrammarSection';
import ReadingSection from '@/src/components/LessonDetail/ReadingSection';

export default function LessonDetailPage() {
  const { isAuthenticated, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [lessonError, setLessonError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    const loadLesson = async () => {
      setLoadingLesson(true);
      setLessonError(null);

      try {
        const response = await LearningService.getLessonBySlug(slug);
        if (!cancelled) {
          setLesson(response);
        }
      } catch (error) {
        if (!cancelled) {
          setLessonError(
            error instanceof Error ? error.message : 'Failed to load lesson'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingLesson(false);
        }
      }
    };

    void loadLesson();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="flex flex-col items-center gap-4">
          <Loader color="orange" size="lg" />
          <Text c="dimmed" size="sm">
            Preparing lesson...
          </Text>
        </div>
      </div>
    );
  }

  if (loadingLesson) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <DashboardHeader />
        <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-[1040px]">
            <div className="flex w-full justify-center py-24">
              <div className="flex w-full max-w-[960px] flex-col items-center gap-4">
                <Loader color="orange" size="lg" />
                <Text c="dimmed" size="sm">
                  Loading lesson content...
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || lessonError) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <DashboardHeader />
        <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-[1040px]">
            <div className="flex w-full justify-center py-16">
              <div className="flex w-full max-w-[960px] flex-col items-start gap-5">
                <Button
                  component={Link}
                  href="/adventure"
                  variant="white"
                  color="dark"
                  radius="xl"
                  leftSection={<IconArrowLeft size={16} stroke={2} />}
                  className="border border-slate-200"
                >
                  Back to Adventure
                </Button>

                <div className="w-full rounded-[28px] border border-red-200 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                  <Text size="sm" fw={700} c="red">
                    Lesson unavailable
                  </Text>
                  <Title order={2} className="mt-3 text-slate-900">
                    Unable to open this lesson
                  </Title>
                  <Text className="mt-3 text-[15px] leading-7 text-slate-600">
                    {lessonError ?? 'The lesson could not be found.'}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-20">
      <DashboardHeader />

      <div className="flex w-full justify-center px-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-[1040px]">
          <div className="flex w-full justify-center py-8">
            <div className="flex w-full max-w-[960px] flex-col gap-8">
              <LessonHeroSection lesson={lesson} />
              <VocabularySection vocabulary={lesson.vocabulary} />
              <GrammarSection grammar={lesson.grammar} />
              <ReadingSection reading={lesson.reading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
