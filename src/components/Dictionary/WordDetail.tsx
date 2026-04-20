// src/components/Dictionary/WordDetail.tsx
import { IconBookmark, IconVolume } from '@tabler/icons-react';
import { Noto_Sans_JP } from 'next/font/google';
import { POS_MAP } from '@/src/constants/pos_map';
import { WordDetail as WordDetailType } from '../../types/dictionary';
import WordCard from './WordCard';

const notoSansJp = Noto_Sans_JP({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
});

interface WordDetailProps {
	wordDetail: WordDetailType | null;
	isLoading: boolean;
}

function getPosLabel(pos: string) {
	return POS_MAP[pos] ?? pos;
}

function WordDetailSkeleton() {
	return (
		<div className="animate-pulse space-y-8">
			<div className="rounded-3xl bg-slate-50 p-8">
				<div className="h-16 w-40 rounded-2xl bg-slate-200" />
				<div className="mt-3 h-5 w-24 rounded bg-slate-200" />
				<div className="mt-4 h-5 w-16 rounded-full bg-slate-200" />
			</div>

			<div className="space-y-3">
				<div className="h-5 w-20 rounded bg-slate-200" />
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="rounded-2xl bg-slate-50 p-5">
						<div className="h-4 w-24 rounded-full bg-slate-200" />
						<div className="mt-3 space-y-2">
							<div className="h-3.5 w-full rounded bg-slate-200" />
							<div className="h-3.5 w-2/3 rounded bg-slate-200" />
						</div>
					</div>
				))}
			</div>

			<div className="space-y-3">
				<div className="h-5 w-24 rounded bg-slate-200" />
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="rounded-2xl border-l-4 border-slate-200 bg-slate-50 p-5">
						<div className="h-5 w-3/4 rounded bg-slate-200" />
						<div className="mt-2 h-3.5 w-1/2 rounded bg-slate-200" />
					</div>
				))}
			</div>
		</div>
	);
}

export default function WordDetail({ wordDetail, isLoading }: WordDetailProps) {
	if (isLoading) {
		return <WordDetailSkeleton />;
	}

	if (!wordDetail) {
		return (
			<div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
				<p className="text-4xl leading-none">(._.)</p>
				<p className="mt-4 text-base font-semibold text-slate-700">No word selected</p>
				<p className="mt-1 text-sm text-slate-400">Pick a word from the list to see details.</p>
			</div>
		);
	}

	const searchResult = {
		id: wordDetail.id,
		kanji: wordDetail.kanji,
		kana: wordDetail.kana,
		isCommon: wordDetail.isCommon,
		primaryMeaning: wordDetail.senses?.[0]?.glosses?.[0] ?? '',
	};

	return (
		<div className="space-y-8">
			{/* Header card - uses WordCard in large mode */}
			<section className="relative rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
				<div className="flex items-start justify-between gap-4">
					<WordCard word={searchResult} size="lg" />

					<div className="flex shrink-0 flex-col gap-2">
						<button
							type="button"
							className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
							aria-label="Listen to pronunciation"
						>
							<IconVolume size={18} stroke={1.5} />
						</button>
						<button
							type="button"
							className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-amber-300 hover:text-amber-500 hover:shadow-sm"
							aria-label="Bookmark this word"
						>
							<IconBookmark size={18} stroke={1.5} />
						</button>
					</div>
				</div>
			</section>

			{/* Senses */}
			<section className="space-y-4">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Meanings</h2>

				{wordDetail.senses.map((sense, senseIndex) => (
					<article
						key={`sense-${senseIndex}`}
						className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
					>
						<div className="mb-3 flex flex-wrap gap-1.5">
							{sense.partsOfSpeech.map((pos, posIndex) => (
								<span
									key={`pos-${posIndex}`}
									className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
								>
									{getPosLabel(pos)}
								</span>
							))}
						</div>

						<ol className="space-y-2.5">
							{sense.glosses.map((gloss, glossIndex) => (
								<li
									key={`gloss-${glossIndex}`}
									className="flex items-baseline gap-3 text-sm leading-relaxed text-slate-700"
								>
									<span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-bold text-slate-400">
										{glossIndex + 1}
									</span>
									<span>{gloss}</span>
								</li>
							))}
						</ol>
					</article>
				))}
			</section>

			{/* Examples */}
			{wordDetail.examples.length > 0 && (
				<section className="space-y-4">
					<h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Example sentences</h2>

					<div className="space-y-3">
						{wordDetail.examples.map((example, index) => (
							<article
								key={`example-${index}`}
								className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
							>
								<p className={`${notoSansJp.className} text-lg font-medium leading-relaxed text-slate-800`}>
									{example.japanese}
								</p>
								<p className="mt-2 text-sm text-slate-400 italic">{example.english}</p>
							</article>
						))}
					</div>
				</section>
			)}
		</div>
	);
}