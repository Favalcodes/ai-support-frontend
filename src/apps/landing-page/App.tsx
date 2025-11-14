import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CTASection } from './sections/CTASection';
import { HeroSection } from './sections/HomeSection';
import { FeaturesSection } from './sections/FeatureSection';
import { HowItWorksSection } from './sections/HowItWorks';
import { PricingSection } from './sections/PricingSection';
import { ContactSection } from './sections/ContactSection';

export const LandingPageApp: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};