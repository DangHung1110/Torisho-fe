import { POS_MAP } from '../constants/pos_map';
import {
  LessonExampleItem,
  LessonMeaningItem,
  LessonOtherFormItem,
} from '../types/learning';

export const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const toExamples = (examples?: unknown | null): LessonExampleItem[] =>
  Array.isArray(examples) ? (examples as LessonExampleItem[]) : [];

export const toOtherForms = (otherForms?: unknown | null): LessonOtherFormItem[] =>
  Array.isArray(otherForms) ? (otherForms as LessonOtherFormItem[]) : [];

export const toMeanings = (meanings?: unknown | null): LessonMeaningItem[] =>
  Array.isArray(meanings) ? (meanings as LessonMeaningItem[]) : [];

export const toTags = (tags?: unknown | null): string[] =>
  Array.isArray(tags) ? tags.filter(hasText) : [];

export const formatJlptTag = (tag: string) => tag.replace(/^jlpt-/i, '').toUpperCase();

const LESSON_POS_FALLBACK_MAP: Record<string, string> = {
  noun: 'Noun',
  adjective: 'Adjective',
  adverb: 'Adverb',
  pronoun: 'Pronoun',
  particle: 'Particle',
  conjunction: 'Conjunction',
  expression: 'Expression',
  prefix: 'Prefix',
  suffix: 'Suffix',
  'suru verb': 'Suru verb',
  'transitive verb': 'Transitive verb',
  'intransitive verb': 'Intransitive verb',
  "noun which may take the genitive case particle 'no'": 'No-adjectival noun',
  "nouns which may take the genitive case particle 'no'": 'No-adjectival noun',
};

const POS_NOISE_LABELS = new Set(['wikipedia definition']);

const COMPACT_POS_LABEL_MAP: Record<string, string> = {
  Noun: 'N',
  Adjective: 'Adj',
  Adverb: 'Adv',
  Pronoun: 'Pro',
  Particle: 'Part',
  Conjunction: 'Conj',
  Expression: 'Expr',
  Prefix: 'Pref',
  Suffix: 'Suf',
  'Suru verb': 'Suru',
  'Transitive verb': 'Vt',
  'Intransitive verb': 'Vi',
  'No-adjectival noun': 'No-adj',
};

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizePosToken = (token: string): string => {
  const cleaned = token.trim().replace(/\s+/g, ' ');
  if (!cleaned) {
    return '';
  }

  const lower = cleaned.toLowerCase();
  if (POS_NOISE_LABELS.has(lower)) {
    return '';
  }

  if (POS_MAP[lower]) {
    return POS_MAP[lower];
  }

  if (LESSON_POS_FALLBACK_MAP[lower]) {
    return LESSON_POS_FALLBACK_MAP[lower];
  }

  if (/^[A-Z0-9\s'()-]+$/.test(cleaned)) {
    return toTitleCase(cleaned);
  }

  return cleaned;
};

export const toPosLabels = (pos?: unknown | null): string[] => {
  if (!Array.isArray(pos)) {
    return [];
  }

  const labels = pos
    .filter(hasText)
    .flatMap((entry) =>
      entry
        .split(/[/,|]/g)
        .map((token) => normalizePosToken(token))
        .filter(hasText)
    );

  return Array.from(new Set(labels));
};

export const compactPosLabel = (label: string): string =>
  COMPACT_POS_LABEL_MAP[label] ?? label;

export const formatUnknownValue = (value: unknown): string => {
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
