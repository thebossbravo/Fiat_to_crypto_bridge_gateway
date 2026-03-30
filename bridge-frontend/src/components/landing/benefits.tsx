import { Shield, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function BenefitsSection() {
  return (
    <section className="px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ letterSpacing: '-0.025em' }}>Why Choose Bridge</h2>
        <p className="text-lg text-[#78716C] max-w-2xl mx-auto">Move funds without the stress, delays, or hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
  );
}
