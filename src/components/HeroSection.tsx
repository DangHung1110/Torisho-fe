'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Container, Title, Text, Group, Box, Badge } from '@mantine/core';
import Image from 'next/image';
import { Baloo_2 } from 'next/font/google';

const displayFont = Baloo_2({
  subsets: ['latin'],
  weight: ['700', '800'],
});

const learningPaths = [
  'Grammar SRS',
  'Reading Exercises',
  'Kanji Learning',
  'Vocabulary Building',
  'Language Mastery'
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentWord = learningPaths[currentIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
          setTypingSpeed(150);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
          setTypingSpeed(100);
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % learningPaths.length);
          setTypingSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, typingSpeed]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20"
      style={{ background: 'linear-gradient(155deg, #f8faff 0%, #eef5ff 30%, #f0fdf4 65%, #fefce8 100%)' }}
    >
      {/* Background blobs */}
      <Box className="absolute top-16 right-16 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-200/45 to-orange-200/25 blur-3xl pointer-events-none" />
      <Box className="absolute bottom-16 left-0 w-[320px] h-[320px] rounded-full bg-gradient-to-br from-emerald-200/35 to-blue-200/25 blur-3xl pointer-events-none" />

      <Container size="xl" className="relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-20">

          {/* Left Content */}
          <div className="flex flex-col gap-7 w-full md:w-[56%] animate-fadeInUp">

            {/* Top badge */}
            <div>
              <Badge
                variant="white"
                color="blue"
                size="md"
                radius="md"
                className="shadow-sm border border-blue-100/80 py-3 px-4 text-blue-600 font-semibold tracking-wide uppercase text-xs"
              >
                NEW: TORISHO MOBILE APP
              </Badge>
            </div>

            {/* Headings */}
            <div className="flex flex-col gap-1">
              <Title
                order={1}
                className={`${displayFont.className} text-[52px] md:text-[64px] font-extrabold text-gray-900 leading-[1.05] tracking-tight`}
              >
                Your all-in-one
              </Title>
              <Title
                order={1}
                className={`${displayFont.className} text-[52px] md:text-[64px] font-extrabold text-gray-900 leading-[1.05] tracking-tight`}
              >
                platform for Japanese
              </Title>
              <div className="min-h-[80px] md:min-h-[90px] flex items-center mt-1">
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  className={`${displayFont.className} text-[52px]! md:text-[64px]! font-extrabold inline-block leading-none tracking-tight`}
                >
                  {displayText}
                  <span className="animate-blink text-gray-300 font-thin ml-1">|</span>
                </Text>
              </div>
            </div>

            {/* CTA Group */}
            <Group gap="xl" align="center" className="flex-wrap">
              <Button
                component={Link}
                href="/register"
                size="lg"
                radius="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                rightSection={<span className="text-lg">→</span>}
                className="cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-200 font-bold"
                styles={{
                  root: {
                    height: '52px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    fontSize: '17px',
                    borderRadius: '14px',
                  }
                }}
              >
                Start Learning
              </Button>

              <Text c="dimmed" size="lg" fw={600} className="hidden sm:block">
                — It&apos;s free to try!
              </Text>
            </Group>

            {/* Sign in link */}
            <Text c="dimmed" className="text-base font-semibold -mt-1">
              Already registered?{' '}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 hover:underline font-extrabold transition-colors duration-150 cursor-pointer"
              >
                Sign in
              </Link>
            </Text>
          </div>

          {/* Right Content – Chicken Mascot */}
          <div className="relative flex w-full md:w-[44%] items-center justify-center shrink-0 animate-fadeInUp-delay-1">
            <div className="relative w-64 h-64 md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px]">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300/25 via-yellow-200/20 to-red-300/20 rounded-full blur-2xl animate-pulse" />
              {/* Chicken mascot image */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white/50 cursor-pointer transform hover:scale-105 hover:rotate-3 transition-transform duration-500">
                <Image
                  src="/images/torisho-mascot-hero.png"
                  alt="Torisho Mascot"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
