
export default function HowItWorksSection() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-32">
          <h2 className="text-5xl md:text-7xl text-center" 
              style={{ fontFamily: "'Playfair Display', serif" }}>
            How It <br />
            <span className="italic">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-[#FF4500] text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-500">
                  01
                </div>
                <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">STEP 1</span>
              </div>
              
              <div>
                <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  Sign <br />Up
                </h3>
                <p className="text-gray-400 text-lg leading-snug">
                  Tap the button and log in with your Google account. It takes 5 seconds.
                </p>
              </div>
              
              <div className="w-full h-px bg-white/10 mt-8"></div>
            </div>
          </div>

          {/* Step 2 - Offset */}
          <div className="relative group md:mt-24">
            <div className="bg-[#FF4500] rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.3)] transition-all duration-500 group cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-black/10 text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:rotate-45 transition-transform duration-500">
                  02
                </div>
                <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">STEP 2</span>
              </div>
              
              <div>
                <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  Pay with <br />Card
                </h3>
                <p className="text-black/70 text-lg leading-snug">
                  Enter the amount and pay securely with your standard debit or credit card.
                </p>
              </div>
              
              <div className="w-full h-px bg-black/10 mt-8"></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-[#FF4500] text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-500">
                  03
                </div>
                <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">STEP 3</span>
              </div>
              
              <div>
                <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  Get <br />Delivered
                </h3>
                <p className="text-gray-400 text-lg leading-snug">
                  Money is converted and delivered instantly. You get a receipt, and you're good to go.
                </p>
              </div>
              
              <div className="w-full h-px bg-white/10 mt-8"></div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>
    </section>
  );
}
