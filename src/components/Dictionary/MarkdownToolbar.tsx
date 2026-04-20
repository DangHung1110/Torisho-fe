'use client';

import {
	type MarkdownToolbarAction,
} from '../../utils/commentMarkdown';

interface ToolbarButtonConfig {
	action: MarkdownToolbarAction;
	label: string;
	icon: string;
	shortcut: string;
	showInCompact?: boolean;
}

const TOOLBAR_BUTTONS: ToolbarButtonConfig[] = [
	{ action: 'bold', label: 'Bold', icon: 'B', shortcut: 'Ctrl/Cmd+B', showInCompact: true },
	{ action: 'italic', label: 'Italic', icon: 'I', shortcut: 'Ctrl/Cmd+I', showInCompact: true },
	{ action: 'link', label: 'Link', icon: 'Link', shortcut: 'Ctrl/Cmd+K', showInCompact: true },
	{ action: 'quote', label: 'Quote', icon: 'Quote', shortcut: 'Ctrl/Cmd+Shift+Q' },
	{ action: 'unordered-list', label: 'Bullet List', icon: 'UL', shortcut: 'Ctrl/Cmd+Shift+8' },
	{ action: 'ordered-list', label: 'Numbered List', icon: 'OL', shortcut: 'Ctrl/Cmd+Shift+7' },
	{ action: 'inline-code', label: 'Inline Code', icon: '</>', shortcut: 'Ctrl/Cmd+`' },
	{ action: 'code-block', label: 'Code Block', icon: '{ }', shortcut: 'Ctrl/Cmd+Shift+C' },
];

interface MarkdownToolbarProps {
	onAction: (action: MarkdownToolbarAction) => void;
	compact?: boolean;
	onTogglePreview?: () => void;
	isPreviewVisible?: boolean;
}

export default function MarkdownToolbar({
	onAction,
	compact = false,
	onTogglePreview,
	isPreviewVisible = false,
}: MarkdownToolbarProps) {
	const buttons = compact
		? TOOLBAR_BUTTONS.filter((button) => button.showInCompact)
		: TOOLBAR_BUTTONS;

	return (
		<div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
			{buttons.map((button) => (
				<button
					key={button.action}
					type="button"
					onClick={() => onAction(button.action)}
					title={`${button.label} (${button.shortcut})`}
					aria-label={button.label}
					className="rounded-md border border-transparent px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
				>
					{button.icon}
				</button>
			))}
			{onTogglePreview && (
				<button
					type="button"
					onClick={onTogglePreview}
					className={`ml-auto rounded-md border px-2 py-1 text-[11px] font-semibold transition ${
						isPreviewVisible
							? 'border-blue-200 bg-blue-50 text-blue-700'
							: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
					}`}
				>
					{isPreviewVisible ? 'Hide preview' : 'Preview'}
				</button>
			)}
		</div>
	);
}