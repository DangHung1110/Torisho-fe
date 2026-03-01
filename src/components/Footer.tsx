'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-blue-900 via-purple-900 to-gray-900 text-gray-300 py-16 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">🦝</span>
              </div>
              <span className="text-2xl font-bold text-white">MaruMori</span>
            </div>
            <p className="text-sm text-gray-400">
              Your all-in-one platform for Japanese language learning
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-bold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Our Method</Link></li>
              <li><Link href="#" className="hover:text-white transition">Announcements</Link></li>
              <li><Link href="#roadmap" className="hover:text-white transition">Roadmap</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition">Resources</Link></li>
              <li><Link href="#" className="hover:text-white transition">Acknowledgements</Link></li>
            </ul>
          </div>

          {/* Study Tools */}
          <div>
            <h4 className="text-white font-bold mb-4">Study Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Kanji & Vocabulary Dictionary</Link></li>
              <li><Link href="#" className="hover:text-white transition">Grammar Library</Link></li>
              <li><Link href="#" className="hover:text-white transition">Premade Study Lists</Link></li>
              <li><Link href="#" className="hover:text-white transition">Adventure</Link></li>
              <li><Link href="#" className="hover:text-white transition">Kana Trainer</Link></li>
              <li><Link href="#" className="hover:text-white transition">Conjugation Trainer</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Community</Link></li>
              <li><Link href="mailto:support@marumori.io" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">Kitsun.io</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Fox Labs © 2026
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <span className="text-2xl">🐦</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <span className="text-2xl">💬</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <span className="text-2xl">📱</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
