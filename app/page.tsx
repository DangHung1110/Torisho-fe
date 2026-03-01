import Header from '../src/components/Header';
import HeroSection from '../src/components/HeroSection';
import FeaturesSection from '../src/components/FeaturesSection';
import AdventureSection from '../src/components/AdventureSection';
import PricingSection from '../src/components/PricingSection';
import RoadmapSection from '../src/components/RoadmapSection';
import Footer from '../src/components/Footer';

export default function Home() {
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
