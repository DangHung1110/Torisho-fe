// src/components/Dictionary/SearchResultList.tsx
import { Noto_Sans_JP } from 'next/font/google';
import { WordSearchResult } from '../../types/dictionary';

const notoSansJp = Noto_Sans_JP({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
});

interface SearchResultListProps {
	results: WordSearchResult[];
	selectedWordId: string | null;
	isLoading: boolean;
	onSelect: (word: WordSearchResult) => void;
}

function SearchResultSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					key={`result-skeleton-${index}`}
					className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
				>
					<div className="h-6 w-20 rounded bg-slate-200" />
					<div className="mt-2 h-4 w-24 rounded bg-slate-200" />
					<div className="mt-3 h-4 w-full rounded bg-slate-200" />
				</div>
			))}
		</div>
	);
}

export default function SearchResultList({
	results,
	selectedWordId,
	isLoading,
	onSelect,
}: SearchResultListProps) {
	if (isLoading) {
		return <SearchResultSkeleton />;
	}

	if (results.length === 0) {
		return (
			<div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
				<div className="text-3xl">(o_o)</div>
				<p className="mt-3 text-sm font-medium text-slate-700">No words found</p>
				<p className="mt-1 text-xs text-slate-500">
					Try another keyword or shorter Japanese phrase.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{results.map((word) => {
				const isActive = selectedWordId === word.id;

				return (
					<button
						key={word.id}
						type="button"
						onClick={() => onSelect(word)}
						className={[
							'w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-md',
							isActive
								? 'border-l-4 border-l-blue-500 bg-blue-50/50'
								: 'hover:border-blue-200',
						].join(' ')}
					>
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0">
								<p className={`${notoSansJp.className} text-xl font-bold tracking-wide leading-relaxed text-slate-800`}>
									{word.kanji ?? word.kana}
								</p>
								<p className={`${notoSansJp.className} mt-1 text-xs leading-relaxed text-slate-400`}>
									{word.kana}
								</p>
							</div>
						</div>

						<p className="mt-3 line-clamp-1 text-sm text-slate-600">{word.primaryMeaning}</p>
					</button>
				);
			})}
		</div>
	);
}

