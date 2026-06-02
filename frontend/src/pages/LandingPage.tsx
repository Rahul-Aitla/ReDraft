import React from 'react';
import { LandingHero } from '../components/LandingHero';
import { Features } from '../components/Features';
import { CTA } from '../components/ui/cta';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHero />
      <Features />
      <CTA />
    </div>
  );
};

export default LandingPage;
