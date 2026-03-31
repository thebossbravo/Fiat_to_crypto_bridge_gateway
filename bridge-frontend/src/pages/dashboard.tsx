import { useState } from 'react';
import { useNavigate } from 'react-router'
import { Dashboard } from "../components/dashboard/Dashboard";
import { useTransactions, useWallet } from "../hooks/useTransactions";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useState<{ email: string; walletAddress: string } | undefined>({
    email: 'user@example.com',
    walletAddress: '0x1234567890123456789012345678901234567890'
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions();
  const { data: walletData, isLoading: walletLoading } = useWallet();

  const handleLogout = async () => {
    navigate('/login');
  };

  return (
    <Dashboard
      walletAddress={walletData?.address || '0x0000...0000'}
      balance={walletData?.balance || '0.00'}
      transactions={transactionsData?.transactions || []}
      loading={transactionsLoading || walletLoading}
      user={user}
      onLogout={handleLogout}
    />
  );
}
