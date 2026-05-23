'use client';

import Link from 'next/link';
import {
  IconArrowRight as ArrowRight,
  IconCompass as Compass,
  IconFlame as Flame,
  IconLeaf as Sprout,
  IconMountain as Mountain,
  IconWaveSine as Waves,
} from '@tabler/icons-react';

const adventures = [
  {
    title: 'Isle of New Beginnings',
    subtitle: 'PRE-N5 foundations',
    description:
      'Acquire the vital skills needed to start your journey: kana, pronunciation basics, and the first grammar patterns that make Japanese readable.',
    image: '/images/adventure/pre-n5-banner.svg',
    color: '#f5a623',
    Icon: Flame,
  },
  {
    title: 'Fledgling Forest',
    subtitle: 'N5 beginner route',
    description:
      'Turn polished fundamentals into real progress with essential kanji, vocabulary, grammar, and guided lessons that keep you moving step by step.',
    image: '/images/adventure/n5-banner.svg',
    color: '#3fb27f',
    Icon: Sprout,
  },
  {
    title: 'Depths of Devotion',
    subtitle: 'N4 deeper study',
    description:
      'Dive into denser grammar and vocabulary, then reinforce everything with reading exercises, quizzes, and unlocks that connect to your path.',
    image: '/images/adventure/n4-banner.svg',
    color: '#5b9bd5',
    Icon: Waves,
  },
  {
    title: 'Jungle of Tenacity',
    subtitle: 'N3 intermediate climb',
    description:
      'Push into intermediate Japanese with broader reading, stronger kanji coverage, and patterns that make your sentences sound more natural.',
    image: '/images/adventure/n3-banner.svg',
    color: '#9b72cf',
    Icon: Mountain,
  },
];

export default function AdventureSection() {
  return (
    <section id="adventure" className="relative overflow-hidden bg-white py-12 sm:py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-[#d7c3ae]" />
      <div className="torisho-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="torisho-eyebrow mb-3">Adventure</p>
          <h2 className="torisho-section-title">Adventure Awaits</h2>
          <p className="torisho-section-copy mx-auto mt-3 max-w-2xl">
            Explore islands filled with grammar lessons, reading exercises, kanji, vocabulary
            unlocks, and daily review moments.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-8 bottom-8 hidden w-px bg-[#d7c3ae] lg:left-1/2 lg:block" />
          <div className="space-y-8 lg:space-y-6">
            {adventures.map((adventure, index) => {
              const Icon = adventure.Icon;
              const reverse = index % 2 === 1;

              return (
                <article
                  key={adventure.title}
                  className={`relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                    reverse ? 'lg:[&>div:first-child]:order-2' : ''
                  }`}
                >
                  <div className="flex justify-center">
                    <div
                      className="relative h-[230px] w-[230px] overflow-hidden rounded-full border-8 border-white shadow-[0_16px_38px_rgba(54,37,20,0.16)] ring-1 ring-[#eee0d2] sm:h-[270px] sm:w-[270px]"
                      style={{
                        background:
                          `linear-gradient(135deg, ${adventure.color}cc, rgba(255,248,244,0.58)), url(${adventure.image}) center/cover no-repeat`,
                      }}
                    >
                      <div className="absolute inset-0 bg-white/12" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur">
                          <Icon size={42} color={adventure.color} stroke={1.8} />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`mx-auto max-w-[520px] text-center lg:mx-0 ${reverse ? 'lg:text-right' : 'lg:text-left'}`}>
                    <p className="torisho-eyebrow mb-3">
                      {adventure.subtitle}
                    </p>
                    <h3 className="torisho-display text-3xl font-semibold leading-tight text-[#211a12] sm:text-[34px]">
                      {adventure.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#665744]">{adventure.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-lg bg-[#006b5f] shadow-[0_16px_30px_rgba(0,79,70,0.18)]">
          <div className="grid grid-cols-1 items-center gap-6 px-6 py-7 text-white sm:px-10 lg:grid-cols-[1fr_auto] lg:px-10">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#62fae3]">
                <Compass size={18} />
                Start the route
              </div>
              <h3 className="torisho-display text-3xl font-semibold sm:text-4xl">
                Learn Japanese one guided zone at a time.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                Torisho keeps lessons, quizzes, flashcards, and progress tracking in one connected
                adventure.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] transition-all hover:-translate-y-0.5 hover:bg-[#ffb955]"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
