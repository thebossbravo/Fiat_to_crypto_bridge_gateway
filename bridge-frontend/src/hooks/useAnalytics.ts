import { useQuery } from '@tanstack/react-query'
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

interface FinancialMetrics {
  total_volume: string
  total_fees: string
  total_transactions: number
  average_transaction: string
  success_rate: string
  period: string
}

interface MetricsResponse {
  metrics: FinancialMetrics
  period: string
}

interface VolumeData {
  date: string
  volume: number
  transactions: number
}

interface CurrencyData {
  name: string
  value: number
  color: string
}

interface AnalyticsRequest {
  period: 'daily' | 'weekly' | 'monthly'
  start_date: string
  end_date: string
}

export function useAnalytics({ period, start_date, end_date }: AnalyticsRequest) {
  return useQuery({
    queryKey: ['analytics', period, start_date, end_date],
    queryFn: async () => {
      // Fetch metrics from API
      const { data: metricsData } = await api.post<MetricsResponse>('/api/metrics', {
        period,
        start_date,
        end_date,
      })

      // Mock volume and currency data for now (replace with real API calls)
      const volumeData: VolumeData[] = [
        { date: '2024-01-01', volume: 12500, transactions: 45 },
        { date: '2024-01-02', volume: 18900, transactions: 67 },
        { date: '2024-01-03', volume: 15600, transactions: 52 },
        { date: '2024-01-04', volume: 22300, transactions: 78 },
        { date: '2024-01-05', volume: 19800, transactions: 69 },
        { date: '2024-01-06', volume: 24100, transactions: 85 },
        { date: '2024-01-07', volume: 28900, transactions: 98 },
      ]
      
      const currencyData: CurrencyData[] = [
        { name: 'USD', value: 65, color: '#FF4500' },
        { name: 'EUR', value: 35, color: '#3B82F6' },
      ]

      return {
        metrics: metricsData,
        volumeData,
        currencyData,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}
