
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
      <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 relative z-10">

        <div className="text-center max-w-5xl mx-auto relative z-10">
          <Badge variant="secondary" className="bg-white/5 border-white/10 backdrop-blur-md mb-8 animate-fade-up px-4 py-1.5" style={{animationDelay: '0.1s'}}>
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4500]"></span>
            </span>
            <span className="text-xs font-medium text-orange-100/90 tracking-wide font-manrope">
              Bridge Protocol 2.0 is now live
            </span>
            <span className="w-3 h-3 text-orange-400 ml-2">→</span>
          </Badge>

          <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter font-manrope leading-[1.1] mb-8 animate-fade-up" style={{animationDelay: '0.2s'}}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Bridge Intelligence</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              for the <span className="text-[#FF4500] inline-block relative">
                Future
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#FF4500] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{animationDelay: '0.3s'}}>
            Bridge blends advanced financial technology with instant crypto conversion to move money across borders 10x faster.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up" style={{animationDelay: '0.4s'}}>
            <Button className="shiny-cta group">
              <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                Start Bridging <span>→</span>
              </span>
            </Button>
            
            <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">
              <span className="mr-2">⚡</span>
              View Demo
            </Button>
          </div>
        </div>

        <div className="w-full mt-32 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-10 opacity-60 hover:opacity-100 transition-opacity">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase shrink-0">Integrated with:</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center w-full">
              <div className="flex items-center gap-2 font-semibold font-manrope"><div className="w-6 h-6 bg-white/20 rounded-full"></div>VISA</div>
              <div className="flex items-center gap-2 font-semibold font-manrope"><div className="w-6 h-6 bg-white/20 rounded-full"></div>MASTERCARD</div>
              <div className="flex items-center gap-2 font-semibold font-manrope"><div className="w-6 h-6 bg-white/20 rounded-full"></div>BITCOIN</div>
              <div className="flex items-center gap-2 font-semibold font-manrope"><div className="w-6 h-6 bg-white/20 rounded-full"></div>ETHEREUM</div>
            </div>
          </div>
        </div>

      </section>
  );
}
