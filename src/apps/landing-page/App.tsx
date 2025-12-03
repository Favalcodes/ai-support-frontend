import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CTASection } from './sections/CTASection';
import { HeroSection } from './sections/HomeSection';
import { FeaturesSection } from './sections/FeatureSection';
import { HowItWorksSection } from './sections/HowItWorks';
import { PricingSection } from './sections/PricingSection';
import { ContactSection } from './sections/ContactSection';
import { ChatWidgetContainer } from '../chat-widget/components/ChatWidgetContainer';

export const LandingPageApp: React.FC = () => {
  // Use a demo company ID for the landing page widget
  const DEMO_COMPANY_ID = 'd37e75b2-e62f-4c76-a339-e8b125d85706';

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

      {/* Chat Widget */}
      <ChatWidgetContainer
        companyId={DEMO_COMPANY_ID}
        position="bottom-right"
      />
    </div>
  );
};