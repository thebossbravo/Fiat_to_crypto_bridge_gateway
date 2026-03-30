import { useState } from 'react';
import { useTransactions, useWallet } from '@/hooks/useTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, ArrowUpRight, ArrowDownRight, Wallet, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavMain } from '../nav-main';
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

  // Navigation items for the new NavMain component
  const navItems = [
    {
      title: 'Dashboard',
      url: '#dashboard',
      icon: <Wallet className="w-4 h-4" />,
      isActive: true,
    },
  ];

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
      <div className="flex h-screen bg-black text-white">
        <Sidebar className="bg-black border-r border-white/10 h-full" side="left">
          <SidebarHeader className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF4500] rounded-lg rotate-45 flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm -rotate-45"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-manrope">Bridge</h2>
                <p className="text-xs text-zinc-400">Protocol</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <NavMain items={navItems} />
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-white/10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-zinc-400">Account</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors justify-start"
              >
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold font-manrope mb-2">Dashboard</h1>
                <p className="text-zinc-400">Manage your bridge transactions and wallet</p>
              </div>
              <div className="flex items-center gap-4">
                
                <Button 
                  onClick={() => setIsPaymentDialogOpen(true)}
                  className="bg-[#FF4500] hover:bg-[#FF6B35] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Payment
                </Button>
              
              </div>
            </div>

            <Card className="bg-black/60 backdrop-blur-xl border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="w-5 h-5" />
                  Your Wallet
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your personal wallet address for receiving USDC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Wallet Address</p>
                    <p className="text-lg font-mono font-semibold text-white">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-400 mb-1">Balance</p>
                    <p className="text-2xl font-bold text-[#FF4500]">{balance} USDC</p>
                  </div>
                </div>
                <Separator className="my-4 bg-white/10" />
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-zinc-300 hover:bg-white/5"
                  onClick={() => copyToClipboard(walletAddress)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Address
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
                <CardDescription className="text-zinc-400">
                  Your recent bridge transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-zinc-400">
                    Loading transactions...
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    No transactions yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">
                              ${(tx.fiat_amount_cents / 100).toFixed(2)}
                            </span>
                            <Badge className={getStatusColor(tx.state)}>
                              {getStatusIcon(tx.state)}
                              {tx.state}
                            </Badge>
                          </div>
                          <div className="text-sm text-zinc-400">
                            {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
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
        </main>

        <PaymentDialog 
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        />
      </div>
    </SidebarProvider>
  );
}
