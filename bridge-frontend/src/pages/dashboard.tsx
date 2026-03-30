import { useState } from 'react';
import { Dashboard } from "../components/dashboard/Dashboard";
import { PaymentForm } from "../components/payment/PaymentForm";
import { AuthButton } from "../components/auth/AuthButton";
import { useTransactions, useWallet } from "../hooks/useTransactions";

type DashboardPage = 'overview' | 'payment';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; walletAddress: string } | undefined>();

  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions();
  const { data: walletData, isLoading: walletLoading } = useWallet();

  const handleLogin = async () => {
    // Simulate OAuth flow
    setIsAuthenticated(true);
    setUser({
      email: 'user@example.com',
      walletAddress: '0x1234567890123456789012345678901234567890'
    });
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUser(undefined);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    setCurrentPage('overview');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'payment':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">New Bridge Payment</h1>
                <p className="text-zinc-400">Convert fiat to USDC on Base</p>
              </div>
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              <div className="text-center">
                <button
                  onClick={() => setCurrentPage('overview')}
                  className="text-zinc-400 hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-black">
            <div className="flex">
              <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Bridge Protocol</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setCurrentPage('overview')}
                    className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 text-white"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('payment')}
                    className="w-full text-left px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  >
                    New Payment
                  </button>
                </nav>
                <div className="mt-8">
                  <AuthButton
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    isAuthenticated={isAuthenticated}
                    user={user}
                  />
                </div>
              </aside>
              <main className="flex-1">
                <Dashboard
                  walletAddress={walletData?.address || '0x0000...0000'}
                  balance={walletData?.balance || '0.00'}
                  transactions={transactionsData?.transactions || []}
                  loading={transactionsLoading || walletLoading}
                />
              </main>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
    </div>
  );
}
