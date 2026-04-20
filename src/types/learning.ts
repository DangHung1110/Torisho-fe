import { JLPTLevel } from './room';

export interface ChapterListItem {
  id: string;
  title: string;
  order: number;
  lessonCount: number;
}

export interface LevelChaptersResponse {
  levelId: string;
  levelCode: JLPTLevel;
  levelName: string;
  totalChapters: number;
  chapters: ChapterListItem[];
}

export interface LessonListItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order: number;
  sourceLevel: JLPTLevel;
  hasQuiz: boolean;
  vocabularyCount: number;
  grammarCount: number;
  readingCount: number;
}

export interface ChapterLessonsResponse {
  chapterId: string;
  chapterTitle: string;
  chapterOrder: number;
  levelId: string;
  levelCode: JLPTLevel;
  levelName: string;
  totalLessons: number;
  lessons: LessonListItem[];
}

export interface LessonMeaningItem {
  lang?: string;
  pos?: string[];
  glosses?: string[];
  [key: string]: unknown;
}

export interface LessonExampleItem {
  ja?: string;
  en?: string;
  [key: string]: unknown;
}

export interface LessonOtherFormItem {
  word?: string;
  reading?: string;
  [key: string]: unknown;
}

export interface LessonVocabularyDetailItem {
  id: string;
  sortOrder: number;
  term: string;
  reading: string;
  note?: string | null;
  isCommon: boolean;
  meanings: unknown;
  examples?: unknown | null;
  otherForms?: unknown | null;
  jlptTags?: unknown | null;
}

export interface LessonGrammarDetailItem {
  id: string;
  sortOrder: number;
  grammarPoint: string;
  meaningEn: string;
  detailUrl?: string | null;
  levelHint?: string | null;
  explanation?: string | null;
  usage?: unknown | null;
  examples?: unknown | null;
}

export interface LessonReadingDetailItem {
  id: string;
  sortOrder: number;
  title: string;
  content: string;
  translation?: string | null;
  url?: string | null;
  levelHint?: string | null;
  source?: string | null;
}

export interface LessonDetailResponse {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order: number;
  sourceLevel: JLPTLevel;
  hasQuiz: boolean;
  chapterId: string;
  chapterTitle: string;
  chapterOrder: number;
  levelId: string;
  levelCode: JLPTLevel;
  levelName: string;
  vocabulary: LessonVocabularyDetailItem[];
  grammar: LessonGrammarDetailItem[];
  reading: LessonReadingDetailItem[];
}
