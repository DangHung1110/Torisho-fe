// src/components/Dictionary/WordDetail.tsx

import { IconBookmark } from '@tabler/icons-react';
import { Noto_Sans_JP } from 'next/font/google';
import { POS_MAP } from '@/src/constants/pos_map';
import { WordDetail as WordDetailType } from '../../types/dictionary';

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
		<div className="animate-pulse space-y-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="h-11 w-52 rounded bg-slate-200" />
					<div className="mt-3 h-5 w-28 rounded bg-slate-200" />
				</div>
				<div className="h-10 w-10 rounded-xl bg-slate-200" />
			</div>

			<div className="space-y-3">
				{Array.from({ length: 2 }).map((_, index) => (
					<div key={`sense-skeleton-${index}`} className="rounded-2xl bg-slate-50 p-4">
						<div className="h-5 w-24 rounded bg-slate-200" />
						<div className="mt-3 h-4 w-full rounded bg-slate-200" />
						<div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
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
			<div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
				<div className="text-4xl">(._.)</div>
				<p className="mt-4 text-base font-semibold text-slate-700">No word selected</p>
				<p className="mt-1 text-sm text-slate-500">Pick one word from the left to see details.</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<section className="sticky top-0 z-10 -mx-2 mb-8 rounded-3xl border border-slate-100 bg-white/85 p-10 shadow-sm backdrop-blur-md">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className={`${notoSansJp.className} text-6xl font-black leading-relaxed text-slate-800`}>
							{wordDetail.kanji ?? wordDetail.kana}
						</h1>
						{wordDetail.kanji ? (
							<p className={`${notoSansJp.className} mt-2 text-xl leading-relaxed text-slate-500`}>
								{wordDetail.kana}
							</p>
						) : null}
						{wordDetail.isCommon ? (
							<span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
								Common Word
							</span>
						) : null}
					</div>

					<button
						type="button"
						className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600"
						aria-label="Bookmark this word"
					>
						<IconBookmark size={20} stroke={1.75} />
					</button>
				</div>
			</section>

			<section className="space-y-6">
				<h2 className="text-lg font-semibold text-slate-800">Senses</h2>
				<div>
					{wordDetail.senses.map((sense, index) => (
						<article
							key={`sense-${index}`}
							className="mb-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
						>
							<div className="mb-4 flex flex-wrap gap-2">
								{sense.partsOfSpeech.map((pos, posIndex) => (
									<span
										key={`sense-${index}-pos-${posIndex}`}
										className="rounded-full bg-blue-50/50 px-3 py-1.5 text-sm font-medium text-blue-700"
									>
										{getPosLabel(pos)}
									</span>
								))}
							</div>

							<ol className="space-y-4">
								{sense.glosses.map((gloss, glossIndex) => (
									<li key={`sense-${index}-gloss-${glossIndex}`} className="flex gap-3 text-sm leading-relaxed text-slate-700">
										<span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-300">
											{glossIndex + 1}
										</span>
										<span>{gloss}</span>
									</li>
								))}
							</ol>
						</article>
					))}
				</div>
			</section>

			<section className="space-y-6">
				<h2 className="text-lg font-semibold text-slate-800">Examples</h2>
				<div className="space-y-4">
					{wordDetail.examples.map((example, index) => (
						<article
							key={`example-${index}`}
							className="rounded-2xl border-l-4 border-slate-200 bg-white p-8 shadow-sm"
						>
							<p className={`${notoSansJp.className} text-xl font-medium leading-relaxed text-slate-800`}>
								{example.japanese}
							</p>
							<p className="mt-3 text-sm italic text-slate-500">{example.english}</p>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}

