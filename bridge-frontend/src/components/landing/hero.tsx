import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight" style={{ letterSpacing: '-0.025em' }}>
          Send Money Across Borders.
          <br />
          <span className="italic" style={{ fontFamily: "'Reenie Beanie', cursive" }}>Instantly.</span>
        </h1>
        <p className="text-lg text-[#78716C] mb-8 max-w-lg mx-auto leading-relaxed">
          Stop waiting days for bank transfers. Move your money in seconds with bank-level security and zero hidden fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-[#FFB7B2] text-[#292524] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}
          >
            Get Started in 60 Seconds
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white px-8 py-4 rounded-full font-bold border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
          >
            See How It Works
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFB7B2]">Secure</div>
            <div className="text-xs text-[#78716C] uppercase tracking-wider mt-1">Bank-Grade</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFB7B2]">Instant</div>
            <div className="text-xs text-[#78716C] uppercase tracking-wider mt-1">Settlement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFB7B2]">Direct</div>
            <div className="text-xs text-[#78716C] uppercase tracking-wider mt-1">No Middlemen</div>
          </div>
        </div>
      </div>
    </section>
  );
}
