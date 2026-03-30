'use client';

import { Container, Title, Text, Paper, Button, Box } from '@mantine/core';
import Link from 'next/link';

const adventures = [
  {
    title: 'Isle of New Beginnings',
    subtitle: 'Learn to make fire',
    description: 'Here you will acquire vital skills that are necessary to start your journey, and set yourself up for success by mastering the foundational elements of Japanese, including hiragana and katakana.',
    gradient: 'from-orange-300 via-amber-200 to-cyan-300',
    svgPath: (
      // Island / sun icon
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="22" r="10" fill="white" fillOpacity="0.9" />
        <line x1="32" y1="6" x2="32" y2="2" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="42" x2="32" y2="46" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="22" x2="12" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="22" x2="52" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="20.7" y1="10.7" x2="17.9" y2="7.9" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="43.3" y1="33.3" x2="46.1" y2="36.1" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="43.3" y1="10.7" x2="46.1" y2="7.9" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="20.7" y1="33.3" x2="17.9" y2="36.1" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 46 Q32 38 50 46 Q44 58 20 58 Q10 58 14 46Z" fill="white" fillOpacity="0.85" />
        <path d="M8 52 Q32 46 56 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Fledgling Forest',
    subtitle: 'Explore the forest',
    description: 'Put your polished fundamentals to use, as you learn essential kanji, vocabulary and grammar. Many learners get lost in the forest of beginner Japanese, but our hand-crafted lessons will guide you through. Step by step.',
    gradient: 'from-green-400 via-emerald-300 to-green-600',
    svgPath: (
      // Tree / shrine icon
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 6 L10 30 H22 L14 46 H50 L42 30 H54 Z" fill="white" fillOpacity="0.9" />
        <rect x="27" y="46" width="10" height="12" rx="2" fill="white" fillOpacity="0.7" />
      </svg>
    ),
  },
  {
    title: 'Depths of Devotion',
    subtitle: 'Take a deep dive',
    description: 'Here you will take what you have learned and go deeper, exploring a deep-sea world of grammar and vocabulary that you never even knew existed! Come face-to-face with the deep sea leviathans of sonkeigo and kenjougo, and ultimately defeat them!',
    gradient: 'from-blue-400 via-cyan-400 to-blue-600',
    svgPath: (
      // Wave / ocean icon
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 30 Q12 22 20 30 Q28 38 36 30 Q44 22 52 30 Q58 36 62 30" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
        <path d="M4 42 Q12 34 20 42 Q28 50 36 42 Q44 34 52 42 Q58 48 62 42" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.65" />
        <circle cx="32" cy="18" r="7" fill="white" fillOpacity="0.85" />
        <path d="M26 18 Q32 12 38 18" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Jungle of Tenacity',
    subtitle: 'Welcome to the jungle',
    description: 'This is the intermediate "jungle" of Japanese, where your Japanese knowledge really starts to take off! You will reach a total of ~1050 kanji and ~4000 vocabulary learned, as well as learn grammar like わけ and ものだ that will get you speaking like a native!',
    gradient: 'from-purple-400 via-indigo-400 to-purple-600',
    svgPath: (
      // Mountain / peak icon
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8 L6 52 H58 Z" fill="white" fillOpacity="0.9" />
        <path d="M46 24 L28 52 H64 Z" fill="white" fillOpacity="0.65" />
        <path d="M26 16 L32 8 L38 16 Q35 14 32 16 Q29 14 26 16Z" fill="white" fillOpacity="0.5" />
      </svg>
    ),
  },
];

export default function AdventureSection() {
  return (
    <section id="explore" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <Container size="xl" className="relative z-10 px-6">

        {/* Section header */}
        <div className="text-center mb-20">
          <Title
            order={2}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight"
          >
            Adventure Awaits
          </Title>
          <Text size="xl" c="dimmed" className="mb-3 font-medium">
            Come explore our islands!
          </Text>
          <Text size="lg" className="max-w-3xl mx-auto leading-relaxed text-gray-600">
            They are filled to the brim with{' '}
            <strong className="text-gray-900 font-bold">grammar lessons</strong>,{' '}
            <strong className="text-gray-900 font-bold">reading exercises</strong>,{' '}
            <strong className="text-gray-900 font-bold">kanji &amp; vocabulary unlocks</strong>{' '}
            <span className="text-gray-400">and so much more!</span>
          </Text>
        </div>

        {/* Alternating adventure blocks */}
        <div className="relative">
          {/* Desktop dashed line */}
          <svg
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[500px] h-full -z-10 pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <path
              d="M 250 80 C 250 180, 80 180, 80 320 C 80 460, 420 460, 420 600 C 420 740, 80 740, 80 880 C 80 1020, 420 1020, 420 1160 C 420 1280, 250 1300, 250 1380"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="5"
              strokeDasharray="14 14"
              strokeLinecap="round"
            />
          </svg>

          {/* Mobile dashed line */}
          <div className="absolute left-6 top-8 bottom-8 w-0 border-l-[3px] border-dashed border-gray-200 lg:hidden" />

          <div className="space-y-24 md:space-y-28">
            {adventures.map((adventure, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center group`}
              >
                {/* Gradient circle with SVG icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full bg-gradient-to-br ${adventure.gradient} shadow-[0_16px_48px_rgba(0,0,0,0.18)] flex items-center justify-center relative overflow-hidden transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500 ease-out border-8 border-white ring-1 ring-gray-100 cursor-pointer`}
                  >
                    <Box className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="z-10 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      {adventure.svgPath}
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <Paper
                  shadow="none"
                  radius="xl"
                  className={`flex-1 max-w-lg text-center lg:text-left bg-transparent py-6 ${index % 2 !== 0 ? 'lg:text-right' : ''}`}
                >
                  <Text
                    size="xs"
                    fw={800}
                    className="mb-3 uppercase tracking-[0.15em] text-blue-500"
                  >
                    {adventure.subtitle}
                  </Text>

                  <Title
                    order={3}
                    className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight"
                  >
                    {adventure.title}
                  </Title>

                  <Text size="lg" className="text-gray-600 leading-relaxed font-medium">
                    {adventure.description}
                  </Text>
                </Paper>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-28 md:mt-36 mb-6">
          <Paper
            radius="3rem"
            className="relative overflow-hidden bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-center text-white shadow-2xl transition-shadow hover:shadow-green-500/20"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-black/5 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-14 sm:px-10 md:px-14 md:py-16 lg:py-20 gap-4">
              <Title
                order={3}
                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-sm"
              >
                Start Learning Japanese
              </Title>
              <Text className="text-lg md:text-xl font-medium text-green-50/95">
                Join thousands of other students today!
              </Text>
              <Button
                component={Link}
                href="/register"
                size="lg"
                radius="xl"
                variant="white"
                color="green"
                className="mt-2 h-14 px-10 text-base font-bold text-green-700 shadow-xl transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-pointer md:h-16 md:px-12 md:text-lg"
              >
                Get Started →
              </Button>
            </div>
          </Paper>
        </div>

      </Container>
    </section>
  );
}
