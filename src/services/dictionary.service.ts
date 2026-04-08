import { api } from '../libs/api-client';
import {
	CreateDictionaryCommentRequest,
	DictionaryComment,
	UpdateDictionaryCommentRequest,
	WordDetail,
	WordSearchResult,
} from '../types/dictionary';

const DICTIONARY_ENDPOINT = '/dictionary';

function buildCommentPayload(request: CreateDictionaryCommentRequest) {
	const content = request.content.trim();
	if (!content) {
		throw new Error('Comment content is required');
	}

	return {
		content,
		parentCommentId: request.parentCommentId ?? null,
	};
}

function buildUpdateCommentPayload(request: UpdateDictionaryCommentRequest) {
	const content = request.content.trim();
	if (!content) {
		throw new Error('Comment content is required');
	}

	return { content };
}

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

	async getComments(id: string): Promise<DictionaryComment[]> {
		const detail = await api.get<WordDetail>(`${DICTIONARY_ENDPOINT}/${id}`, {
			requiresAuth: false,
		});

		return detail.comments ?? [];
	},

	async postComment(
		id: string,
		request: CreateDictionaryCommentRequest
	): Promise<DictionaryComment> {
		return api.post<DictionaryComment>(
			`${DICTIONARY_ENDPOINT}/${id}/comments`,
			buildCommentPayload(request),
			{ requiresAuth: true }
		);
	},

	async createComment(
		id: string,
		request: CreateDictionaryCommentRequest
	): Promise<DictionaryComment> {
		return api.post<DictionaryComment>(
			`${DICTIONARY_ENDPOINT}/${id}/comments`,
			buildCommentPayload(request),
			{ requiresAuth: true }
		);
	},

	async updateComment(
		id: string,
		commentId: string,
		request: UpdateDictionaryCommentRequest
	): Promise<DictionaryComment> {
		return api.put<DictionaryComment>(
			`${DICTIONARY_ENDPOINT}/${id}/comments/${commentId}`,
			buildUpdateCommentPayload(request),
			{ requiresAuth: true }
		);
	},
};

