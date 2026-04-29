import { Badge, Text, Title } from '@mantine/core';
import { LessonVocabularyDetailItem } from '@/src/types/learning';
import {
  compactPosLabel,
  formatJlptTag,
  hasText,
  toExamples,
  toMeanings,
  toOtherForms,
  toPosLabels,
  toTags,
} from '@/src/utils/lesson-content';

type VocabularySectionProps = {
  vocabulary: LessonVocabularyDetailItem[];
};

export default function VocabularySection({ vocabulary }: VocabularySectionProps) {
  return (
    <section
      id="vocabulary"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:p-7"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Text className="text-[12px] font-bold uppercase tracking-[0.14em] text-orange-500">
            Vocabulary
          </Text>
          <Title order={2} className="mt-2 text-slate-900">
            Core words for this lesson
          </Title>
        </div>
        <Text size="sm" c="dimmed">
          {vocabulary.length} items
        </Text>
      </div>

      {vocabulary.length === 0 ? (
        <Text size="sm" c="dimmed">
          No vocabulary items in this lesson.
        </Text>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {vocabulary.map((item) => {
            const meanings = toMeanings(item.meanings);
            const otherForms = toOtherForms(item.otherForms);
            const examples = toExamples(item.examples);
            const jlptTags = toTags(item.jlptTags);

            return (
              <article
                key={item.id}
                className="rounded-lg border border-orange-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff9f2_100%)] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <Text className="text-[11px] font-bold uppercase tracking-[0.06em] text-orange-500">
                      Word {item.sortOrder}
                    </Text>
                    <Title order={3} className="mt-2 text-slate-900">
                      {item.term}
                    </Title>
                    <Text className="mt-1 text-sm font-medium text-slate-500">
                      {item.reading}
                    </Text>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
                      const partsOfSpeech = toPosLabels(meaning.pos);
                      const glosses = Array.isArray(meaning.glosses)
                        ? meaning.glosses.filter(hasText)
                        : [];

                      return (
                        <div
                          key={`${item.id}-meaning-${index}`}
                          className="rounded-lg border border-slate-200/90 bg-white px-3.5 py-3"
                        >
                          {partsOfSpeech.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {partsOfSpeech.slice(0, 5).map((partOfSpeech, posIndex) => (
                                <span
                                  key={`${item.id}-meaning-${index}-pos-${posIndex}`}
                                  title={partOfSpeech}
                                  className="inline-flex min-h-[22px] items-center rounded-md bg-slate-100 px-1.5 py-[2px] text-[11px] font-semibold leading-[1.2] text-slate-600"
                                >
                                  {compactPosLabel(partOfSpeech)}
                                </span>
                              ))}
                              {partsOfSpeech.length > 5 && (
                                <span className="inline-flex min-h-[22px] items-center rounded-md border border-slate-200 bg-white px-1.5 py-[2px] text-[11px] font-semibold leading-[1.2] text-slate-500">
                                  +{partsOfSpeech.length - 5}
                                </span>
                              )}
                            </div>
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
                      <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <Text className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
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
                      <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <Text className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
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
  );
}
