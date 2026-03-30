import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function PricingSection() {
  return (
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
  );
}
