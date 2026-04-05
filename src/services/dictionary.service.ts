import { api } from '../libs/api-client';
import {
	CreateDictionaryCommentRequest,
	DictionaryComment,
	WordDetail,
	WordSearchResult,
} from '../types/dictionary';

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

	async createComment(
		id: string,
		request: CreateDictionaryCommentRequest
	): Promise<DictionaryComment> {
		const content = request.content.trim();
		if (!content) {
			throw new Error('Comment content is required');
		}

		return api.post<DictionaryComment>(
			`${DICTIONARY_ENDPOINT}/${id}/comments`,
			{
				content,
				parentCommentId: request.parentCommentId ?? null,
			},
			{ requiresAuth: true }
		);
	},
};

