export interface WordSearchResult {
  id: string;
  kanji: string | null;
  kana: string;
  primaryMeaning: string;
  matchedReading?: string | null;
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

export interface DictionaryComment {
  id: string;
  userId: string;
  userFullName: string;
  userAvatarUrl: string | null;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
  replies: DictionaryComment[];
}

export interface CreateDictionaryCommentRequest {
  content: string;
  parentCommentId?: string | null;
}

export interface UpdateDictionaryCommentRequest {
  content: string;
}

export interface WordDetail {
  id: string;
  kanji: string | null;
  kana: string;
  isCommon: boolean;
  comments: DictionaryComment[];
  examples: WordExample[];
  senses: WordSense[];
}
