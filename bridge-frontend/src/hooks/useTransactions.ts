import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch transactions
const fetchTransactions = async (): Promise<TransactionsResponse> => {
  const response = await api.get('/api/transactions');
  return response.data;
};

// Fetch wallet info
const fetchWalletInfo = async () => {
  const response = await api.get('/api/wallet');
  return response.data;
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

// Hook for creating transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return async (amountCents: number, currency: string = 'USD') => {
    const response = await api.post('/api/transactions', {
      amount_cents: amountCents,
      currency,
    });

    // Invalidate transactions query to refetch
    queryClient.invalidateQueries({ queryKey: ['transactions'] });

    return response.data;
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

    return response.data;
  };
}

export { api };
export type { Transaction, TransactionsResponse };
