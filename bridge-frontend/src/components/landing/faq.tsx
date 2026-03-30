import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqSection() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-32">
          <h2 className="text-5xl md:text-7xl text-center" 
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Frequently <br />
            <span className="italic">Asked Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">

            <AccordionItem value="item-1" className="bg-[#111] border border-white/10 rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold text-white py-5 hover:no-underline">
                Is there a minimum amount I can send?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                Yes, to keep costs processing-efficient for our users, our minimum transfer threshold starts at $5.00 USD.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-[#111] border border-white/10 rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold text-white py-5 hover:no-underline">
                Which cards are accepted by the bridge?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                We accept all major global debit and credit cards, including Visa, Mastercard, and American Express. Apple Pay and Google Pay processing streams are fully active too.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-[#111] border border-white/10 rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold text-white py-5 hover:no-underline">
                How exactly is this protected?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                Every interaction routes directly via multi-layer bank-grade SSL encryption streams. We do not personally store your raw card data, nor do we retain custody of funds beyond mapping the bridge pipeline routes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-[#111] border border-white/10 rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold text-white py-5 hover:no-underline">
                Are there any hidden conversion fees?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                Zero. What you see on the screen before you click "Transfer" is exactly what the recipient gets and exactly what your card is charged. We provide real-time routing transparently.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-[#111] border border-white/10 rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold text-white py-5 hover:no-underline">
                What happens if my transfer is delayed?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                While 99% of our transfers happen in seconds, rare edge cases involving banking fraud checks may cause brief delays. If your transfer does not complete within 10 minutes, our auto-refund trigger kicks back the funds to your card immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-[#111] border border-white/10 rounded-xl px-6">
              <AccordionTrigger className="text-lg font-bold text-white py-5 hover:no-underline">
                What if I lose access to my Google account?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm leading-relaxed pb-5">
                Since we use secure Google OAuth, your access depends on your Google credentials. If locked out, simply recover your Google account through their official channels, and you will regain access to Bridge Protocol immediately.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>
    </section>
  );
}