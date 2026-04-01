export interface WordSearchResult {
  id: string;
  kanji: string | null;
  kana: string;
  primaryMeaning: string;
  isCommon: boolean;
}

export interface WordExample {
  japanese: string;
  english: string;
}

export interface WordSense {
  partsOfSpeech: string[];
  glosses: string[];
}

export interface WordDetail {
  id: string;
  kanji: string | null;
  kana: string;
  isCommon: boolean;
  examples: WordExample[];
  senses: WordSense[];
}
