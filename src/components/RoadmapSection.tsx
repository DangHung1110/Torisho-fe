'use client';

import { Container, Title, Text, SimpleGrid, Paper, Badge, Button, Group, Box, ThemeIcon, Divider } from '@mantine/core';

const roadmapItems = [
  {
    title: 'Quick Study',
    type: 'MOBILE APP',
    status: ''
  },
  {
    title: 'Adventure Dashboard (Alternative List View)',
    type: 'WEB & APP',
    status: ''
  },
  {
    title: 'Study Friends Section',
    type: 'MOBILE APP',
    status: ''
  },
  {
    title: 'Profile Page',
    type: 'MOBILE APP',
    status: ''
  },
  {
    title: 'Recently Studied & Leeches Section',
    type: 'MOBILE APP',
    status: ''
  },
  {
    title: 'JLPT Mock Exams - Listening Sections',
    type: 'CONTENT',
    status: ''
  },
  {
    title: 'Cultural & Bonus Lessons (spanning all levels)',
    type: 'CONTENT',
    status: ''
  },
  {
    title: 'Official Vocabulary Stories (mnemonics)',
    type: 'CONTENT',
    status: ''
  },
  {
    title: 'Mini Game - Shiritori',
    type: 'WEB & APP',
    status: 'WIP'
  },
  {
    title: 'Frequency-Based Study Lists & Dictionary Info',
    type: 'CONTENT',
    status: 'WIP'
  },
  {
    title: 'Mobile Apps - General Launch (out of Early Access!)',
    type: 'MOBILE APP',
    status: 'WIP'
  },
  {
    title: 'Advanced (N2) Content Done!',
    type: 'CONTENT',
    status: 'WIP'
  }
];

export default function RoadmapSection() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MOBILE APP': return 'red';
      case 'WEB & APP': return 'blue';
      case 'CONTENT': return 'green';
      default: return 'gray';
    }
  };

  return (
    <section id="roadmap" className="py-24 bg-white">
      <Container size="xl">
        <div className="text-center mb-16">
          <Title order={2} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Roadmap
          </Title>
          <Text size="xl" c="dimmed" className="max-w-3xl mx-auto">
            See what else is coming to MaruMori in the near future!
          </Text>
        </div>

        <div className="text-center mb-12">
          <Button
            variant="light"
            color="blue"
            size="lg"
            radius="xl"
            className="hover:scale-105 transition-transform"
          >
            Show Previous Phases ↑
          </Button>
        </div>

        <div className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b pb-4">
            <div>
              <Text c="red" fw={700} size="sm" className="mb-2">PHASE 5</Text>
              <Title order={3} className="text-4xl font-bold text-red-500">
                Traversing the Sands of Mastery..
              </Title>
            </div>
            <Text size="xl" c="dimmed" className="mt-4 md:mt-0">Q3 2025-2026</Text>
          </div>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" className="mb-16">
            {roadmapItems.map((item, index) => (
              <Paper
                key={index}
                p="lg"
                radius="xl"
                className="flex items-center gap-5 border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-1">
                  <Badge
                    color={getTypeColor(item.type)}
                    variant="light"
                    size="sm"
                    className="mb-2"
                  >
                    {item.type}
                  </Badge>
                  <Text fw={600} size="lg" className="text-gray-900">
                    {item.title}
                  </Text>
                </div>
                {item.status && (
                  <Badge color="pink" variant="light" size="lg">
                    {item.status}
                  </Badge>
                )}
                <ThemeIcon radius="xl" size="xl" color="green" variant="light">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </ThemeIcon>
              </Paper>
            ))}
          </SimpleGrid>

          {/* Phase 6 */}
          <div className="relative">
            <Group className="mb-12" gap="xl">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-300 flex items-center justify-center shadow-2xl flex-shrink-0 border-4 border-white">
                <span className="text-6xl md:text-8xl drop-shadow-md">🏜️</span>
              </div>
              <div>
                <Text c="grape" fw={800} size="sm" className="mb-2 tracking-widest uppercase">PHASE 6</Text>
                <Title order={3} className="text-4xl md:text-5xl font-black text-purple-500 mb-3 tracking-tight">
                  The Great Beyond
                </Title>
                <Text size="xl" c="dimmed" fw={500}>2026 & Beyond</Text>
              </div>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {['Kanji (& Kana) Writing Practice', 'Quests (Daily, Weekly and Permanent Challenges & Study Goals)', 'Houses & Deities (Study Clans)', 'Expert (N1) Content Start!', 'JLPT Mock Exams - N1', 'Personal Notebook (Note-taking system)', 'Reading Exercises Rework', 'Maru Cosmetics (skins)', 'Tools - JLPT Mock Exams', 'Browser Lookup/Mining Extension', 'MPV (video player) Mining Plugin', 'Manga Study Lists'].map((item, index) => (
                <Paper
                  key={index}
                  p="xl"
                  radius="lg"
                  className="bg-white/50 border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center min-h-[100px] group"
                >
                  <Text fw={600} size="md" className="text-gray-700 group-hover:text-purple-600 transition-colors">{item}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </div>
        </div>

        {/* And More TBA */}
        <div className="text-center mt-32">
          <div className="relative py-24 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-[3rem] overflow-hidden shadow-2xl text-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 px-6">
              <Title order={3} className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                And More TBA
              </Title>
              <Text size="xl" className="mb-12 text-gray-300 font-medium">Don't miss anything on our journey!</Text>
              <Button
                size="xl"
                radius="full"
                variant="white"
                className="font-bold text-xl h-16 px-12 text-gray-900 hover:scale-105 transition-transform shadow-xl"
              >
                Sign up now! →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
