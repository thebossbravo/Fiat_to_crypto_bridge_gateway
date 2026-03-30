import Navigation from '@/components/landing/navigation';
import HeroSection from '@/components/landing/hero';
import MissionSection from '@/components/landing/mission';
import FreedomSection from '@/components/landing/freedom';
import HowItWorksSection from '@/components/landing/how-it-works';
import PricingSection from '@/components/landing/pricing';
import FaqSection from '@/components/landing/faq';
import FooterSection from '@/components/landing/footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
          mixBlendMode: 'overlay'
        }}
      />

      <Navigation />
      <HeroSection />
      <MissionSection/>
      <FreedomSection/>

      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <FooterSection />
    </div>
  );
}