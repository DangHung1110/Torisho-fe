// src/components/Dictionary/SearchResultList.tsx
import { WordSearchResult } from '../../types/dictionary';
import WordCard from './WordCard';

interface SearchResultListProps {
	results: WordSearchResult[];
	selectedWordId: string | null;
	isLoading: boolean;
	onSelect: (word: WordSearchResult) => void;
}

function SearchResultSkeleton() {
	return (
		<div className="animate-pulse space-y-2">
			{Array.from({ length: 5 }).map((_, index) => (
				<div
					key={`result-skeleton-${index}`}
					className="flex items-stretch gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4"
				>
					<div className="flex flex-col gap-1.5">
						<div className="h-7 w-14 rounded-lg bg-slate-200" />
						<div className="h-3 w-10 rounded bg-slate-100" />
					</div>
					<div className="flex flex-1 flex-col justify-center gap-2 border-l border-slate-100 pl-4">
						<div className="h-3 w-12 rounded-full bg-slate-100" />
						<div className="h-4 w-3/4 rounded bg-slate-200" />
					</div>
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
			<div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
				<p className="text-3xl leading-none">(o_o)</p>
				<p className="mt-3 text-sm font-semibold text-slate-700">No words found</p>
				<p className="mt-1 text-xs text-slate-400">
					Try another keyword or shorter phrase.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{results.map((word) => (
				<WordCard
					key={word.id}
					word={word}
					size="sm"
					isActive={selectedWordId === word.id}
					onClick={() => onSelect(word)}
				/>
			))}
		</div>
	);
}