'use client';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { normalizeLegacyCommentContent } from '../../utils/commentMarkdown';

interface CommentMarkdownProps {
	content: string;
	className?: string;
	emptyText?: string;
}

export default function CommentMarkdown({
	content,
	className = '',
	emptyText,
}: CommentMarkdownProps) {
	const normalizedContent = normalizeLegacyCommentContent(content).trim();

	if (!normalizedContent) {
		if (!emptyText) return null;
		return <p className={`text-sm text-slate-400 ${className}`}>{emptyText}</p>;
	}

	return (
		<div className={className}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkBreaks]}
				skipHtml
				components={{
					p: ({ children }) => (
						<p className="mb-2 leading-relaxed last:mb-0">{children}</p>
					),
					strong: ({ children }) => (
						<strong className="font-semibold text-slate-900">{children}</strong>
					),
					em: ({ children }) => <em className="italic">{children}</em>,
					ul: ({ children }) => (
						<ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
					),
					blockquote: ({ children }) => (
						<blockquote className="mb-2 border-l-2 border-slate-300 pl-3 italic text-slate-600 last:mb-0">
							{children}
						</blockquote>
					),
					pre: ({ children }) => (
						<pre className="mb-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100 last:mb-0">
							{children}
						</pre>
					),
					code: ({ children, className: codeClassName }) => {
						const value = String(children ?? '');
						if (value.includes('\n')) {
							return <code className={codeClassName}>{children}</code>;
						}

						return (
							<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px] text-slate-800">
								{children}
							</code>
						);
					},
					a: ({ href, children }) => (
						<a
							href={href}
							target="_blank"
							rel="noreferrer noopener"
							className="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 hover:text-blue-700"
						>
							{children}
						</a>
					),
				}}
			>
				{normalizedContent}
			</ReactMarkdown>
		</div>
	);
}