import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqSection() {
  return (
    <section id="faq" className="px-8 py-24 border-t border-border bg-secondary/20">
      <div className="text-center mb-16">
        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 tracking-[-0.04em]">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Still have questions? We are here to clear them up.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">

          <AccordionItem value="item-1" className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-lg font-heading font-bold text-foreground py-5 hover:no-underline">
              Is there a minimum amount I can send?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              Yes, to keep costs processing-efficient for our users, our minimum transfer threshold starts at $5.00 USD.
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 2 */}
          <AccordionItem value="item-2" className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-lg font-heading font-bold text-foreground py-5 hover:no-underline">
              Which cards are accepted by the bridge?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              We accept all major global debit and credit cards, including Visa, Mastercard, and American Express. Apple Pay and Google Pay processing streams are fully active too.
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 3 */}
          <AccordionItem value="item-3" className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-lg font-heading font-bold text-foreground py-5 hover:no-underline">
              How exactly is this protected?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              Every interaction routes directly via multi-layer bank-grade SSL encryption streams. We do not personally store your raw card data, nor do we retain custody of funds beyond mapping the bridge pipeline routes.
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 4 (New) */}
          <AccordionItem value="item-4" className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-lg font-heading font-bold text-foreground py-5 hover:no-underline">
              Are there any hidden conversion fees?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              Zero. What you see on the screen before you click "Transfer" is exactly what the recipient gets and exactly what your card is charged. We provide real-time routing transparently.
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 5 (New) */}
          <AccordionItem value="item-5" className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-lg font-heading font-bold text-foreground py-5 hover:no-underline">
              What happens if my transfer is delayed?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              While 99% of our transfers happen in seconds, rare edge cases involving banking fraud checks may cause brief delays. If your transfer does not complete within 10 minutes, our auto-refund trigger kicks back the funds to your card immediately.
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 6 (New) */}
          <AccordionItem value="item-6" className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-lg font-heading font-bold text-foreground py-5 hover:no-underline">
              What if I lose access to my Google account?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              Since we use secure Google OAuth, your access depends on your Google credentials. If locked out, simply recover your Google account through their official channels, and you will regain access to Bridge Protocol immediately.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </section>
  );
}