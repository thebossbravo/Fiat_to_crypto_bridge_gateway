import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Axios instance with auth
const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
      const { data } = await api.post('/api/reconcile', request)
      return data as ReconciliationResponse
    },
  })
}
