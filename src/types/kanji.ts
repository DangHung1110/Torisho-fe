export interface KanjiRelatedWord {
  dictionaryEntryId: string;
  keyword: string;
  reading: string;
}

export interface KanjiDetail {
  id: string;
  character: string;
  onyomi?: string | null;
  kunyomi?: string | null;
  strokeCount?: number | null;
  jlptLevel?: number | null;
  meanings: string[];
  relatedWords: KanjiRelatedWord[];
}
