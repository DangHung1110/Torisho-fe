import { api } from '../libs/api-client';
import { WordDetail, WordSearchResult } from '../types/dictionary';

const DICTIONARY_ENDPOINT = '/dictionary';

export const dictionaryService = {
	async search(keyword: string): Promise<WordSearchResult[]> {
		const trimmedKeyword = keyword.trim();
		if (!trimmedKeyword) {
			return [];
		}

		const query = encodeURIComponent(trimmedKeyword);
		return api.get<WordSearchResult[]>(
			`${DICTIONARY_ENDPOINT}/search?keyword=${query}`,
			{ requiresAuth: false }
		);
	},

	async getDetail(id: string): Promise<WordDetail> {
		return api.get<WordDetail>(`${DICTIONARY_ENDPOINT}/${id}`, {
			requiresAuth: false,
		});
	},
};

