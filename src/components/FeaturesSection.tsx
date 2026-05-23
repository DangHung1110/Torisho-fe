'use client';

import Image from 'next/image';
import {
  IconBook2 as BookOpen,
  IconClipboardCheck as ClipboardCheck,
  IconLayersSubtract as Layers,
  IconMap as Map,
  IconMicrophone2 as Mic2,
  IconSparkles as Sparkles,
} from '@tabler/icons-react';

const workflowArtwork =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqwUQ5cGoH5bzR10tV558UhzRNdOKCiyfTQLC5zYatrtew0ruMRzKstZRb8P4wpsQTFzox_qbaPMIKSvoCUU9NYUK6MrZaP77B-7xT3Z7LJH4iAGS8JKcaa8vee3BsSBWNdCmy7NiN6wzj8NQi8RJ_2gjemhDn-czUSH6qg8kxEbTlfkCy0YWF-PYHLfUGJX5qOM9ESxuT-ZLl7tEaHLuQFs_jyLv8VcSQglQlkHbBh-JaXcObTBVhdy_1k19dTv3c-bw_PEe-AL8';

const workflowSteps = [
  {
    title: 'Study Lesson',
    text: 'Engage with bite-sized daily lessons tailored to your JLPT level.',
    origin: 'top left',
  },
  {
    title: 'Take Quiz',
    text: 'Test your knowledge and lock in what you have just learned.',
    origin: 'top right',
  },
  {
    title: 'Save Flashcards',
    text: 'Collect vocabulary and kanji to review with spaced repetition.',
    origin: 'bottom left',
  },
  {
    title: 'Practice Speaking',
    text: 'Build pronunciation confidence through guided speaking practice.',
    origin: 'bottom right',
  },
];

const toolkit = [
  {
    title: 'Adventure Learning',
    text: 'Move through themed JLPT islands from PRE-N5 to N1.',
    Icon: Map,
    color: '#f4dfc8',
    iconColor: '#835500',
  },
  {
    title: 'Daily Quiz',
    text: 'Small reviews keep grammar and vocabulary fresh every day.',
    Icon: ClipboardCheck,
    color: '#3fb27f',
    iconColor: '#ffffff',
  },
  {
    title: 'Dictionary + Kanji',
    text: 'Search words, readings, kanji details, and examples quickly.',
    Icon: BookOpen,
    color: '#5b9bd5',
    iconColor: '#ffffff',
  },
  {
    title: 'Flashcards',
    text: 'Save custom cards and revisit weak spots with focused decks.',
    Icon: Layers,
    color: '#f5a623',
    iconColor: '#ffffff',
  },
  {
    title: 'Speaking Practice',
    text: 'Find partners and practice real-time conversation rooms.',
    Icon: Mic2,
    color: '#9b72cf',
    iconColor: '#ffffff',
  },
];

const jlptNodes = [
  { level: 'N5', label: 'Beginner', detail: '800 Vocab', color: '#cfeedd' },
  { level: 'N4', label: 'Elementary', detail: '800 Vocab, 80 Grammar', color: '#3fb27f' },
  { level: 'N3', label: 'Intermediate', detail: '1,500 Vocab, 150 Grammar', color: '#5b9bd5' },
  { level: 'N2', label: 'Advanced', detail: '3,000 Vocab, 300 Grammar', color: '#f5a623' },
  { level: 'N1', label: 'Fluent', detail: '6,000 Vocab, 600 Grammar', color: '#9b72cf' },
];

export default function FeaturesSection() {
  return (
    <>
      <section className="border-y border-[#d7c3ae] bg-[#fff1e4] py-12 sm:py-14">
        <div className="torisho-shell">
          <SectionHeader
            eyebrow="Daily flow"
            title="Your Daily Workflow"
            text="A simple habit loop to master Japanese consistently every day."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => (
              <article key={step.title} className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-[#ffddb4] bg-white shadow-sm">
                  <Image
                    src={workflowArtwork}
                    alt=""
                    fill
                    unoptimized
                    sizes="128px"
                    className="object-cover"
                    style={{
                      transform: 'scale(2)',
                      transformOrigin: step.origin,
                    }}
                  />
                </div>
                <h3 className="torisho-display text-xl font-semibold text-[#211a12]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[230px] text-sm leading-6 text-[#665744]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-12 sm:py-14">
        <div className="torisho-shell">
          <SectionHeader
            eyebrow="Features"
            title="Scholar's Toolkit"
            text="Everything you need to master grammar, reading, vocabulary, kanji, and spoken fluency."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {toolkit.map(({ Icon, ...feature }) => (
              <article
                key={feature.title}
                className="group flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-[#d7c3ae] bg-[#fffdfb] p-5 text-center shadow-[0_4px_12px_rgba(26,20,16,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(54,37,20,0.10)]"
              >
                <span
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: feature.color }}
                >
                  <Icon size={24} color={feature.iconColor} stroke={2} />
                </span>
                <h3 className="torisho-display text-lg font-semibold leading-tight text-[#211a12]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#665744]">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7c3ae] bg-[#fff8f4] py-12 sm:py-14">
        <div className="torisho-shell">
          <SectionHeader
            eyebrow="Curriculum"
            title="Structured JLPT Paths"
            text="Track your progress from beginner to advanced with dedicated curriculum modules."
          />

          <div className="relative mx-auto mt-9 max-w-[900px]">
            <div className="absolute left-8 right-8 top-8 hidden h-1 bg-[#d7c3ae] md:block" />
            <div className="relative z-10 grid grid-cols-1 gap-7 md:grid-cols-5">
              {jlptNodes.map((node, index) => (
                <article key={node.level} className="flex flex-col items-center text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#fff8f4] text-base font-bold text-white shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: node.color }}
                  >
                    <span className={index === 0 ? 'text-white/85' : 'text-white'}>{node.level}</span>
                  </div>
                  <div className="mt-2 min-h-[64px] w-full min-w-[128px] rounded-md border border-[#d7c3ae] bg-white px-3 py-2.5 shadow-[0_4px_10px_rgba(26,20,16,0.04)]">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#665744]">
                      {node.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#3d2a17]">{node.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-9 flex max-w-3xl items-center justify-center gap-3 rounded-lg border border-[#d7c3ae] bg-white/70 px-5 py-4 text-center text-sm leading-6 text-[#524534]">
            <Sparkles className="hidden flex-shrink-0 text-[#f5a623] sm:block" size={22} />
            <span>
              Lessons, quizzes, dictionary saves, and flashcards all point back to the same JLPT
              journey, so progress feels connected instead of scattered.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-9">
      <p className="torisho-eyebrow mb-3">{eyebrow}</p>
      <h2 className="torisho-section-title">{title}</h2>
      <p className="torisho-section-copy mx-auto mt-3 max-w-2xl">{text}</p>
    </div>
  );
}
