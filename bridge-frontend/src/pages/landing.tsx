import React from 'react';
import { ArrowRight, Shield, Zap, CheckCircle, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* 🌐 Global Effects: Grain Overlay */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* 🌐 Background Blobs */}
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

      {/* 📱 Navigation - Floating Pill */}
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

      {/* 🌊 Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="text-center max-w-2xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight" style={{ letterSpacing: '-0.025em' }}>
            Send Money Across Borders.
            <br />
            <span className="italic" style={{ fontFamily: "'Reenie Beanie', cursive" }}>Instantly.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg text-[#78716C] mb-8 max-w-lg mx-auto leading-relaxed">
            Stop waiting days for bank transfers. Move your money in seconds with bank-level security and zero hidden fees.
          </p>

          {/* CTA Buttons */}
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

      {/* ⚡ Benefits Section */}
      <section className="px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ letterSpacing: '-0.025em' }}>Why Choose Bridge</h2>
          <p className="text-lg text-[#78716C] max-w-2xl mx-auto">Move funds without the stress, delays, or hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Speed Card */}
          <Card className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-shadow" style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-[#E8EFE8] rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#292524]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Faster than a text message.</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                Traditional bank wires take 3 to 5 days. With us, your money arrives before you even close the app.
              </p>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-shadow" style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-[#E8EFE8] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#292524]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-grade protection.</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                We use the exact same encryption standards as global financial institutions. Your funds are always protected.
              </p>
            </CardContent>
          </Card>

          {/* Simplicity Card */}
          <Card className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-shadow" style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-[#E8EFE8] rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-[#292524]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Log in with Google.</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                No complex passwords. Access your money safely using the Google account you already own.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 🗺️ How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-[#EFEDF4]">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ letterSpacing: '-0.025em' }}>How It Works</h2>
          <p className="text-lg text-[#78716C] max-w-2xl mx-auto">Three simple steps to move your money across borders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FFB7B2] text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
              01
            </div>
            <h3 className="text-xl font-bold mb-2">Sign Up</h3>
            <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mx-auto">
              Tap the button and log in with your Google account. It takes 5 seconds.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#FFB7B2] text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
              02
            </div>
            <h3 className="text-xl font-bold mb-2">Pay with Your Card</h3>
            <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mx-auto">
              Enter the amount and pay securely with your standard debit or credit card.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#FFB7B2] text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
              03
            </div>
            <h3 className="text-xl font-bold mb-2">Delivered</h3>
            <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mx-auto">
              Money is converted and delivered instantly. You get a receipt, and you're good to go.
            </p>
          </div>
        </div>
      </section>

      {/* 📊 Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ letterSpacing: '-0.025em' }}>Simple, Low Cost.</h2>
          <p className="text-lg text-[#78716C] max-w-2xl mx-auto">No processing games. You see exactly what you pay before you hit send.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white rounded-[2rem] p-8 shadow-lg" style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
            <CardContent className="p-0">
              <h3 className="text-xl font-bold mb-2">Small Transfers</h3>
              <p className="text-[#78716C] text-sm mb-4">Perfect for sending quick cash to friends.</p>
              <div className="text-4xl font-bold text-[#FFB7B2] mb-4">0.5%</div>
              <p className="text-[#78716C] text-sm">Capped at $5 per transaction. No monthly fees.</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-[2rem] p-8 shadow-lg border-2 border-[#FFB7B2]" style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Large Volume</h3>
                <span className="bg-[#FFB7B2] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Best Value</span>
              </div>
              <p className="text-[#78716C] text-sm mb-4">Optimized for moving larger balances.</p>
              <div className="text-4xl font-bold text-[#FFB7B2] mb-4">Flat $10</div>
              <p className="text-[#78716C] text-sm">For amounts over $2,000. Save hundreds vs traditional banks.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 💬 FAQ Section */}
      <section id="faq" className="px-6 py-20 bg-[#E8EFE8]">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ letterSpacing: '-0.025em' }}>Frequently Asked Questions</h2>
          <p className="text-lg text-[#78716C] max-w-2xl mx-auto">Still have questions? We're here to help.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-[1rem] border border-[#E2E8F0] px-6">
              <AccordionTrigger className="text-lg font-bold py-5 hover:no-underline">
                <Plus className="w-5 h-5 mr-3 transition-transform" />
                Is there a minimum amount I can send?
              </AccordionTrigger>
              <AccordionContent className="text-[#78716C] text-sm leading-relaxed pb-5 pl-8">
                Yes, our minimum transfer threshold is $5.00 USD to keep processing efficient for everyone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-[1rem] border border-[#E2E8F0] px-6">
              <AccordionTrigger className="text-lg font-bold py-5 hover:no-underline">
                <Plus className="w-5 h-5 mr-3 transition-transform" />
                Which cards are accepted?
              </AccordionTrigger>
              <AccordionContent className="text-[#78716C] text-sm leading-relaxed pb-5 pl-8">
                We accept all major debit and credit cards including Visa, Mastercard, and American Express. Apple Pay and Google Pay work too.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-[1rem] border border-[#E2E8F0] px-6">
              <AccordionTrigger className="text-lg font-bold py-5 hover:no-underline">
                <Plus className="w-5 h-5 mr-3 transition-transform" />
                How is this protected?
              </AccordionTrigger>
              <AccordionContent className="text-[#78716C] text-sm leading-relaxed pb-5 pl-8">
                We use bank-grade SSL encryption for all interactions. We don't store your card data and never hold custody of your funds.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 🛡️ Trust Footer */}
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
              &copy; 2026 Bridge Protocol. All rights reserved. Built with compliance and speed.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}