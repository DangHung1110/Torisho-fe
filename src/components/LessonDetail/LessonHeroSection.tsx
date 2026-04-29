import Link from 'next/link';
import { Anchor, Badge, Button, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { LessonDetailResponse } from '@/src/types/learning';

type LessonHeroSectionProps = {
  lesson: LessonDetailResponse;
};

type LessonMetric = {
  label: string;
  value: number;
};

export default function LessonHeroSection({ lesson }: LessonHeroSectionProps) {
  const metrics: LessonMetric[] = [
    { label: 'Vocabulary', value: lesson.vocabulary.length },
    { label: 'Grammar', value: lesson.grammar.length },
    { label: 'Reading', value: lesson.reading.length },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-[linear-gradient(140deg,#fffdf8_0%,#ffffff_45%,#f2f7ff_100%)] shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
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

      <div className="grid gap-7 px-6 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(230px,260px)] lg:items-start">
        <div className="max-w-3xl">
          <Text className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {lesson.levelName}
          </Text>
          <Title className="mt-3 text-[2.1rem] font-black tracking-tight text-slate-900 sm:text-[2.75rem]">
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

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/90 bg-white/90 px-4 py-3.5 shadow-sm"
            >
              <Text className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {metric.label}
              </Text>
              <Text className="mt-2 text-3xl font-black leading-tight text-slate-900">
                {metric.value}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
