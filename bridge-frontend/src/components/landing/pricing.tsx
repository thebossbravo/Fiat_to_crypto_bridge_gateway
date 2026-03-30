import { Card, CardContent } from "@/components/ui/card";

export default function PricingSection() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-32">
          <h2 className="text-5xl md:text-7xl text-center" 
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple, <br />
            <span className="italic">Low Cost.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-2xl">$</span>
                </div>
                <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">01</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Small <br />Transfers
              </h3>
              <p className="text-gray-400 text-lg leading-snug mb-6">
                Perfect for sending quick cash to friends.
              </p>
              <div className="text-4xl font-bold text-[#FF4500] mb-4">0.5%</div>
              <p className="text-gray-400 text-sm">Capped at $5 per transaction. No monthly fees.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#FF4500] rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.3)] transition-all duration-500 group cursor-pointer md:mt-24">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <span className="text-black text-2xl">$</span>
                </div>
                <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">02</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Large <br />Volume
              </h3>
              <p className="text-black/70 text-lg leading-snug mb-6">
                Optimized for moving larger balances.
              </p>
              <div className="text-4xl font-bold text-black mb-4">Flat $10</div>
              <p className="text-black/70 text-sm">For amounts over $2,000. Save hundreds vs traditional banks.</p>
            </CardContent>
          </Card>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>
    </section>
  );
}
