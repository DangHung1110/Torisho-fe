'use client';

import { Container, Title, Text, SimpleGrid, ThemeIcon, Paper, Button, Box } from '@mantine/core';

const adventures = [
  {
    title: 'Isle of New Beginnings',
    subtitle: 'Learn to make fire',
    description: 'Here you will acquire vital skills that are necessary to start your journey, and set yourself up for success by mastering the foundational elements of Japanese, including hiragana and katakana.',
    gradient: 'from-orange-300 via-amber-200 to-cyan-300',
    icon: '🏝️',
    color: 'orange'
  },
  {
    title: 'Fledgling Forest',
    subtitle: 'Explore the forest',
    description: 'Put your polished fundamentals to use, as you learn essential kanji, vocabulary and grammar. Many learners get lost in the forest of beginner Japanese, but our hand-crafted lessons will guide you through. Step by step.',
    gradient: 'from-green-400 via-emerald-300 to-green-600',
    icon: '⛩️',
    color: 'green'
  },
  {
    title: 'Depths of Devotion',
    subtitle: 'Take a deep dive',
    description: 'Here you will take what you have learned and go deeper, exploring a deep-sea world of grammar and vocabulary that you never even knew existed! Come face-to-face with the deep sea leviathans of sonkeigo and kenjougo, and ultimately defeat them in an epic underwater language battle!',
    gradient: 'from-blue-400 via-cyan-400 to-blue-600',
    icon: '🐙',
    color: 'blue'
  },
  {
    title: 'Jungle of Tenacity',
    subtitle: 'Welcome to the jungle',
    description: 'This is the intermediate "jungle" of Japanese, where your Japanese knowledge really starts to take off! You will reach a total of ~1050 kanji and ~4000 vocabulary learned, as well as learn grammar like わけ and ものだ that will get you speaking like a native!',
    gradient: 'from-purple-400 via-indigo-400 to-purple-600',
    icon: '🌳',
    color: 'grape'
  }
];

export default function AdventureSection() {
  return (
    <section id="explore" className="py-32 bg-white relative overflow-hidden">
      <Container size="xl" className="relative z-10 px-6">
        <div className="text-center mb-32">
          <Title order={2} className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight">
            Adventure Awaits
          </Title>
          <Text size="2xl" c="dimmed" className="mb-4 font-medium">
            Come explore our islands!
          </Text>
          <Text size="xl" className="max-w-4xl mx-auto leading-relaxed text-gray-600">
            They are filled to the brim with <strong className="text-gray-900 font-bold">grammar lessons</strong>, <strong className="text-gray-900 font-bold">reading exercises</strong>, <strong className="text-gray-900 font-bold">kanji & vocabulary unlocks</strong> <span className="text-gray-400">and so much more!</span>
          </Text>
        </div>

        <div className="relative">
          {/* Mobile/Tablet: Simple straight line */}
          <div className="absolute left-8 top-10 bottom-10 w-1 border-l-4 border-dashed border-gray-200 lg:hidden"></div>

          {/* Desktop: Curved SVG Path */}
          <svg className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[600px] h-full -z-10 pointer-events-none" style={{ overflow: 'visible' }}>
            <path
              d="M 300 100 C 300 200, 100 200, 100 350 C 100 500, 500 500, 500 650 C 500 800, 100 800, 100 950 C 100 1100, 500 1100, 500 1250 C 500 1400, 300 1400, 300 1500"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
              strokeDasharray="16 16"
              strokeLinecap="round"
            />
          </svg>

          <div className="space-y-32">
            {adventures.map((adventure, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-32 items-center relative group`}
              >
                {/* Circle Image Wrapper - shifting to align with curve */}
                <div
                  className={`relative flex-shrink-0 transition-transform duration-500 ${index % 2 === 0 ? 'lg:-translate-x-12' : 'lg:translate-x-12'}`}
                >
                  <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] relative perspective-1000">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${adventure.gradient} shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex items-center justify-center relative overflow-hidden transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500 ease-out border-8 border-white ring-1 ring-gray-100`}>
                      <Box className=" absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 " />
                      <span className="text-[140px] sm:text-[220px] z-10 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 select-none drop-shadow-xl">
                        {adventure.icon}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <Paper
                  shadow="none"
                  radius="xl"
                  className={`flex-1 max-w-xl text-center lg:text-left bg-transparent ${index % 2 !== 0 ? 'lg:text-right' : ''}`}
                >
                  <Title order={3} className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    {adventure.title}
                  </Title>

                  <Text size="lg" c="dimmed" fw={800} className="mb-6 uppercase tracking-widest text-sm text-blue-500">
                    {adventure.subtitle}
                  </Text>

                  <Text size="xl" className="text-gray-600 leading-relaxed font-medium">
                    {adventure.description}
                  </Text>
                </Paper>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-40">
          <Paper
            radius="3rem"
            className="p-16 md:p-24 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white text-center relative overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-shadow"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10">
              <Title order={3} className="text-5xl md:text-6xl font-black mb-4 text-white tracking-tight drop-shadow-sm">Start Learning</Title>
              <Text className="text-6xl md:text-7xl font-black mb-8 text-white tracking-tighter drop-shadow-md">Japanese</Text>
              <Text className="text-2xl mb-12 opacity-95 text-green-50 font-medium">Join thousands of other students today!</Text>
              <Button
                size="xl"
                radius="full"
                variant="white"
                color="green"
                className="font-bold text-xl px-12 h-16 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-green-700"
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
