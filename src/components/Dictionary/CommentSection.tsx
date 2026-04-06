'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	CreateDictionaryCommentRequest,
	DictionaryComment,
} from '../../types/dictionary';
import {
	buildCommentTree,
	flattenCommentTree,
	insertCommentIntoTree,
} from '../../utils/commentTree';
import {
	formatCommentTime,
	getAvatarColour,
	getUserInitial,
} from '../../utils/formatTime';

export interface CommentSectionCurrentUser {
	id: string;
	fullName: string;
	avatarUrl?: string | null;
}

interface CommentSectionProps {
	wordId: string;
	currentUser: CommentSectionCurrentUser | null;
	fetchComments: (wordId: string) => Promise<DictionaryComment[]>;
	postComment: (
		wordId: string,
		request: CreateDictionaryCommentRequest
	) => Promise<DictionaryComment>;
}

interface ComposeBoxProps {
	currentUser: CommentSectionCurrentUser | null;
	placeholder: string;
	submitLabel: string;
	isSubmitting: boolean;
	onSubmit: (content: string) => Promise<void>;
	onCancel?: () => void;
	compact?: boolean;
}

interface UserAvatarProps {
	name: string;
	avatarUrl?: string | null;
	size?: 'sm' | 'md';
}

function UserAvatar({ name, avatarUrl, size = 'md' }: UserAvatarProps) {
	const sizeClass = size === 'sm' ? 'h-7 w-7 text-[11px]' : 'h-9 w-9 text-xs';

	if (avatarUrl) {
		return (
			<span
				aria-label={name}
				className={`inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 ${sizeClass}`}
				style={{ backgroundImage: `url(${avatarUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
			/>
		);
	}

	return (
		<span
			className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${sizeClass} ${getAvatarColour(name)}`}
		>
			{getUserInitial(name)}
		</span>
	);
}

function ComposeBox({
	currentUser,
	placeholder,
	submitLabel,
	isSubmitting,
	onSubmit,
	onCancel,
	compact = false,
}: ComposeBoxProps) {
	const [content, setContent] = useState('');
	const trimmedContent = content.trim();

	const handleSubmit = useCallback(async () => {
		if (!currentUser || !trimmedContent || isSubmitting) return;
		try {
			await onSubmit(trimmedContent);
			setContent('');
		} catch {
			// Keep content so users can retry
		}
	}, [currentUser, isSubmitting, onSubmit, trimmedContent]);

	if (!currentUser) {
		return (
			<div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
				<Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
					Log in
				</Link>{' '}
				to write a comment.
			</div>
		);
	}

	return (
		<div className={compact ? 'pl-1' : ''}>
			<div className="flex items-start gap-2.5">
				{!compact && (
					<UserAvatar name={currentUser.fullName} avatarUrl={currentUser.avatarUrl} />
				)}
				<div className="flex-1 space-y-2">
					<textarea
						value={content}
						autoFocus={compact}
						onChange={(e) => setContent(e.target.value)}
						onKeyDown={(e) => {
							if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
								e.preventDefault();
								void handleSubmit();
							}
						}}
						placeholder={placeholder}
						rows={compact ? 2 : 3}
						className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
					/>
					<div className="flex items-center justify-end gap-2">
						{!compact && (
							<p className="mr-auto text-xs text-slate-400">Cmd/Ctrl + Enter to submit</p>
						)}
						{onCancel && (
							<button
								type="button"
								onClick={onCancel}
								className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
							>
								Cancel
							</button>
						)}
						<button
							type="button"
							onClick={() => void handleSubmit()}
							disabled={!trimmedContent || isSubmitting}
							className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							{isSubmitting ? 'Posting...' : submitLabel}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// Count all descendants recursively (not just direct replies)
function countDescendants(comment: DictionaryComment): number {
	return comment.replies.reduce(
		(acc, reply) => acc + 1 + countDescendants(reply),
		0,
	);
}

interface CommentNodeProps {
	comment: DictionaryComment;
	currentUser: CommentSectionCurrentUser | null;
	onReply: (parentCommentId: string, content: string) => Promise<void>;
	postingReplyTo: string | null;
	depth: number;
}

function CommentNode({
	comment,
	currentUser,
	onReply,
	postingReplyTo,
	depth,
}: CommentNodeProps) {
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [showReplies, setShowReplies] = useState(true);

	const hasReplies = comment.replies.length > 0;
	const totalDescendants = countDescendants(comment);
	const authorName = comment.userFullName || 'Unknown';

	return (
		<div className="flex gap-2.5">
			{/* Avatar + vertical thread line */}
			<div className="flex flex-col items-center">
				<UserAvatar
					name={authorName}
					avatarUrl={comment.userAvatarUrl}
					size={depth === 0 ? 'md' : 'sm'}
				/>
				{hasReplies && showReplies && (
					<div className="mt-1.5 w-px flex-1 bg-slate-200" />
				)}
			</div>

			{/* Content column */}
			<div className="min-w-0 flex-1 pb-1">
				{/* Bubble */}
				<div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
					<div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
						<span className="text-[13px] font-semibold text-slate-800">{authorName}</span>
						<span className="text-[11px] text-slate-400">{formatCommentTime(comment.createdAt)}</span>
						{comment.isEdited && !comment.isDeleted && (
							<span className="text-[11px] text-slate-400">· Edited</span>
						)}
					</div>
					<p className={`text-sm leading-relaxed ${comment.isDeleted ? 'italic text-slate-400' : 'text-slate-700'}`}>
						{comment.isDeleted ? 'This comment was deleted.' : comment.content}
					</p>
				</div>

				{/* Actions */}
				<div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 px-1">
					{!comment.isDeleted && currentUser && (
						<button
							type="button"
							onClick={() => setShowReplyBox((v) => !v)}
							className="text-xs font-semibold text-slate-400 transition hover:text-blue-600"
						>
							{showReplyBox ? 'Cancel' : 'Reply'}
						</button>
					)}
					{hasReplies && (
						<button
							type="button"
							onClick={() => setShowReplies((v) => !v)}
							className="text-xs font-semibold text-slate-400 transition hover:text-slate-700"
						>
							{showReplies
								? `Hide replies (${totalDescendants})`
								: `Show replies (${totalDescendants})`}
						</button>
					)}
				</div>

				{/* Inline reply compose */}
				{showReplyBox && currentUser && (
					<div className="mt-2.5">
						<ComposeBox
							currentUser={currentUser}
							placeholder={`Reply to ${authorName}…`}
							submitLabel="Reply"
							isSubmitting={postingReplyTo === comment.id}
							compact
							onSubmit={async (content) => {
								await onReply(comment.id, content);
								setShowReplyBox(false);
								setShowReplies(true);
							}}
							onCancel={() => setShowReplyBox(false)}
						/>
					</div>
				)}

				{/* Nested replies */}
				{hasReplies && showReplies && (
					<div className="mt-3 space-y-3">
						{comment.replies.map((reply) => (
							<CommentNode
								key={reply.id}
								comment={reply}
								currentUser={currentUser}
								onReply={onReply}
								postingReplyTo={postingReplyTo}
								depth={depth + 1}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function CommentsSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex gap-2.5">
					<div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />
					<div className="flex-1 rounded-xl border border-slate-100 bg-white px-4 py-3">
						<div className="mb-2 h-3 w-32 rounded bg-slate-200" />
						<div className="space-y-1.5">
							<div className="h-3.5 w-full rounded bg-slate-100" />
							<div className="h-3.5 w-4/5 rounded bg-slate-100" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default function CommentSection({
	wordId,
	currentUser,
	fetchComments,
	postComment,
}: CommentSectionProps) {
	const [comments, setComments] = useState<DictionaryComment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPostingRoot, setIsPostingRoot] = useState(false);
	const [postingReplyTo, setPostingReplyTo] = useState<string | null>(null);

	const totalComments = useMemo(() => flattenCommentTree(comments).length, [comments]);

	const loadComments = useCallback(async () => {
		if (!wordId) {
			setComments([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const fetched = await fetchComments(wordId);
			setComments(buildCommentTree(Array.isArray(fetched) ? fetched : []));
		} catch (err) {
			setComments([]);
			setError(err instanceof Error ? err.message : 'Unable to load comments.');
		} finally {
			setIsLoading(false);
		}
	}, [fetchComments, wordId]);

	useEffect(() => { void loadComments(); }, [loadComments]);

	const handlePost = useCallback(
		async (content: string, parentCommentId: string | null) => {
			setError(null);
			if (parentCommentId) setPostingReplyTo(parentCommentId);
			else setIsPostingRoot(true);
			try {
				const created = await postComment(wordId, { content, parentCommentId });
				setComments((existing) => insertCommentIntoTree(existing, created));
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unable to post comment.');
				throw err;
			} finally {
				if (parentCommentId) setPostingReplyTo(null);
				else setIsPostingRoot(false);
			}
		},
		[postComment, wordId],
	);

	return (
		<section className="space-y-5">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
					Comments ({totalComments})
				</h2>
				<button
					type="button"
					onClick={() => void loadComments()}
					className="text-xs font-semibold text-slate-400 transition hover:text-slate-700"
				>
					Refresh
				</button>
			</div>

			<ComposeBox
				currentUser={currentUser}
				placeholder="Write your comment…"
				submitLabel="Comment"
				isSubmitting={isPostingRoot}
				onSubmit={(content) => handlePost(content, null)}
			/>

			{error && (
				<p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</p>
			)}

			{isLoading ? (
				<CommentsSkeleton />
			) : comments.length === 0 ? (
				<div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
					No comments yet. Start the discussion.
				</div>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => (
						<CommentNode
							key={comment.id}
							comment={comment}
							currentUser={currentUser}
							onReply={(parentId, content) => handlePost(content, parentId)}
							postingReplyTo={postingReplyTo}
							depth={0}
						/>
					))}
				</div>
			)}
		</section>
	);
}