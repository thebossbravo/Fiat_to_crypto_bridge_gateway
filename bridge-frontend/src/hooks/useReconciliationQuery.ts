import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// API base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Types
interface ReconciliationRequest {
  transaction_id: string
  expected_amount: string
  actual_amount: string
  currency: 'USD' | 'EUR'
  tolerance?: string
}

interface ReconciliationEntry {
  id: string
  transaction_id: string
  expected_amount: string
  actual_amount: string
  variance: string
  variance_percent: string
  status: 'matched' | 'mismatch' | 'missing'
  reconciled_at: string
  notes: string
}

interface ReconciliationResponse {
  entry: ReconciliationEntry
  status: string
}

// Hooks
export function useReconcileTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (request: ReconciliationRequest): Promise<ReconciliationResponse> => {
      const { data } = await api.post('/api/reconcile', request)
      return data
    },
    onSuccess: () => {
      // Invalidate reconciliation history cache
      queryClient.invalidateQueries({ queryKey: ['reconciliation-history'] })
    },
  })
}

export function useReconciliationHistory() {
  return useQuery({
    queryKey: ['reconciliation-history'],
    queryFn: async (): Promise<ReconciliationEntry[]> => {
      // Mock data - replace with real API call
      return [
        {
          id: 'rec_1',
          transaction_id: 'tx_abc123',
          expected_amount: '100.50',
          actual_amount: '100.50',
          variance: '0.00',
          variance_percent: '0.00',
          status: 'matched',
          reconciled_at: new Date().toISOString(),
          notes: 'Perfect match'
        },
        {
          id: 'rec_2',
          transaction_id: 'tx_def456',
          expected_amount: '250.00',
          actual_amount: '248.75',
          variance: '-1.25',
          variance_percent: '-0.50',
          status: 'matched',
          reconciled_at: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Within tolerance'
        },
        {
          id: 'rec_3',
          transaction_id: 'tx_ghi789',
          expected_amount: '500.00',
          actual_amount: '480.00',
          variance: '-20.00',
          variance_percent: '-4.00',
          status: 'mismatch',
          reconciled_at: new Date(Date.now() - 7200000).toISOString(),
          notes: 'Significant variance detected'
        },
      ]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Combined hook for reconciliation page
export function useReconciliation() {
  const reconcileTransaction = useReconcileTransaction()
  const reconciliationHistory = useReconciliationHistory()

  return {
    reconcile: reconcileTransaction.mutateAsync,
    isReconciling: reconcileTransaction.isPending,
    reconciliationError: reconcileTransaction.error,
    history: reconciliationHistory.data,
    historyLoading: reconciliationHistory.isLoading,
    historyError: reconciliationHistory.error,
    refetchHistory: reconciliationHistory.refetch,
  }
}
