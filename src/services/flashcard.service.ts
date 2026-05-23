import { api } from '../libs/api-client';
import {
  AddFlashcardItemResponse,
  AddFromDictionaryRequest,
  CreateDeckResponse,
  CreateFlashcardDeckRequest,
  CreateFlashcardFolderRequest,
  FlashcardDeck,
  FlashcardFolder,
  FlashcardItem,
} from '../types/flashcard';

export class FlashcardService {
  static async getDecks(folderId?: string | null): Promise<FlashcardDeck[]> {
    const query = folderId ? `?folderId=${encodeURIComponent(folderId)}` : '';
    return api.get<FlashcardDeck[]>(`/flashcards/decks${query}`);
  }

  static async getDeck(deckId: string): Promise<FlashcardDeck> {
    return api.get<FlashcardDeck>(`/flashcards/decks/${deckId}`);
  }

  static async createDeck(request: CreateFlashcardDeckRequest): Promise<CreateDeckResponse> {
    return api.post<CreateDeckResponse>('/flashcards/decks', request);
  }

  static async getFolders(): Promise<FlashcardFolder[]> {
    return api.get<FlashcardFolder[]>('/flashcards/folders');
  }

  static async createFolder(request: CreateFlashcardFolderRequest): Promise<{ folderId: string }> {
    return api.post<{ folderId: string }>('/flashcards/folders', request);
  }

  static async getDeckItems(deckId: string): Promise<FlashcardItem[]> {
    return api.get<FlashcardItem[]>(`/flashcards/decks/${deckId}/items`);
  }

  static async addFromDictionary(
    deckId: string,
    request: AddFromDictionaryRequest
  ): Promise<AddFlashcardItemResponse> {
    return api.post<AddFlashcardItemResponse>(
      `/flashcards/decks/${deckId}/items`,
      {
        includeTatoebaExamples: true,
        maxTatoebaExamples: 2,
        ...request,
      }
    );
  }
}
