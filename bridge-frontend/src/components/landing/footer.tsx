export default function FooterSection() {
  return (
    <footer className="py-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="w-full md:w-auto">
            <h2 className="text-[10vw] leading-[0.8] tracking-tighter text-white/10 font-bold select-none pointer-events-none">
              BRIDGE.
            </h2>
          </div>
          
          <div className="flex flex-col gap-8 text-right">
            <div className="flex flex-col gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-sm text-gray-600">© 2026 Bridge Protocol. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
