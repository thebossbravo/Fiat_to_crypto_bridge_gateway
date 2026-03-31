import Navigation from '@/components/landing/navigation';
import HeroSection from '@/components/landing/hero';

import FreedomSection from '@/components/landing/freedom';
import HowItWorksSection from '@/components/landing/how-it-works';
import PricingSection from '@/components/landing/pricing';
import FaqSection from '@/components/landing/faq';
import FooterSection from '@/components/landing/footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-inter relative overflow-x-hidden selection-orange">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black"></div>
        <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]"></div>
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
      </div>

      <div className="gradient-blur"></div>

      <Navigation />
      <HeroSection />
      <FreedomSection/>

      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <FooterSection />
    </div>
  );
}