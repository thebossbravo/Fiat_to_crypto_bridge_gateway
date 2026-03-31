import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface ReconciliationRequest {
  transaction_id: string
  expected_amount: string
  actual_amount: string
  tolerance: string
  notes?: string
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
  success: boolean
  message: string
}

export function useReconcileTransaction() {
  return useMutation({
    mutationFn: async (request: ReconciliationRequest) => {
      return api.post<ReconciliationResponse>('/api/reconcile', request)
    },
  })
}
