'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Container, Title, Text, Group, Box, Badge } from '@mantine/core';

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
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
          setTypingSpeed(150);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
          setTypingSpeed(100);
        } else {
          // Finished deleting, move to next word
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-40 pb-32" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 25%, #e3f2fd 50%, #f5f7fa 75%, #fff9e6 100%)'
    }}>
      {/* Decorative circles */}
      <Box className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-200/40 to-orange-200/30 blur-3xl pointer-events-none" />
      <Box className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-green-200/40 to-blue-200/30 blur-3xl pointer-events-none" />

      <Container size="xl" className="relative z-10 w-full px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-20">
          {/* Left Content */}
          <div className="space-y-10 max-w-3xl flex-1">
            <Badge
              variant="white"
              color="blue"
              size="lg"
              radius="md"
              className="mb-6 shadow-sm border border-blue-100 py-4 px-4 text-blue-600 font-bold tracking-wide"
            >
              NEW: MARUMORI MOBILE APP
            </Badge>

            <div className="space-y-4">
              <Title order={1} className="text-6xl md:text-8xl font-black text-gray-900 leading-[1] tracking-tight">
                Your all-in-one
              </Title>
              <Title order={1} className="text-6xl md:text-8xl font-black text-gray-900 leading-[1] tracking-tight">
                platform for Japanese
              </Title>
              <div className="h-32 md:h-40 flex items-center">
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  className="text-[60px]! md:text-[80px] font-black inline-block tracking-tight"
                >
                  {displayText}
                  <span className="animate-blink text-gray-400 font-light ml-2">|</span>
                </Text>
              </div>
            </div>

            <Group className="pt-8" gap="lg">
              <Button
                size="xl"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                rightSection={<span className="text-xl">→</span>}
                className="shadow-xl shadow-blue-500/20 hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 font-bold"
                styles={{
                  root: {
                    height: '64px',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    fontSize: '20px',
                  }
                }}
              >
                Start Learning
              </Button>

              <Text c="dimmed" size="lg" fw={500} className="hidden sm:block">
                - It's free to try!
              </Text>
            </Group>

            <Text c="dimmed" className="text-lg pt-4 font-medium">
              Already registered?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-600 hover:underline font-bold transition-colors">
                Sign in
              </Link>
            </Text>
          </div>

          {/* Right Content - Bear Illustration */}
          <div className="relative flex items-center justify-center flex-1 w-full max-w-xl">
            <div className="relative w-full aspect-square">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-yellow-200/20 to-red-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Bear character */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-[320px] md:text-[450px] leading-none transform hover:scale-105 hover:rotate-3 transition-transform duration-500 select-none drop-shadow-2xl">
                  🐻
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
