'use client';

import { Container, Title, Text, SimpleGrid, Paper, Badge, Button, Group, ThemeIcon } from '@mantine/core';

const roadmapItems = [
  { title: 'Quick Study', type: 'MOBILE APP', status: '' },
  { title: 'Adventure Dashboard (Alternative List View)', type: 'WEB & APP', status: '' },
  { title: 'Study Friends Section', type: 'MOBILE APP', status: '' },
  { title: 'Profile Page', type: 'MOBILE APP', status: '' },
  { title: 'Recently Studied & Leeches Section', type: 'MOBILE APP', status: '' },
  { title: 'JLPT Mock Exams - Listening Sections', type: 'CONTENT', status: '' },
  { title: 'Cultural & Bonus Lessons (spanning all levels)', type: 'CONTENT', status: '' },
  { title: 'Official Vocabulary Stories (mnemonics)', type: 'CONTENT', status: '' },
  { title: 'Mini Game - Shiritori', type: 'WEB & APP', status: 'WIP' },
  { title: 'Frequency-Based Study Lists & Dictionary Info', type: 'CONTENT', status: 'WIP' },
  { title: 'Mobile Apps - General Launch (out of Early Access!)', type: 'MOBILE APP', status: 'WIP' },
  { title: 'Advanced (N2) Content Done!', type: 'CONTENT', status: 'WIP' }
];

const phase6Items = [
  'Kanji (& Kana) Writing Practice',
  'Quests (Daily, Weekly and Permanent Challenges & Study Goals)',
  'Houses & Deities (Study Clans)',
  'Expert (N1) Content Start!',
  'JLPT Mock Exams - N1',
  'Personal Notebook (Note-taking system)',
  'Reading Exercises Rework',
  'Torisho Cosmetics (skins)',
  'Tools - JLPT Mock Exams',
  'Browser Lookup/Mining Extension',
  'MPV (video player) Mining Plugin',
  'Manga Study Lists'
];

// Phase SVG icons
const SandDunesIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 md:w-14 md:h-14 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 44 Q16 28 28 36 Q40 44 52 28 L60 32 L60 60 L4 60 Z" fill="white" fillOpacity="0.9" />
    <circle cx="46" cy="18" r="10" fill="white" fillOpacity="0.8" />
    <path d="M38 18 Q46 10 54 18" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 md:w-14 md:h-14 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" stroke="white" strokeWidth="3" strokeOpacity="0.9" />
    <circle cx="32" cy="32" r="4" fill="white" fillOpacity="0.85" />
    <path d="M32 14 L36 30 L32 34 L28 30 Z" fill="white" fillOpacity="0.9" />
    <path d="M32 50 L28 34 L32 30 L36 34 Z" fill="white" fillOpacity="0.5" />
    <path d="M14 32 L30 28 L34 32 L30 36 Z" fill="white" fillOpacity="0.5" />
    <path d="M50 32 L34 36 L30 32 L34 28 Z" fill="white" fillOpacity="0.9" />
  </svg>
);

