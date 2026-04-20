// src/components/Dictionary/WordCard.tsx
import { Noto_Sans_JP } from 'next/font/google';
import { WordSearchResult } from '../../types/dictionary';

const notoSansJp = Noto_Sans_JP({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
});

interface WordCardProps {
	word: WordSearchResult;
	size?: 'sm' | 'lg';
	isActive?: boolean;
	onClick?: () => void;
}

export default function WordCard({ word, size = 'sm', isActive = false, onClick }: WordCardProps) {
	const isLarge = size === 'lg';

	const Wrapper = onClick ? 'button' : 'div';

	return (
		<Wrapper
			type={onClick ? 'button' : undefined}
			onClick={onClick}
			className={[
				'group w-full text-left transition-all duration-200',
				isLarge
					? 'block'
					: [
							'flex items-stretch gap-4 rounded-2xl border bg-white px-5 py-4',
							isActive
								? 'border-l-[3px] border-blue-400 bg-blue-50/40 shadow-sm'
								: 'border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 hover:shadow-sm',
						].join(' '),
			].join(' ')}
		>
			{isLarge ? (
				<div className="flex flex-col items-start gap-3">
					<div className="flex items-end gap-4">
						<ruby className="not-italic">
							<span className={`${notoSansJp.className} text-7xl font-black leading-none tracking-tight text-slate-900`}>
								{word.kanji ?? word.kana}
							</span>
							{word.kanji ? (
								<rt className={`${notoSansJp.className} text-base font-medium text-slate-400`}>
									{word.kana}
								</rt>
							) : null}
						</ruby>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{word.isCommon && (
							<span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
								Common
							</span>
						)}
					</div>

					<p className="text-base font-medium text-slate-500">{word.primaryMeaning}</p>
				</div>
			) : (
				<>
					<div className="flex min-w-[64px] flex-col items-start justify-center gap-0.5">
						<span className={`${notoSansJp.className} text-2xl font-bold leading-tight text-slate-800`}>
							{word.kanji ?? word.kana}
						</span>
						{word.kanji ? (
							<span className={`${notoSansJp.className} text-xs text-slate-400`}>
								{word.kana}
							</span>
						) : null}
					</div>

					<div className="flex flex-1 flex-col justify-center gap-1.5 border-l border-slate-100 pl-4">
						{word.isCommon && (
							<span className="w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
								Common
							</span>
						)}
						<p className="line-clamp-2 text-sm leading-snug text-slate-600">
							{word.primaryMeaning}
						</p>
					</div>
				</>
			)}
		</Wrapper>
	);
}