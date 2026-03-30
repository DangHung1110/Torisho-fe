'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../src/components/Header';
import HeroSection from '../src/components/HeroSection';
import FeaturesSection from '../src/components/FeaturesSection';
import AdventureSection from '../src/components/AdventureSection';
import PricingSection from '../src/components/PricingSection';
import RoadmapSection from '../src/components/RoadmapSection';
import Footer from '../src/components/Footer';
import { useAuth } from '../src/libs/useAuth';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to adventure
    if (!loading && isAuthenticated) {
      router.replace('/adventure');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading or home page for non-authenticated users
  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AdventureSection />
        <PricingSection />
        <RoadmapSection />
      </main>
      <Footer />
    </div>
  );
}
