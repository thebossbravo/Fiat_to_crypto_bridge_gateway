import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function FooterSection() {
  return (
    <footer className="bg-[#292524] text-white px-6 py-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{ letterSpacing: '-0.025em' }}>Your money belongs to you.</h2>
        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          We never lock up your funds or hold them hostage. Our protocol simply builds the bridge to move your cash from point A to point B as safely and cheaply as possible.
        </p>

        <Button 
          size="lg" 
          className="bg-[#FFB7B2] text-[#292524] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}
        >
          Get Started in 60 Seconds
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="border-t border-white/10 mt-16 pt-8 text-center">
          <p className="text-xs text-white/40">
            © 2026 Bridge Protocol. All rights reserved. Built with compliance and speed.
          </p>
        </div>
      </div>
    </footer>
  );
}
