'use client';

import Link from 'next/link';
import { IconBrandX, IconBrandDiscord } from '@tabler/icons-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-gray-900 to-black py-16! md:py-24! text-gray-400">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto! max-w-[1200px]! px-6!">
        <div className="grid! grid-cols-1 md:grid-cols-3! gap-8!">
          <div className="text-left! md:text-left!">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="h-10 w-10 overflow-hidden rounded-full shadow-lg shadow-orange-500/20">
                <Image src="/images/torisho-logo.png" alt="Torisho" width={40} height={40} className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Torisho</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              Your all-in-one platform for Japanese language learning.
            </p>
          </div>

          <div className="text-left! md:text-left!">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">About</h4>
            <ul className="space-y-2.5 text-sm">
              {['Our Method', 'Announcements', 'Roadmap', 'Pricing', 'Resources', 'Acknowledgements'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 transition-colors duration-200 hover:text-gray-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left! md:text-left!">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Study Tools</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                'Kanji & Vocabulary Dictionary',
                'Grammar Library',
                'Premade Study Lists',
                'Adventure',
                'Kana Trainer',
                'Conjugation Trainer',
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 transition-colors duration-200 hover:text-gray-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left! md:text-left!">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Information</h4>
            <ul className="space-y-2.5 text-sm mb-8">
              {['Community', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Contact' ? 'mailto:support@torisho.io' : '#'}
                    className="text-gray-500 transition-colors duration-200 hover:text-gray-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Social</h4>
            <div className="flex gap-3">
              <Link
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 text-gray-500 transition-all duration-200 hover:bg-white/10 hover:text-gray-200"
              >
                <IconBrandX size={16} />
              </Link>
              <Link
                href="#"
                aria-label="Discord"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 text-gray-500 transition-all duration-200 hover:bg-white/10 hover:text-gray-200"
              >
                <IconBrandDiscord size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-stretch gap-6 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-gray-600 sm:text-left">Torisho © 2026 · All rights reserved</p>
          <div className="text-center text-xs text-gray-600 sm:text-right">Built for focused Japanese learning</div>
        </div>
      </div>
    </footer>
  );
}
