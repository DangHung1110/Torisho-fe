'use client';

import Link from 'next/link';
import {
  IconCheck as Check,
  IconCrown as Crown,
  IconDiamond as Gem,
  IconSparkles as Sparkles,
} from '@tabler/icons-react';

const plans = [
  {
    name: 'Monthly',
    price: '$8.99',
    period: '/ month',
    description: 'Pay monthly and cancel anytime. A low-commitment way to build a real study habit.',
    highlight: '',
    accent: '#f5a623',
    Icon: Sparkles,
    features: ['Full JLPT path access', 'Daily quizzes', 'Dictionary saves'],
  },
  {
    name: 'Yearly',
    price: '$6.99',
    period: '/ month',
    description: 'For serious learners who want a steady year of lessons, review, and progress tracking.',
    highlight: 'Most popular',
    accent: '#006b5f',
    Icon: Crown,
    features: ['Everything in Monthly', 'Lower monthly price', 'Best for consistent study'],
  },
  {
    name: 'Lifetime',
    price: '$274.99',
    period: 'one-time',
    description: 'Permanent access for learners who want Torisho as their long-term Japanese base.',
    highlight: '',
    accent: '#9b72cf',
    Icon: Gem,
    features: ['Lifetime curriculum access', 'Future feature updates', 'Premium add-on option'],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="border-y border-[#d7c3ae] bg-[#fff8f4] py-12 sm:py-16">
      <div className="torisho-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="torisho-eyebrow mb-3">Pricing</p>
          <h2 className="torisho-section-title">Pick the Pace That Fits</h2>
          <p className="torisho-section-copy mx-auto mt-3 max-w-2xl">
            Affordable subscriptions for regular study, plus a lifetime option for learners who
            want permanent access.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map(({ Icon, ...plan }) => (
            <article
              key={plan.name}
              className="relative flex min-h-[455px] flex-col overflow-hidden rounded-lg border border-[#d7c3ae] bg-white shadow-[0_6px_18px_rgba(26,20,16,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(54,37,20,0.12)]"
            >
              {plan.highlight && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#006b5f] shadow-sm">
                  {plan.highlight}
                </span>
              )}
              <div className="flex h-28 items-center justify-center" style={{ backgroundColor: plan.accent }}>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-sm">
                  <Icon size={32} color={plan.accent} stroke={1.8} />
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="torisho-display text-2xl font-semibold text-[#211a12]">
                  {plan.name}
                </h3>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-4xl font-extrabold leading-none text-[#211a12]">{plan.price}</span>
                  <span className="pb-1 text-sm font-semibold text-[#665744]">{plan.period}</span>
                </div>
                <p className="mt-4 min-h-[66px] text-sm leading-6 text-[#665744]">{plan.description}</p>

                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[#3d2a17]">
                      <Check className="mt-0.5 flex-shrink-0 text-[#006b5f]" size={17} stroke={2.2} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-[#f5a623] px-6 py-3 text-sm font-bold text-[#291800] transition-colors hover:bg-[#ffb955]"
                >
                  Start Your Trial
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-lg border border-[#d7c3ae] bg-white p-5 shadow-[0_6px_18px_rgba(26,20,16,0.05)] sm:p-6">
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[0.8fr_1fr_auto]">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c4e7ff] text-[#00658a]">
                <Sparkles size={30} />
              </span>
              <div>
                <h3 className="torisho-display text-2xl font-semibold text-[#211a12]">
                  Torisho Premium Add-on
                </h3>
                <p className="mt-1 text-sm text-[#665744]">Only available with Torisho Lifetime.</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-[#665744]">
              Add extra premium features to the lifetime plan when you are ready to go deeper with
              your study setup.
            </p>
            <div className="text-left lg:text-right">
              <p className="text-sm font-semibold text-[#857462] line-through">$199.99</p>
              <p className="text-3xl font-extrabold text-[#00658a]">$49.99</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
