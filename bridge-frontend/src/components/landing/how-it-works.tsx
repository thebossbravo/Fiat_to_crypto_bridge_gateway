import React from 'react';

export default function HowItWorksSection() {
  return (
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
  );
}
