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
import { getPostLoginPath } from '../src/libs/rbac';

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(getPostLoginPath(user));
    }
  }, [isAuthenticated, loading, router, user]);

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
