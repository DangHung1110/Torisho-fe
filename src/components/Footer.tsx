'use client';

import Link from 'next/link';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Dictionary', href: '/dictionary' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#d7c3ae] bg-[#fff1e4] py-10">
      <div className="torisho-shell flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-[#d7c3ae]">
            {'\uD83D\uDC14'}
          </span>
          <span className="torisho-display text-xl font-semibold text-[#7a4300]">Torisho</span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#524534] transition-colors hover:text-[#835500]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-[#665744]">Torisho &copy; 2026. Your Japanese journey begins here.</p>
      </div>
    </footer>
  );
}