export default function RoadmapSection() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MOBILE APP': return 'red';
      case 'WEB & APP': return 'blue';
      case 'CONTENT': return 'green';
      default: return 'gray';
    }
  };

  const getStatusDot = (status: string) => {
    if (status === 'WIP') return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <section id="roadmap" className="py-24 md:py-28 bg-white">
      <Container size="xl">

        {/* Section heading */}
        <div className="text-center mb-14">
          <Title
            order={2}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Roadmap
          </Title>
          <Text size="lg" c="dimmed" className="max-w-2xl mx-auto">
            See what else is coming to Torisho in the near future!
          </Text>
        </div>

        {/* Show Previous Phases */}
        <div className="text-center mb-12">
          <Button
            variant="light"
            color="blue"
            size="md"
            radius="xl"
            className="cursor-pointer hover:scale-105 transition-transform duration-150 font-semibold"
          >
            Show Previous Phases ↑
          </Button>
        </div>

        {/* Phase 5 */}
        <div className="mb-16">
          {/* Phase 5 header — matches Phase 6 style */}
          <Group className="mb-10" gap="lg" align="center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-400 via-orange-300 to-amber-400 flex items-center justify-center shadow-xl flex-shrink-0 border-4 border-white ring-1 ring-red-200">
              <SandDunesIcon />
            </div>
            <div>
              <Text c="red" fw={700} size="xs" className="mb-1 uppercase tracking-widest">
                PHASE 5
              </Text>
              <Title order={3} className="text-3xl md:text-4xl font-black text-red-500 mb-1 tracking-tight">
                Traversing the Sands of Mastery..
              </Title>
              <Text size="sm" c="dimmed" fw={500}>Q3 2025–2026</Text>
            </div>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" className="mb-4">
            {roadmapItems.map((item, index) => (
              <Paper
                key={index}
                p="md"
                radius="lg"
                className="flex items-center gap-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white"
              >
                {/* Status dot indicator */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusDot(item.status)}`} />

                <div className="flex-1 min-w-0">
                  <Badge
                    color={getTypeColor(item.type)}
                    variant="light"
                    size="xs"
                    className="mb-1.5"
                  >
                    {item.type}
                  </Badge>
                  <Text fw={600} size="sm" className="text-gray-800 leading-snug">
                    {item.title}
                  </Text>
                </div>

                {item.status && (
                  <Badge color="pink" variant="light" size="sm" className="flex-shrink-0">
                    {item.status}
                  </Badge>
                )}
              </Paper>
            ))}
          </SimpleGrid>

          {/* Legend */}
          <Group gap="lg" className="mt-5 pl-1">
            <Group gap="xs" align="center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <Text size="xs" c="dimmed" fw={500}>Planned</Text>
            </Group>
            <Group gap="xs" align="center">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <Text size="xs" c="dimmed" fw={500}>In Progress (WIP)</Text>
            </Group>
          </Group>
        </div>

        {/* Phase 6 */}
        <div className="mb-16">
          <Group className="mb-10" gap="lg" align="center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-500 flex items-center justify-center shadow-xl flex-shrink-0 border-4 border-white ring-1 ring-purple-200">
              <CompassIcon />
            </div>
            <div>
              <Text c="grape" fw={800} size="xs" className="mb-1 tracking-widest uppercase">
                PHASE 6
              </Text>
              <Title order={3} className="text-3xl md:text-4xl font-black text-purple-600 mb-1 tracking-tight">
                The Great Beyond
              </Title>
              <Text size="sm" c="dimmed" fw={500}>2026 &amp; Beyond</Text>
            </div>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {phase6Items.map((item, index) => (
              <Paper
                key={index}
                p="md"
                radius="lg"
                className="group border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderLeft: '4px solid #e9d5ff' }}
              >
                <div
                  className="transition-colors duration-150"
                  style={{ '--hover-color': '#7c3aed' } as React.CSSProperties}
                >
                  <Text
                    fw={600}
                    size="sm"
                    className="leading-snug text-gray-600 group-hover:text-purple-700 transition-colors duration-150"
                  >
                    {item}
                  </Text>
                </div>
              </Paper>
            ))}
          </SimpleGrid>
        </div>

        {/* And More TBA */}
        <div className="mt-8 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-6 py-14 text-white shadow-2xl sm:px-10 md:py-16">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-5 md:gap-6">
              <Title order={3} className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
                And More TBA
              </Title>
              <Text size="lg" className="text-center font-medium text-gray-400">
                Don&apos;t miss anything on our journey!
              </Text>
              <Button
                size="md"
                radius="xl"
                variant="white"
                className="cursor-pointer mt-1 h-12 shrink-0 px-8 font-bold text-gray-900 shadow-xl transition-all duration-200 hover:scale-[1.03] md:h-14 md:px-10"
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
