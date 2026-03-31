
export default function FreedomSection() {
  return (

      <section className="py-40 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
           <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight text-white/90 mb-12" 
                style={{ fontFamily: "'Playfair Display', serif" }}>
              We bridge the gap where your money truly flows.
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
              Speed is refusal. We remove the delays so your transactions move with absolute clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#FF4500] rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.3)] transition-all duration-500 group cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <span className="text-black text-2xl">⚡</span>
                </div>
                <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">01</span>
              </div>
              
              <div>
                <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  Instant <br />Transfer
                </h3>
                <p className="text-black/70 text-lg leading-snug">
                  You have the money. We provide the bridge for it to flow across borders in seconds.
                </p>
              </div>
              
              <div className="w-full h-px bg-black/10 mt-8"></div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500 md:mt-24">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-2xl">→</span>
                </div>
                <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">02</span>
              </div>
              
              <div>
                <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  Secure <br />Protocol
                </h3>
                <p className="text-gray-400 text-lg leading-snug">
                  Your funds are protected. Bank-grade encryption ensures your money never leaves your sight.
                </p>
              </div>
              
              <div className="w-full h-px bg-white/10 mt-8"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </section>
  );
}
