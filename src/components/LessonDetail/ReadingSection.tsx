import { Badge, Button, Text, Title } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { LessonReadingDetailItem } from '@/src/types/learning';
import { hasText } from '@/src/utils/lesson-content';

type ReadingSectionProps = {
  reading: LessonReadingDetailItem[];
};

export default function ReadingSection({ reading }: ReadingSectionProps) {
  return (
    <section
      id="reading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-7"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Text className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-500">
            Reading
          </Text>
          <Title order={2} className="mt-2 text-slate-900">
            Passage and translation
          </Title>
        </div>
        <Text size="sm" c="dimmed">
          {reading.length} article{reading.length === 1 ? '' : 's'}
        </Text>
      </div>

      {reading.length === 0 ? (
        <Text size="sm" c="dimmed">
          No reading content in this lesson.
        </Text>
      ) : (
        <div className="grid gap-5">
          {reading.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f5faff_100%)]"
            >
              <div className="flex flex-col gap-3 border-b border-blue-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <Text className="text-[11px] font-bold uppercase tracking-[0.06em] text-blue-500">
                    Reading {item.sortOrder}
                  </Text>
                  <Title order={3} className="mt-2 text-slate-900">
                    {item.title}
                  </Title>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
                <div className="rounded-lg bg-[#fffdfa] p-5">
                  <Text className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Japanese text
                  </Text>
                  <Text className="mt-3 whitespace-pre-line text-[15px] leading-8 text-slate-800">
                    {item.content}
                  </Text>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <Text className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
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
  );
}
