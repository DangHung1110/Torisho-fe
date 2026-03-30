'use client';

import { Container, Title, Text, SimpleGrid, Paper, Badge, Button } from '@mantine/core';

// Inline SVG icons – no emojis
const ChickenIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="38" rx="18" ry="16" fill="white" fillOpacity="0.9" />
    <circle cx="32" cy="20" r="10" fill="white" fillOpacity="0.85" />
    <path d="M24 16 Q20 10 16 14 Q18 18 24 18Z" fill="white" fillOpacity="0.7" />
    <circle cx="29" cy="19" r="2" fill="#374151" />
    <path d="M38 22 L44 20 L42 24Z" fill="white" fillOpacity="0.8" />
    <path d="M22 52 L18 60 M42 52 L46 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CrownIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 44 L14 20 L26 34 L32 14 L38 34 L50 20 L56 44 Z" fill="white" fillOpacity="0.9" />
    <rect x="8" y="44" width="48" height="8" rx="3" fill="white" fillOpacity="0.75" />
    <circle cx="32" cy="14" r="3.5" fill="white" fillOpacity="0.6" />
    <circle cx="14" cy="20" r="3" fill="white" fillOpacity="0.6" />
    <circle cx="50" cy="20" r="3" fill="white" fillOpacity="0.6" />
  </svg>
);

const DiamondIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8 L54 28 L32 56 L10 28 Z" fill="white" fillOpacity="0.9" />
    <path d="M10 28 L22 18 L42 18 L54 28" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.6" />
    <path d="M22 18 L32 8 L42 18 L32 28 Z" fill="white" fillOpacity="0.55" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6 L38 24 H56 L42 35 L47 53 L32 42 L17 53 L22 35 L8 24 H26 Z" fill="white" fillOpacity="0.9" />
    <circle cx="32" cy="32" r="6" fill="white" fillOpacity="0.4" />
  </svg>
);

const plans = [
  {
    name: 'Monthly',
    price: '$8.99',
    period: '/ month',
    description: 'Pay monthly and cancel anytime! The best option if you are not fully committed yet.',
    badge: null,
    color: 'from-orange-400 to-amber-400',
    buttonColor: 'orange',
    Icon: ChickenIcon,
  },
  {
    name: 'Yearly',
    price: '$6.99',
    period: '/ month',
    originalPrice: '$83.88 billed yearly',
    description: 'For serious learners, committed to their language learning goals. Our most popular option.',
    badge: 'MOST POPULAR',
    color: 'from-pink-500 to-rose-500',
    buttonColor: 'pink',
    Icon: CrownIcon,
  },
  {
    name: 'Lifetime',
    price: '$274.99',
    period: 'one-time',
    originalPrice: 'Was $349.99',
    description: 'Are you dedicated to learning Japanese, want to support us and want to be part of our community forever? Then this is the plan for you!*',
    badge: null,
    color: 'from-violet-500 to-purple-600',
    buttonColor: 'grape',
    Icon: DiamondIcon,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-gradient-to-b from-gray-50/60 to-white py-16! md:py-24!">
      <Container size="xl" className="mx-auto! max-w-[1200px]! px-6!">

        {/* Section heading */}
        <div className="text-center mb-16">
          <Title
            order={2}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Pricing
          </Title>
          <Text size="lg" c="dimmed" className="max-w-2xl mx-auto leading-relaxed">
            Next to our affordable subscriptions, we also offer a one-time payment lifetime plan
            and a special bundle deal for the premium experience!
          </Text>
        </div>

        {/* Main 3-card grid */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" className="mb-10 grid! md:grid-cols-3! gap-6!">
          {plans.map((plan, index) => (
            <Paper
              key={index}
              radius="xl"
              className="relative overflow-hidden h-full! flex! flex-col! hover:scale-105! transition-all! duration-200 hover:shadow-2xl shadow-md ring-1 ring-gray-100 cursor-pointer"
            >
              {/* Gradient header with icon */}
              <div className={`h-44 bg-gradient-to-br ${plan.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/5" />
                {/* "Most Popular" badge in header */}
                {plan.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      size="sm"
                      radius="md"
                      className="bg-white/30 text-white font-bold uppercase tracking-widest border-0 shadow-sm px-3 py-1 backdrop-blur-sm"
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <div className="z-10 transform hover:scale-110 transition-transform duration-300">
                  <plan.Icon />
                </div>
              </div>

              {/* Card body */}
              <div className="px-7 pt-7 pb-8 flex! flex-col! justify-between! flex-1 bg-white gap-4">
                <Title order={3} className="text-2xl font-black text-gray-900">
                  {plan.name}
                </Title>

                {/* Price block — fixed min-height so cards align */}
                <div className="min-h-[72px] flex flex-col justify-end">
                  {plan.originalPrice && (
                    <Text td="line-through" c="dimmed" size="sm" fw={500} className="leading-snug">
                      {plan.originalPrice}
                    </Text>
                  )}
                  <div className="flex items-baseline gap-1">
                    <Text className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                      {plan.price}
                    </Text>
                    <Text c="dimmed" size="sm" fw={500}>
                      {plan.period}
                    </Text>
                  </div>
                </div>

                <Text size="sm" className="text-gray-500 leading-relaxed flex-1">
                  {plan.description}
                </Text>

                <Button
                  fullWidth
                  size="md"
                  radius="xl"
                  color={plan.buttonColor}
                  className="mt-auto cursor-pointer shadow-sm hover:shadow-md transition-all duration-150 hover:scale-[1.02] font-semibold"
                >
                  Start Your 14-Day Trial
                </Button>
              </div>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Premium Add-on Card — full width horizontal */}
        <Paper
          radius="xl"
          shadow="sm"
          className="overflow-hidden hover:shadow-xl transition-all duration-200 ring-1 ring-gray-100 bg-white cursor-pointer"
        >
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left gradient panel */}
            <div className="md:w-[38%] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center py-12 md:py-0 relative overflow-hidden min-h-[160px]">
              <div className="absolute inset-0 bg-black/5" />
              <div className="z-10 transform hover:rotate-6 transition-transform duration-500">
                <StarIcon />
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 px-8 py-8 md:px-10 md:py-9 text-center md:text-left flex flex-col justify-center gap-4">
              <Title order={3} className="text-2xl md:text-3xl font-black text-gray-900">
                Torisho Premium Add-on
              </Title>

              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2">
                <Text td="line-through" c="dimmed" size="lg" fw={600}>
                  $199.99
                </Text>
                <Text className="text-4xl font-black text-blue-500 tracking-tight leading-none">
                  $49.99
                </Text>
              </div>

              <Text size="md" className="text-gray-500 leading-relaxed">
                Only $49.99 to get Torisho Premium features as an add-on when you get Torisho Lifetime!
              </Text>

              <Badge
                color="blue"
                variant="light"
                size="md"
                radius="md"
                className="self-center md:self-start font-bold uppercase tracking-widest"
              >
                Only Available With Torisho Lifetime
              </Badge>

              <Button
                fullWidth
                size="md"
                radius="xl"
                color="cyan"
                className="mt-1 cursor-pointer shadow-sm hover:shadow-md transition-all duration-150 hover:scale-[1.01] font-semibold"
              >
                Start Your 14-Day Trial
              </Button>
            </div>
          </div>
        </Paper>

      </Container>
    </section>
  );
}
