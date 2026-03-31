import { useState } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, ArrowRight } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentDialog({ open, onOpenChange, onSuccess, onError }: PaymentDialogProps) {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  const createTransaction = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 10) {
      onError?.('Minimum amount is $10');
      return;
    }

    setIsLoading(true);
    try {
      const amountCents = Math.round(parseFloat(amount) * 100);
      const result = await createTransaction(amountCents, currency);
      onSuccess?.(result.transaction_id);
      onOpenChange(false); // Close dialog on success
      setAmount(''); // Reset form
    } catch (error) {
      onError?.('Failed to create transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme === 'dark' ? 'bg-black/90 backdrop-blur-xl border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} max-w-md`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <CreditCard className="w-5 h-5" />
            Bridge Payment
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>
            Convert fiat to USDC on Base network
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="amount" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={theme === 'dark' ? 'bg-black/40 border-white/20 text-white placeholder:text-zinc-500 backdrop-blur-sm' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'}
                min="10"
                step="0.01"
                required
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className={`w-24 ${theme === 'dark' ? 'bg-black/40 border-white/20 text-white backdrop-blur-sm' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-black/80 border-white/20 backdrop-blur-sm' : 'bg-white border-gray-200'}>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Preset Amounts */}
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={theme === 'dark' ? 'border-white/20 text-zinc-300 hover:bg-white/5 backdrop-blur-sm' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
                  onClick={() => setAmount(preset.toString())}
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 space-y-2 backdrop-blur-sm`}>
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Processing Fee</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>2.9% + $0.30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Network Fee</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>~$2.00</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Total Fee</span>
              <span className="text-[#FF4500]">
                {amount ? `$${(parseFloat(amount) * 0.029 + 0.30 + 2.00).toFixed(2)}` : '$0.00'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
              You'll receive approximately
            </div>
            <Badge variant="secondary" className={theme === 'dark' ? 'bg-white/10 text-white border-white/20' : 'bg-gray-100 text-gray-800 border-gray-200'}>
              {amount ? `${(parseFloat(amount) * 0.99).toFixed(2)} USDC` : '0.00 USDC'}
            </Badge>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#FF4500] hover:bg-[#FF6B35] text-white"
            disabled={isLoading || !amount || parseFloat(amount) < 10}
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'} text-center`}>
            <p>Secured by Stripe • PCI DSS Compliant</p>
            <p className="mt-1">Funds converted to USDC on Base network</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
