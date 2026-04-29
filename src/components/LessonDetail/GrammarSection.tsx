import { Badge, Button, Text, Title } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { LessonGrammarDetailItem } from '@/src/types/learning';
import {
  formatUnknownValue,
  hasText,
  toExamples,
} from '@/src/utils/lesson-content';

type GrammarSectionProps = {
  grammar: LessonGrammarDetailItem[];
};

export default function GrammarSection({ grammar }: GrammarSectionProps) {
  return (
    <section
      id="grammar"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-7"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Text className="text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Grammar
          </Text>
          <Title order={2} className="mt-2 text-slate-900">
            Sentence patterns and usage
          </Title>
        </div>
        <Text size="sm" c="dimmed">
          {grammar.length} points
        </Text>
      </div>

      {grammar.length === 0 ? (
        <Text size="sm" c="dimmed">
          No grammar items in this lesson.
        </Text>
      ) : (
        <div className="grid gap-4">
          {grammar.map((item) => {
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
                className="rounded-lg border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fffb_100%)] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <Text className="text-[11px] font-bold uppercase tracking-[0.06em] text-emerald-500">
                      Grammar {item.sortOrder}
                    </Text>
                    <Title order={3} className="mt-2 text-slate-900">
                      {item.grammarPoint}
                    </Title>
                    <Text className="mt-2 text-[15px] font-semibold text-slate-600">
                      {item.meaningEn}
                    </Text>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
                  <div className="mt-4 rounded-lg border border-emerald-100 bg-white p-4">
                    <Text className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-500">
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
                        className="rounded-lg border border-slate-200 bg-white p-4"
                      >
                        <Text className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
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
  );
}
