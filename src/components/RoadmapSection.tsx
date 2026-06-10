'use client';

import Link from 'next/link';
import {
  IconArrowRight as ArrowRight,
  IconCircleCheck as CheckCircle2,
  IconCircleDashed as CircleDotDashed,
  IconCompass as Compass,
  IconFlag as Flag,
} from '@tabler/icons-react';

const phaseFive = [
  { title: 'Quick Study', type: 'Mobile App', status: 'Planned' },
  { title: 'Adventure Dashboard alternative list view', type: 'Web & App', status: 'Planned' },
  { title: 'Study Friends section', type: 'Mobile App', status: 'Planned' },
  { title: 'JLPT mock exams - listening sections', type: 'Content', status: 'Planned' },
  { title: 'Mini Game - Shiritori', type: 'Web & App', status: 'WIP' },
  { title: 'Frequency-based study lists and dictionary info', type: 'Content', status: 'WIP' },
];

const phaseSix = [
  'Kanji and kana writing practice',
  'Daily, weekly, and permanent quests',
  'Study clans and friend groups',
  'Expert N1 content start',
  'Personal notebook system',
  'Browser lookup and mining extension',
];

const typeTone: Record<string, string> = {
  'Mobile App': 'bg-[#ffdad6] text-[#93000a]',
  'Web & App': 'bg-[#c4e7ff] text-[#004d6a]',
  Content: 'bg-[#ddf6e9] text-[#006b5f]',
};

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="bg-white py-10 sm:py-12">
      <div className="torisho-shell">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="torisho-eyebrow mb-3">Roadmap</p>
          <h2 className="torisho-section-title">What Comes Next</h2>
          <p className="torisho-section-copy mx-auto mt-3 max-w-2xl">
            The next Torisho phases focus on faster study loops, richer social practice, stronger
            JLPT coverage, and better tools for mining real Japanese.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-lg border border-[#d7c3ae] bg-[#fff8f4] p-5 shadow-[0_6px_18px_rgba(26,20,16,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#f5a623] text-white shadow-sm">
                <Flag size={30} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#835500]">Phase 5</p>
                <h3 className="torisho-display text-2xl font-semibold text-[#211a12]">
                  Traversing the Sands of Mastery
                </h3>
                <p className="mt-1 text-sm text-[#665744]">Q3 2025 to 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {phaseFive.map((item) => {
                const isWip = item.status === 'WIP';
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-md border border-[#eee0d2] bg-white px-4 py-3"
                  >
                    {isWip ? (
                      <CircleDotDashed className="mt-0.5 flex-shrink-0 text-[#f5a623]" size={18} />
                    ) : (
                      <CheckCircle2 className="mt-0.5 flex-shrink-0 text-[#3fb27f]" size={18} />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${typeTone[item.type]}`}>
                        {item.type}
                      </span>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#211a12]">{item.title}</p>
                    </div>
                    {isWip && (
                      <span className="rounded-full bg-[#fff1e4] px-2 py-1 text-[11px] font-bold text-[#835500]">
                        WIP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-lg border border-[#d7c3ae] bg-[#fffdfb] p-5 shadow-[0_6px_18px_rgba(26,20,16,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#9b72cf] text-white shadow-sm">
                <Compass size={30} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6d45a8]">Phase 6</p>
                <h3 className="torisho-display text-2xl font-semibold text-[#211a12]">
                  The Great Beyond
                </h3>
                <p className="mt-1 text-sm text-[#665744]">2026 and beyond</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {phaseSix.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-[#eee0d2] bg-[#fff8f4] px-4 py-4 text-sm font-semibold leading-6 text-[#524534] transition-colors hover:border-[#d7c3ae] hover:bg-white"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-lg bg-[#211a12] px-5 py-5 text-white">
              <h4 className="torisho-display text-2xl font-semibold">And More TBA</h4>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Future releases will keep expanding lessons, tools, and community practice.
              </p>
              <Link
                href="/register"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#291800] hover:bg-[#ffb955]"
              >
                Sign up now
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
