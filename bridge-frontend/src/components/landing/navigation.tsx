import React from 'react';
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <header className="fixed top-6 left-4 right-4 z-40 max-w-[calc(100%-2rem)] mx-auto">
      <nav className="bg-white/70 backdrop-blur-[20px] rounded-full px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFB7B2] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-lg">Bridge</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-sm font-medium text-[#78716C] hover:text-[#292524] transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm font-medium text-[#78716C] hover:text-[#292524] transition-colors">Pricing</a>
          <a href="#faq" className="text-sm font-medium text-[#78716C] hover:text-[#292524] transition-colors">FAQ</a>
        </div>

        {/* CTA */}
        <Button className="bg-[#292524] text-white px-6 py-2 rounded-full font-medium hover:bg-[#292524]/90 transition-colors">
          Get Started
        </Button>
      </nav>
    </header>
  );
}
