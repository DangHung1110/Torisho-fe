export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string | null;
  folderId?: string | null;
  folderName?: string | null;
  totalItems: number;
  createdAt: string;
}

export interface FlashcardFolder {
  id: string;
  name: string;
  description?: string | null;
  displayOrder: number;
  totalDecks: number;
  createdAt: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  sourceType: string;
  isFavorite: boolean;
  position: number;
}

export interface CreateFlashcardDeckRequest {
  name: string;
  description?: string | null;
  folderId?: string | null;
}

export interface CreateFlashcardFolderRequest {
  name: string;
  description?: string | null;
  displayOrder?: number;
}

export interface AddFromDictionaryRequest {
  dictionaryEntryId: string;
  includeTatoebaExamples?: boolean;
  maxTatoebaExamples?: number;
}

export interface CreateDeckResponse {
  deckId: string;
}

export interface AddFlashcardItemResponse {
  flashcardItemId: string;
}
