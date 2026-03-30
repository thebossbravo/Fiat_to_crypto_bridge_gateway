import { useState } from 'react';
import { useTransactions, useWallet } from '@/hooks/useTransactions';
import { useTheme } from '@/contexts/theme-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, ArrowUpRight, ArrowDownRight, Wallet, Plus, Sun, Moon } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from '../app-sidebar';
import { PaymentDialog } from './PaymentDialog';

interface Transaction {
  id: string;
  fiat_amount_cents: number;
  crypto_amount_usdc: string | null;
  state: string;
  created_at: string;
  blockchain_tx_hash: string | null;
}

interface DashboardProps {
  walletAddress: string;
  balance: string;
  transactions: Transaction[];
  loading?: boolean;
  user?: {
    email: string;
    walletAddress: string;
  };
  onLogout: () => void;
}

export function Dashboard({ walletAddress, balance, transactions, loading, user, onLogout }: DashboardProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'completed':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'failed':
        return <ArrowUpRight className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar side="left" />
      <SidebarInset className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
        <header className={`flex h-14 shrink-0 items-center gap-2 border-b px-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <SidebarTrigger className={theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} />
          <Separator orientation="vertical" className={`mr-2 h-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <h1 className={`text-lg font-semibold font-manrope ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className={theme === 'dark' ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={() => setIsPaymentDialogOpen(true)}
              className="bg-[#FF4500] hover:bg-[#FF6B35] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Payment
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <p className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Manage your bridge transactions and wallet</p>
          </div>

          <Card className={theme === 'dark' ? 'bg-black/60 backdrop-blur-xl border-white/10 mb-8' : 'bg-white border-gray-200 shadow-sm mb-8'}>
              <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Wallet className="w-5 h-5" />
                Your Wallet
              </CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>
                  Your personal wallet address for receiving USDC
                </CardDescription>
              </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>Wallet Address</p>
                  <p className={`text-lg font-mono font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>Balance</p>
                  <p className="text-2xl font-bold text-[#FF4500]">{balance} USDC</p>
                </div>
              </div>
              <Separator className={`my-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
              <Button 
                variant="outline" 
                className={theme === 'dark' ? 'w-full border-white/20 text-zinc-300 hover:bg-white/5' : 'w-full border-gray-300 text-gray-700 hover:bg-gray-50'}
                onClick={() => copyToClipboard(walletAddress)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
            </CardContent>
            </Card>

          <Card className={theme === 'dark' ? 'bg-black/60 backdrop-blur-xl border-white/10' : 'bg-white border-gray-200 shadow-sm'}>
              <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Transaction History</CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>
                  Your recent bridge transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
              {loading ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Loading transactions...
                </div>
              ) : transactions.length === 0 ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                  No transactions yet
                </div>
                ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5 border border-white/10 backdrop-blur-sm' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            ${(tx.fiat_amount_cents / 100).toFixed(2)}
                          </span>
                            <Badge className={getStatusColor(tx.state)}>
                              {getStatusIcon(tx.state)}
                              {tx.state}
                            </Badge>
                          </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                          {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {tx.crypto_amount_usdc ? `${tx.crypto_amount_usdc} USDC` : '-'}
                          </div>
                          {tx.blockchain_tx_hash && (
                            <a 
                              href={`https://basescan.org/tx/${tx.blockchain_tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#FF4500] hover:text-[#FF6B35] transition-colors"
                            >
                              View on Base
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
        </div>

        <PaymentDialog 
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
