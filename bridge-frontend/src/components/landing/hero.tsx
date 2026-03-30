
export default function HeroSection() {
  return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
      
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-screen">
            <img src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024" alt="Atmosphere" className="w-full h-full object-cover object-center opacity-80" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
        </div>

       <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center h-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay" 
                style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 12px rgba(255,255,255,0.71)' }}>
              Bridge. <br />
              <span className="italic font-light text-[#ffe0e0]">The crypto bridge.</span>
            </h1>
            
            <p className="text-base md:text-lg text-[#ffe0e0]/90 max-w-lg mx-auto mb-16 font-light tracking-wide leading-relaxed mix-blend-overlay"
               style={{ textShadow: '0 0 12px rgba(255,255,255,0.71)' }}>
              We turn fiat into crypto instantly. A bridge protocol for those who dare to move money across borders.
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#FF4500]/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-3 text-xs md:text-sm text-white/80 uppercase tracking-widest hover:bg-white/10 transition-colors duration-300">
                  <span>Start Bridging</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-8 font-mono">
                <span>11:11 PM</span>
                <span className="w-px h-3 bg-white/20"></span>
                <span>GLOBAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

  );
}
