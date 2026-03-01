'use client';

import { Container, Title, Text, Accordion, ThemeIcon, Box, Group, Button, Grid, Paper } from '@mantine/core';

const features = [
  {
    number: '1',
    title: 'Explore The MaruVerse',
    description: 'Go on a Japanese language adventure throughout our beautiful animated islands teeming with Japanese language content. Our gamified system contains regions for every level of language mastery (PRE-N5 → N1), and each one features hand-crafted Grammar Lessons, Reading Exercises, Course Exercises (drills), Vocabulary and Kanji unlocks, and more!',
    icon: '🗺️',
    mascot: '🦝'
  },
  {
    number: '2',
    title: 'In-Depth Grammar Lessons',
    description: 'Master Japanese grammar with comprehensive lessons that break down complex concepts into easy-to-understand explanations.',
    icon: '📚',
    mascot: '📚'
  },
  {
    number: '3',
    title: 'Grammar SRS Exercises',
    description: 'Practice with spaced repetition system exercises designed to help you retain grammar patterns long-term.',
    icon: '📚',
    mascot: '📚'
  },
  {
    number: '4',
    title: 'Deciphering Kanji',
    description: 'Learn kanji effectively with mnemonics, stroke order animations, and practical usage examples.',
    icon: '🖌️',
    mascot: '🖌️'
  },
  {
    number: '5',
    title: 'Learning Vocabulary',
    description: 'Build your vocabulary with thousands of words across all JLPT levels, complete with example sentences.',
    icon: '🐠',
    mascot: '🐠'
  },
  {
    number: '6',
    title: 'Reading Exercises',
    description: 'Improve your reading comprehension with graded reading materials tailored to your level.',
    icon: '📚',
    mascot: '📚'
  },
  {
    number: '7',
    title: '(Premade) Study Lists',
    description: 'Access curated study lists for specific topics, JLPT levels, and learning goals.',
    icon: '💡',
    mascot: '💡'
  },
  {
    number: '8',
    title: 'Keep Track Of Your Progress',
    description: 'Monitor your learning journey with detailed statistics and achievement tracking.',
    icon: '🏆',
    mascot: '🏆'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-gray-50/50">
      <Container size="md">
        <div className="text-center mb-20">
          <Title order={2} className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            How we teach you Japanese
          </Title>
          <Text size="xl" c="dimmed" className="max-w-3xl mx-auto leading-relaxed">
            In MaruMori we teach you all the way from start to finish in a fully structured manner.
            But we also offer many ways to create your own study path.
          </Text>
        </div>

        <Accordion
          variant="separated"
          radius="lg"
          chevronPosition="right"
          defaultValue="1"
          styles={{
            item: {
              borderWidth: '2px',
              transition: 'all 0.2s ease',
            },
            control: {
              padding: '1.5rem',
            },
            content: {
              padding: '1.5rem',
            }
          }}
        >
          {features.map((feature) => (
            <Accordion.Item
              key={feature.number}
              value={feature.number}
              className="mb-4 bg-white hover:border-blue-300 shadow-sm"
            >
              <Accordion.Control>
                <Group wrap="nowrap">
                  <ThemeIcon
                    size={56}
                    radius="xl"
                    color="blue"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    className="flex-shrink-0 shadow-md"
                  >
                    <span className="text-xl font-bold">{feature.number}</span>
                  </ThemeIcon>

                  <Box className="flex-shrink-0 text-5xl hidden sm:block opacity-80 scale-90">
                    {feature.icon}
                  </Box>

                  <Title order={3} className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <div className="pt-2 pb-4 flex flex-col md:flex-row gap-8 items-center">
                  <Text size="lg" className="text-gray-600 leading-relaxed flex-1 pl-2">
                    {feature.description}
                  </Text>
                  <Box className="flex-shrink-0 w-64 h-48 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-2xl flex items-center justify-center border border-gray-100">
                    <span className="text-9xl drop-shadow-md transform hover:scale-110 transition-transform duration-300 cursor-pointer">{feature.mascot}</span>
                  </Box>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
