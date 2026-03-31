import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, ArrowRight } from "lucide-react";
import { useCreateTransaction } from '@/hooks/useTransactions';

interface PaymentFormProps {
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
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
    } catch (error) {
      onError?.('Failed to create transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <Card className="bg-black/60 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Bridge Payment
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Convert fiat to USDC on Base network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-white">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/40 border-white/20 text-white placeholder:text-zinc-500 backdrop-blur-sm"
                min="10"
                step="0.01"
                required
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24 bg-black/40 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/80 border-white/20 backdrop-blur-sm">
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
                  className="border-white/20 text-zinc-300 hover:bg-white/5 backdrop-blur-sm"
                  onClick={() => setAmount(preset.toString())}
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Fee Information */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2 backdrop-blur-sm">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Processing Fee</span>
              <span className="text-white">2.9% + $0.30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Network Fee</span>
              <span className="text-white">~$2.00</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-white">Total Fee</span>
              <span className="text-[#FF4500]">
                {amount ? `$${(parseFloat(amount) * 0.029 + 0.30 + 2.00).toFixed(2)}` : '$0.00'}
              </span>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              You'll receive approximately
            </div>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              {amount ? `${(parseFloat(amount) * 0.99).toFixed(2)} USDC` : '0.00 USDC'}
            </Badge>
          </div>

          {/* Submit Button */}
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

          {/* Security Notice */}
          <div className="text-xs text-zinc-500 text-center">
            <p>Secured by Stripe • PCI DSS Compliant</p>
            <p className="mt-1">Funds converted to USDC on Base network</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
