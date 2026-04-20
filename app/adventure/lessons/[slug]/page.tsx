'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Anchor, Badge, Button, Loader, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconExternalLink } from '@tabler/icons-react';
import DashboardHeader from '@/src/components/DashboardHeader';
import { useAuth } from '@/src/libs/useAuth';
import { LearningService } from '@/src/services/learning.service';
import {
  LessonDetailResponse,
  LessonExampleItem,
  LessonMeaningItem,
  LessonOtherFormItem,
} from '@/src/types/learning';

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const toExamples = (examples?: unknown | null): LessonExampleItem[] =>
  Array.isArray(examples) ? (examples as LessonExampleItem[]) : [];

const toOtherForms = (otherForms?: unknown | null): LessonOtherFormItem[] =>
  Array.isArray(otherForms) ? (otherForms as LessonOtherFormItem[]) : [];

const toMeanings = (meanings?: unknown | null): LessonMeaningItem[] =>
  Array.isArray(meanings) ? (meanings as LessonMeaningItem[]) : [];

const toTags = (tags?: unknown | null): string[] =>
  Array.isArray(tags) ? tags.filter(hasText) : [];

const formatJlptTag = (tag: string) => tag.replace(/^jlpt-/i, '').toUpperCase();

const formatUnknownValue = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatUnknownValue(item))
      .filter(hasText)
      .join(' / ');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, itemValue]) => {
        const formatted = formatUnknownValue(itemValue);
        return hasText(formatted) ? `${key}: ${formatted}` : '';
      })
      .filter(hasText)
      .join(' | ');
  }

  return '';
};

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
        <div className="mx-auto flex max-w-[1120px] items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <Loader color="orange" size="lg" />
            <Text c="dimmed" size="sm">
              Loading lesson content...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || lessonError) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <DashboardHeader />
        <div className="mx-auto flex max-w-[960px] flex-col items-start gap-5 px-4 py-16 sm:px-6 lg:px-8">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-20">
      <DashboardHeader />

      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(140deg,#fffdf8_0%,#ffffff_45%,#f2f7ff_100%)] shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200/80 px-6 py-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
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

              <Badge radius="xl" color="orange" variant="light">
                {lesson.levelCode}
              </Badge>
              <Badge radius="xl" color="blue" variant="light">
                {lesson.chapterTitle}
              </Badge>
              <Badge radius="xl" color="grape" variant="light">
                Lesson {lesson.order}
              </Badge>
              {lesson.hasQuiz && (
                <Badge radius="xl" color="yellow" variant="light">
                  Quiz Available
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_300px] lg:items-end">
            <div className="max-w-3xl">
              <Text className="text-[12px] font-bold uppercase tracking-[0.28em] text-slate-400">
                {lesson.levelName}
              </Text>
              <Title className="mt-3 text-[2.15rem] font-black tracking-tight text-slate-900 sm:text-[2.8rem]">
                {lesson.title}
              </Title>
              <Text className="mt-4 max-w-2xl text-[15px] leading-8 text-slate-600 sm:text-[16px]">
                {lesson.description ||
                  `Study vocabulary, grammar, and reading content for ${lesson.chapterTitle}.`}
              </Text>
              <Text className="mt-5 text-sm font-medium text-slate-500">
                {lesson.chapterTitle} / {lesson.slug}
              </Text>

              <div className="mt-6 flex flex-wrap gap-3">
                <Anchor
                  href="#vocabulary"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50"
                >
                  Vocabulary
                </Anchor>
                <Anchor
                  href="#grammar"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50"
                >
                  Grammar
                </Anchor>
                <Anchor
                  href="#reading"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50"
                >
                  Reading
                </Anchor>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[22px] border border-white/90 bg-white/88 p-4 shadow-sm">
                <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Vocabulary
                </Text>
                <Text className="mt-3 text-3xl font-black text-slate-900">
                  {lesson.vocabulary.length}
                </Text>
              </div>
              <div className="rounded-[22px] border border-white/90 bg-white/88 p-4 shadow-sm">
                <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Grammar
                </Text>
                <Text className="mt-3 text-3xl font-black text-slate-900">
                  {lesson.grammar.length}
                </Text>
              </div>
              <div className="rounded-[22px] border border-white/90 bg-white/88 p-4 shadow-sm">
                <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Reading
                </Text>
                <Text className="mt-3 text-3xl font-black text-slate-900">
                  {lesson.reading.length}
                </Text>
              </div>
            </div>
          </div>
        </section>

        <section
          id="vocabulary"
          className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-7"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Text className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-500">
                Vocabulary
              </Text>
              <Title order={2} className="mt-2 text-slate-900">
                Core words for this lesson
              </Title>
            </div>
            <Text size="sm" c="dimmed">
              {lesson.vocabulary.length} items
            </Text>
          </div>

          {lesson.vocabulary.length === 0 ? (
            <Text size="sm" c="dimmed">
              No vocabulary items in this lesson.
            </Text>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {lesson.vocabulary.map((item) => {
                const meanings = toMeanings(item.meanings);
                const otherForms = toOtherForms(item.otherForms);
                const examples = toExamples(item.examples);
                const jlptTags = toTags(item.jlptTags);

                return (
                  <article
                    key={item.id}
                    className="rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff9f2_100%)] p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500">
                          Word {item.sortOrder}
                        </Text>
                        <Title order={3} className="mt-2 text-slate-900">
                          {item.term}
                        </Title>
                        <Text className="mt-1 text-sm font-medium text-slate-500">
                          {item.reading}
                        </Text>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        {item.isCommon && (
                          <Badge radius="xl" color="orange" variant="light">
                            Common
                          </Badge>
                        )}
                        {jlptTags.slice(0, 2).map((tag) => (
                          <Badge
                            key={`${item.id}-${tag}`}
                            radius="xl"
                            color="gray"
                            variant="light"
                          >
                            {formatJlptTag(tag)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {hasText(item.note) && (
                      <Text className="mt-4 text-sm leading-7 text-slate-600">
                        {item.note}
                      </Text>
                    )}

                    {meanings.length > 0 && (
                      <div className="mt-4 grid gap-3">
                        {meanings.slice(0, 3).map((meaning, index) => {
                          const partsOfSpeech = Array.isArray(meaning.pos)
                            ? meaning.pos.filter(hasText)
                            : [];
                          const glosses = Array.isArray(meaning.glosses)
                            ? meaning.glosses.filter(hasText)
                            : [];

                          return (
                            <div
                              key={`${item.id}-meaning-${index}`}
                              className="rounded-[20px] border border-white/90 bg-white/90 p-4"
                            >
                              {partsOfSpeech.length > 0 && (
                                <Text className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                  {partsOfSpeech.join(' / ')}
                                </Text>
                              )}
                              {glosses.length > 0 && (
                                <Text className="mt-2 text-[14px] leading-7 text-slate-700">
                                  {glosses.join(', ')}
                                </Text>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(otherForms.length > 0 || examples.length > 0) && (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {otherForms.length > 0 && (
                          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                            <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                              Other forms
                            </Text>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {otherForms.map((form, index) => (
                                <span
                                  key={`${item.id}-form-${index}`}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-600"
                                >
                                  {[form.word, form.reading].filter(hasText).join(' / ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {examples.length > 0 && (
                          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                            <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                              Example
                            </Text>
                            {hasText(examples[0]?.ja) && (
                              <Text className="mt-3 text-[14px] leading-7 text-slate-800">
                                {examples[0]?.ja}
                              </Text>
                            )}
                            {hasText(examples[0]?.en) && (
                              <Text className="mt-2 text-sm leading-6 text-slate-500">
                                {examples[0]?.en}
                              </Text>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section
          id="grammar"
          className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-7"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Text className="text-[12px] font-bold uppercase tracking-[0.24em] text-emerald-500">
                Grammar
              </Text>
              <Title order={2} className="mt-2 text-slate-900">
                Sentence patterns and usage
              </Title>
            </div>
            <Text size="sm" c="dimmed">
              {lesson.grammar.length} points
            </Text>
          </div>

          {lesson.grammar.length === 0 ? (
            <Text size="sm" c="dimmed">
              No grammar items in this lesson.
            </Text>
          ) : (
            <div className="grid gap-4">
              {lesson.grammar.map((item) => {
                const examples = toExamples(item.examples);
                const formattedUsage = formatUnknownValue(item.usage);
                const usageItems = Array.isArray(item.usage)
                  ? item.usage.map((entry) => formatUnknownValue(entry)).filter(hasText)
                  : hasText(formattedUsage)
                    ? [formattedUsage]
                    : [];

                return (
                  <article
                    key={item.id}
                    className="rounded-[24px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fffb_100%)] p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-500">
                          Grammar {item.sortOrder}
                        </Text>
                        <Title order={3} className="mt-2 text-slate-900">
                          {item.grammarPoint}
                        </Title>
                        <Text className="mt-2 text-[15px] font-semibold text-slate-600">
                          {item.meaningEn}
                        </Text>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {hasText(item.levelHint) && (
                          <Badge radius="xl" color="teal" variant="light">
                            {item.levelHint}
                          </Badge>
                        )}
                        {hasText(item.detailUrl) && (
                          <Button
                            component="a"
                            href={item.detailUrl ?? undefined}
                            target="_blank"
                            rel="noreferrer"
                            size="xs"
                            radius="xl"
                            variant="light"
                            color="dark"
                            rightSection={<IconExternalLink size={14} stroke={2} />}
                          >
                            Source
                          </Button>
                        )}
                      </div>
                    </div>

                    {hasText(item.explanation) && (
                      <Text className="mt-4 text-[15px] leading-8 text-slate-600">
                        {item.explanation}
                      </Text>
                    )}

                    {usageItems.length > 0 && (
                      <div className="mt-4 rounded-[20px] border border-emerald-100 bg-white p-4">
                        <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-500">
                          Usage
                        </Text>
                        <div className="mt-3 flex flex-col gap-2">
                          {usageItems.map((usageItem, index) => (
                            <Text
                              key={`${item.id}-usage-${index}`}
                              className="text-[14px] leading-7 text-slate-600"
                            >
                              {usageItem}
                            </Text>
                          ))}
                        </div>
                      </div>
                    )}

                    {examples.length > 0 && (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {examples.slice(0, 4).map((example, index) => (
                          <div
                            key={`${item.id}-example-${index}`}
                            className="rounded-[20px] border border-slate-200 bg-white p-4"
                          >
                            <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                              Example {index + 1}
                            </Text>
                            {hasText(example.ja) && (
                              <Text className="mt-3 text-[15px] leading-7 text-slate-800">
                                {example.ja}
                              </Text>
                            )}
                            {hasText(example.en) && (
                              <Text className="mt-2 text-sm leading-6 text-slate-500">
                                {example.en}
                              </Text>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section
          id="reading"
          className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-7"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Text className="text-[12px] font-bold uppercase tracking-[0.24em] text-blue-500">
                Reading
              </Text>
              <Title order={2} className="mt-2 text-slate-900">
                Passage and translation
              </Title>
            </div>
            <Text size="sm" c="dimmed">
              {lesson.reading.length} article{lesson.reading.length === 1 ? '' : 's'}
            </Text>
          </div>

          {lesson.reading.length === 0 ? (
            <Text size="sm" c="dimmed">
              No reading content in this lesson.
            </Text>
          ) : (
            <div className="grid gap-5">
              {lesson.reading.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[24px] border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f5faff_100%)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-blue-100 px-5 py-4">
                    <div className="min-w-0">
                      <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-500">
                        Reading {item.sortOrder}
                      </Text>
                      <Title order={3} className="mt-2 text-slate-900">
                        {item.title}
                      </Title>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {hasText(item.levelHint) && (
                        <Badge radius="xl" color="blue" variant="light">
                          {item.levelHint}
                        </Badge>
                      )}
                      {hasText(item.source) && (
                        <Badge radius="xl" color="gray" variant="light">
                          {item.source}
                        </Badge>
                      )}
                      {hasText(item.url) && (
                        <Button
                          component="a"
                          href={item.url ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          size="xs"
                          radius="xl"
                          variant="subtle"
                          color="blue"
                          rightSection={<IconExternalLink size={14} stroke={2} />}
                        >
                          Open source
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
                    <div className="rounded-[22px] bg-[#fffdfa] p-5">
                      <Text className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Japanese text
                      </Text>
                      <Text className="mt-3 whitespace-pre-line text-[15px] leading-8 text-slate-800">
                        {item.content}
                      </Text>
                    </div>

                    <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                      <Text className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Translation
                      </Text>
                      <Text className="mt-3 whitespace-pre-line text-[14px] leading-7 text-slate-600">
                        {hasText(item.translation)
                          ? item.translation
                          : 'No translation provided for this reading yet.'}
                      </Text>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
