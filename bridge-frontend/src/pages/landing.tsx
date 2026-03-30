import Navigation from '@/components/landing/navigation';
import HeroSection from '@/components/landing/hero';
import BenefitsSection from '@/components/landing/benefits';
import HowItWorksSection from '@/components/landing/how-it-works';
import PricingSection from '@/components/landing/pricing';
import FaqSection from '@/components/landing/faq';
import FooterSection from '@/components/landing/footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      <div 
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' /%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-60 blur-3xl"
          style={{
            background: '#FFE4E1',
            animation: 'float 6s infinite ease-in-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-60 blur-3xl"
          style={{
            background: '#E6E6FA',
            animation: 'float 6s infinite ease-in-out 3s'
          }}
        />
      </div>

      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <FooterSection />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}