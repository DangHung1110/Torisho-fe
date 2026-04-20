import { api } from '../libs/api-client';
import { KanjiDetail } from '../types/kanji';

const KANJI_ENDPOINT = '/kanji';

export const kanjiService = {
  async get(character: string): Promise<KanjiDetail> {
    if (!character) throw new Error('Character is required');
    const ch = encodeURIComponent(character);
    return api.get<KanjiDetail>(`${KANJI_ENDPOINT}/${ch}`, { requiresAuth: false });
  },
};
