export type MarkdownToolbarAction =
	| 'bold'
	| 'italic'
	| 'link'
	| 'quote'
	| 'unordered-list'
	| 'ordered-list'
	| 'inline-code'
	| 'code-block';

interface MarkdownTextState {
	value: string;
	selectionStart: number;
	selectionEnd: number;
}

interface MarkdownTextUpdate {
	value: string;
	selectionStart: number;
	selectionEnd: number;
}

interface ShortcutInput {
	key: string;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
}

const HTML_ENTITY_MAP: Record<string, string> = {
	'&nbsp;': ' ',
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': "'",
};

function decodeCommonHtmlEntities(value: string): string {
	return value.replace(/&(nbsp|amp|lt|gt|quot|#39);/g, (entity) => HTML_ENTITY_MAP[entity] ?? entity);
}

function replaceSelection(
	state: MarkdownTextState,
	replacement: string,
	nextSelectionStart: number,
	nextSelectionEnd: number,
): MarkdownTextUpdate {
	const before = state.value.slice(0, state.selectionStart);
	const after = state.value.slice(state.selectionEnd);

	return {
		value: `${before}${replacement}${after}`,
		selectionStart: nextSelectionStart,
		selectionEnd: nextSelectionEnd,
	};
}

function wrapSelection(
	state: MarkdownTextState,
	prefix: string,
	suffix: string,
	placeholder: string,
): MarkdownTextUpdate {
	const hasSelection = state.selectionStart !== state.selectionEnd;
	const selectedText = state.value.slice(state.selectionStart, state.selectionEnd);
	const innerText = hasSelection ? selectedText : placeholder;
	const replacement = `${prefix}${innerText}${suffix}`;
	const selectionStart = state.selectionStart + prefix.length;
	const selectionEnd = selectionStart + innerText.length;

	return replaceSelection(state, replacement, selectionStart, selectionEnd);
}

function prefixSelectedLines(
	state: MarkdownTextState,
	prefixBuilder: (index: number) => string,
	fallbackLine: string,
): MarkdownTextUpdate {
	const hasSelection = state.selectionStart !== state.selectionEnd;
	const selectedText = hasSelection
		? state.value.slice(state.selectionStart, state.selectionEnd)
		: fallbackLine;
	const normalized = selectedText.replace(/\r\n?/g, '\n');
	const lines = normalized.split('\n');
	const replacement = lines.map((line, index) => `${prefixBuilder(index)}${line}`).join('\n');
	const selectionStart = state.selectionStart;
	const selectionEnd = selectionStart + replacement.length;

	return replaceSelection(state, replacement, selectionStart, selectionEnd);
}

export function normalizeLegacyCommentContent(rawContent: string): string {
	if (!rawContent) return '';

	let normalized = rawContent.replace(/\r\n?/g, '\n');
	if (!/<[a-z][\s\S]*>/i.test(normalized)) {
		return normalized;
	}

	normalized = normalized
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/?p[^>]*>/gi, '\n\n')
		.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
		.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
		.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
		.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
		.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```')
		.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
		.replace(/<li>([\s\S]*?)<\/li>/gi, '- $1\n')
		.replace(/<\/?(ul|ol)[^>]*>/gi, '\n')
		.replace(/<[^>]+>/g, '');

	return decodeCommonHtmlEntities(normalized)
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export function applyMarkdownAction(
	state: MarkdownTextState,
	action: MarkdownToolbarAction,
): MarkdownTextUpdate {
	switch (action) {
		case 'bold':
			return wrapSelection(state, '**', '**', 'bold text');
		case 'italic':
			return wrapSelection(state, '*', '*', 'italic text');
		case 'link':
			return wrapSelection(state, '[', '](https://)', 'link text');
		case 'inline-code':
			return wrapSelection(state, '`', '`', 'code');
		case 'code-block':
			return wrapSelection(state, '```\n', '\n```', 'code');
		case 'quote':
			return prefixSelectedLines(state, () => '> ', 'Quoted text');
		case 'unordered-list':
			return prefixSelectedLines(state, () => '- ', 'List item');
		case 'ordered-list':
			return prefixSelectedLines(state, (lineIndex) => `${lineIndex + 1}. `, 'List item');
		default:
			return state;
	}
}

export function getMarkdownActionFromShortcut(input: ShortcutInput): MarkdownToolbarAction | null {
	const hasPrimaryModifier = input.ctrlKey || input.metaKey;
	if (!hasPrimaryModifier || input.altKey) return null;

	const key = input.key.toLowerCase();
	if (input.shiftKey) {
		if (key === '8') return 'unordered-list';
		if (key === '7') return 'ordered-list';
		if (key === 'q') return 'quote';
		if (key === 'c') return 'code-block';
		return null;
	}

	if (key === 'b') return 'bold';
	if (key === 'i') return 'italic';
	if (key === 'k') return 'link';
	if (key === '`') return 'inline-code';

	return null;
}