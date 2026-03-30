import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

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
}

export function Dashboard({ walletAddress, balance, transactions, loading }: DashboardProps) {
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-manrope mb-2">Dashboard</h1>
          <p className="text-zinc-400">Manage your bridge transactions and wallet</p>
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
                          className="text-xs text-orange-400 hover:text-orange-300"
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
    </div>
  );
}
