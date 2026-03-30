import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
      <nav className="max-w-5xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#FF4500] rounded-sm rotate-45"></div>
          <span className="text-lg font-bold tracking-tight font-manrope">Bridge</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Product</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Solutions</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Resources</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white">Log In</a>
          <Button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-6 py-2 transition-transform active:scale-95">
            <span className="absolute inset-0 border border-white/10 rounded-full"></span>
            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#FF4500_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-[1px] rounded-full bg-black"></span>
            <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              Get Access <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
