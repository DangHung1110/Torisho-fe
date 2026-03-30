'use client';

import { Container, Title, Text, Accordion, ThemeIcon, Box, Group } from '@mantine/core';

const features = [
  {
    number: '1',
    title: 'Explore The TorishoVerse',
    description: 'Go on a Japanese language adventure throughout our beautiful animated islands teeming with Japanese language content. Our gamified system contains regions for every level of language mastery (PRE-N5 → N1), and each one features hand-crafted Grammar Lessons, Reading Exercises, Course Exercises (drills), Vocabulary and Kanji unlocks, and more!',
    icon: '🗺️',
    mascot: '🐔'
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
    icon: '🔄',
    mascot: '🔄'
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
    icon: '📖',
    mascot: '📖'
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
    <section id="features" className="py-24 md:py-28 bg-[#f3f4f6]">
      <Container size="xl">
        <div className="text-center mb-14 md:mb-16">
          <Title order={2} className="text-5xl md:text-6xl font-black text-gray-800 mb-6 tracking-tight leading-[1.1]">
            How we teach you Japanese
          </Title>
          <Text size="xl" c="dimmed" className="max-w-300 mx-auto text-center text-[24px] md:text-[30px] font-medium leading-[1.45] text-gray-400">
            In Torisho we teach you all the way from start to finish in a fully structured manner.
            But we also offer many ways to create your own study path.
          </Text>
        </div>

        <Accordion
          variant="default"
          radius="md"
          chevronPosition="right"
          defaultValue="1"
          className="max-w-5xl mx-auto"
          styles={{
            item: {
              border: 'none',
              borderBottom: '1px solid #d7dce3',
              borderRadius: 0,
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease',
              '&[dataActive]': {
                backgroundColor: 'transparent',
              },
            },
            control: {
              padding: '0.85rem 0.1rem',
            },
            content: {
              padding: '0 0.1rem 1rem',
            },
            chevron: {
              color: '#9ca3af',
            },
          }}
        >
          {features.map((feature) => (
            <Accordion.Item
              key={feature.number}
              value={feature.number}
              className="mb-0"
            >
              <Accordion.Control>
                <Group wrap="nowrap" className="min-h-14">
                  <ThemeIcon
                    size={40}
                    radius="xl"
                    variant="filled"
                    color="gray.1"
                    className="shrink-0"
                  >
                    <span className="text-xl md:text-2xl font-extrabold text-gray-700 leading-none">{feature.number}</span>
                  </ThemeIcon>

                  <Box className="shrink-0 text-[30px] hidden sm:block opacity-90 ml-1.5">
                    {feature.icon}
                  </Box>

                  <Title order={3} className="text-[24px] md:text-[30px] font-black text-gray-700 leading-tight tracking-tight ml-1.5">
                    {feature.title}
                  </Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <div className="pt-1 pb-2 flex flex-col md:flex-row gap-4 items-start">
                  <Text size="lg" className="text-gray-600 leading-relaxed flex-1 pl-20 md:pl-24 pr-4">
                    {feature.description}
                  </Text>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
