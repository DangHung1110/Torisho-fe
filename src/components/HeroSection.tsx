'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';

const heroArtwork =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDP_96wqNc0lgfpjLf1EvKzPFIsWr4Ii7_yD5o8NU8AGIuRw-ZrixvNdlCXwWYUfj5Ml6ZNXIbqszMxMpKDusb0dZMV7rLTttK689o7-MK6DN6zbAioe7_e7AVW8nDaK1LRqSSnB2Nt-Vi_DCyd9uP9Gx8pF34CayEFVCZfk_5tNvz2R3cIRkOQ6QtUFtQJmnIUwXRDrH6D-hcwY5-L0WXr9wQa0467QcKkfbmdirAmWdDds4mI12tDSF6pzb16ZenP4vGKyEn5bDY';

const learningPaths = [
  'Grammar SRS',
  'Reading Exercises',
  'Kanji Learning',
  'Vocabulary Building',
  'Language Mastery',
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(135);

  useEffect(() => {
    const currentWord = learningPaths[currentIndex];

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          setTypingSpeed(135);
        } else {
          setTypingSpeed(1350);
          setIsDeleting(true);
        }
        return;
      }

      if (displayText.length > 0) {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
        setTypingSpeed(70);
      } else {
        setIsDeleting(false);
        setCurrentIndex((index) => (index + 1) % learningPaths.length);
        setTypingSpeed(260);
      }
    }, typingSpeed);

    return () => window.clearTimeout(timer);
  }, [currentIndex, displayText, isDeleting, typingSpeed]);

  return (
    <section id="home" className="relative overflow-hidden bg-[#fff8f4]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
        <span className="font-[var(--font-japanese)] text-[44vw] font-bold leading-none text-[#835500]">
          {'\u65c5'}
        </span>
      </div>

      <div className="torisho-shell relative z-10 grid min-h-[540px] grid-cols-1 items-center gap-10 py-10 md:grid-cols-[0.92fr_1fr] lg:min-h-[570px] lg:py-11">
        <div className="flex max-w-[545px] flex-col items-start gap-6">
          <div className="inline-flex rounded-full border border-[#d7c3ae] bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#835500] shadow-sm">
            JLPT N5 to N1 guided path
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="torisho-display text-[40px] font-bold leading-[1.05] text-[#211a12] sm:text-[50px] lg:text-[56px]">
              Master Japanese
              <span className="mt-2 block min-h-[1.08em] text-[#835500]">
                {displayText}
                <span className="ml-1 inline-block animate-blink text-[#f5a623]">|</span>
              </span>
            </h1>
            <p className="max-w-[480px] text-base leading-7 text-[#524534]">
              Structured JLPT paths from N5 to N1. Learn through adventure zones, daily quizzes,
              dictionary lookup, flashcards, and speaking practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f5a623] px-6 py-2.5 text-sm font-bold text-[#291800] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#ffb955] hover:shadow-md"
            >
              Start Learning
              <IconArrowRight size={18} stroke={2.2} />
            </Link>
            <Link
              href="/dictionary"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#857462] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#211a12] transition-all hover:bg-[#fff1e4]"
            >
              <IconSearch size={18} stroke={2} />
              Explore Dictionary
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[430px] items-center justify-center md:justify-self-end">
          <div className="absolute inset-8 rounded-full bg-white/70 blur-3xl" />
          <div className="relative aspect-square w-full max-w-[410px] overflow-hidden bg-white shadow-[0_18px_34px_rgba(54,37,20,0.16)] ring-1 ring-[#eee0d2]">
            <Image
              src={heroArtwork}
              alt="Torisho chicken sensei studying Japanese"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 86vw, 410px"
              className="object-contain p-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
