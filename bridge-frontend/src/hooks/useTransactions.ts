import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Transaction {
  id: string;
  fiat_amount_cents: number;
  crypto_amount_usdc: string | null;
  state: string;
  created_at: string;
  blockchain_tx_hash: string | null;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

// Fetch transactions
const fetchTransactions = async (): Promise<TransactionsResponse> => {
  return api.get<TransactionsResponse>('/api/transactions');
};

interface WalletInfo {
  address: string;
  balance: string;
}

// Fetch wallet info
const fetchWalletInfo = async (): Promise<WalletInfo> => {
  return api.get<WalletInfo>('/api/wallet');
};

// Hook for transactions
export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 5000, // 5 seconds
    refetchInterval: 5000, // Poll every 5 seconds
    retry: 3,
  });
}

// Hook for wallet info
export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWalletInfo,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Poll every 30 seconds
    retry: 3,
  });
}

interface CreateTransactionResponse {
  transaction_id: string;
  status: string;
}

// Hook for creating transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return async (amountCents: number, currency: string = 'USD'): Promise<CreateTransactionResponse> => {
    const response = await api.post<CreateTransactionResponse>('/api/transactions', {
      amount_cents: amountCents,
      currency,
    });

    // Invalidate transactions query to refetch
    queryClient.invalidateQueries({ queryKey: ['transactions'] });

    return response;
  };
}

// Hook for initiating swap
export function useInitiateSwap() {
  const queryClient = useQueryClient();

  return async (transactionId: string) => {
    const response = await api.post(`/api/transactions/${transactionId}/swap`);

    // Invalidate queries to refetch
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['wallet'] });

    return response;
  };
}

export type { Transaction, TransactionsResponse };
