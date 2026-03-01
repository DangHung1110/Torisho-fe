'use client';

import { Container, Title, Text, SimpleGrid, Paper, Badge, Button, Group, Box } from '@mantine/core';

const plans = [
  {
    name: 'Monthly',
    price: '$8.99',
    period: '',
    description: 'Pay monthly and cancel anytime! The best option if you are not fully committed yet.',
    badge: null,
    color: 'from-orange-400 to-red-400',
    buttonColor: 'orange',
    mascot: '🦊'
  },
  {
    name: 'Yearly',
    price: '$6.99 / Month',
    period: '',
    originalPrice: '($83.88)',
    description: 'For serious learners, committed to their language learning goals. Our most popular option.',
    badge: 'MOST POPULAR',
    color: 'from-pink-400 to-rose-400',
    buttonColor: 'pink',
    mascot: '👑'
  },
  {
    name: 'Lifetime',
    price: '$274.99',
    period: '',
    originalPrice: '$349.99',
    description: 'Are you dedicated to learning Japanese, want to support us and want to be part of our community forever? Then this is the plan for you!*',
    badge: null,
    color: 'from-purple-400 to-indigo-400',
    buttonColor: 'grape',
    mascot: '🥷'
  },
  {
    name: 'Kitsun Lifetime Add-on',
    price: '$49.99',
    period: '',
    originalPrice: '$199.99',
    description: 'Only $49.99 to also get Kitsun lifetime as an add-on when you get MaruMori Lifetime!',
    badge: null,
    color: 'from-blue-400 to-cyan-400',
    buttonColor: 'cyan',
    special: 'Only Available With MM Lifetime',
    mascot: '🦊'
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <Container size="xl">
        <div className="text-center mb-24">
          <Title order={2} className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            Pricing
          </Title>
          <Text size="xl" c="dimmed" className="max-w-3xl mx-auto leading-relaxed font-medium">
            Next to our affordable subscriptions, we also offer a one-time payment lifetime plan
            and a special bundle deal for getting MaruMori and Kitsun together!
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="2rem" className="mb-16">
          {plans.slice(0, 3).map((plan, index) => (
            <Paper
              key={index}
              radius="2rem"
              className="relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col border-2 border-transparent hover:border-blue-100 shadow-xl"
            >
              {plan.badge && (
                <div className="absolute top-6 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-8 py-1 shadow-md z-10 uppercase tracking-widest transform rotate-45 translate-x-8">
                  {plan.badge}
                </div>
              )}

              <div className={`h-48 bg-gradient-to-br ${plan.color} flex items-end justify-center pb-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 opacity-50 patterned-bg"></div>
                <div className="text-[100px] transform hover:scale-110 transition-transform duration-300 select-none drop-shadow-lg z-10">{plan.mascot}</div>
              </div>

              <div className="p-10 text-center flex-1 flex flex-col bg-white">
                <Title order={3} className="text-3xl font-black text-gray-900 mb-6">
                  {plan.name}
                </Title>

                <div className="mb-8">
                  {plan.originalPrice && (
                    <Text td="line-through" c="dimmed" size="lg" fw={500} className="mb-1">
                      {plan.originalPrice}
                    </Text>
                  )}
                  <Text className="text-5xl font-black text-slate-800 mb-2 tracking-tight">
                    {plan.price}
                  </Text>
                  {plan.period && (
                    <Text size="md" c="dimmed" fw={600} className="uppercase tracking-wide">{plan.period}</Text>
                  )}
                </div>

                <Text className="text-gray-600 mb-10 leading-relaxed flex-1 font-medium">
                  {plan.description}
                </Text>

                <Button
                  fullWidth
                  size="xl"
                  radius="xl"
                  color={plan.buttonColor}
                  className="shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  Start Your 14-Day Trial
                </Button>
              </div>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Kitsun Add-on Card */}
        <Container size="md" className="p-0">
          <Paper radius="2rem" shadow="xl" className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-100 bg-white">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className={`md:w-2/5 bg-gradient-to-br ${plans[3].color} flex items-center justify-center py-12 md:py-0 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 opacity-30"></div>
                <div className="text-9xl select-none drop-shadow-xl z-10 transform hover:rotate-6 transition-transform duration-500">{plans[3].mascot}</div>
              </div>

              <div className="flex-1 p-10 md:p-12 text-center md:text-left flex flex-col justify-center">
                <Title order={3} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  {plans[3].name}
                </Title>

                <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
                  <Text td="line-through" c="dimmed" size="2xl" fw={600}>
                    {plans[3].originalPrice}
                  </Text>
                  <Text className="text-5xl font-black text-blue-500 tracking-tight">
                    {plans[3].price}
                  </Text>
                </div>

                <Text size="lg" className="text-gray-600 mb-6 leading-relaxed font-medium">
                  {plans[3].description}
                </Text>

                <Text c="blue" fw={800} size="sm" className="mb-8 uppercase tracking-widest bg-blue-50 py-2 px-4 rounded-lg inline-block self-center md:self-start">
                  {plans[3].special}
                </Text>

                <Button
                  fullWidth
                  size="xl"
                  radius="xl"
                  color={plans[3].buttonColor}
                  className="shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                >
                  Start Your 14-Day Trial
                </Button>
              </div>
            </div>
          </Paper>
        </Container>
      </Container>
    </section>
  );
}
