import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types matching backend Go structs
interface FinancialMetrics {
  total_volume: string
  total_fees: string
  total_transactions: number
  average_transaction: string
  success_rate: string
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

interface MetricsRequest {
  period: 'daily' | 'weekly' | 'monthly'
  start_date: string
  end_date: string
}

interface MetricsResponse {
  metrics: FinancialMetrics
  period: string
}

// Hooks
export function useMetrics(request: MetricsRequest) {
  return useQuery({
    queryKey: ['metrics', request],
    queryFn: async (): Promise<MetricsResponse> => {
      return api.post<MetricsResponse>('/api/metrics', request)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

export function useVolumeData(request: MetricsRequest) {
  return useQuery({
    queryKey: ['volume', request],
    queryFn: async (): Promise<VolumeData[]> => {
      // Mock data - replace with real API call
      return [
        { date: '2024-01-01', volume: 12500, transactions: 45 },
        { date: '2024-01-02', volume: 18900, transactions: 67 },
        { date: '2024-01-03', volume: 15600, transactions: 52 },
        { date: '2024-01-04', volume: 22300, transactions: 78 },
        { date: '2024-01-05', volume: 19800, transactions: 69 },
        { date: '2024-01-06', volume: 24100, transactions: 85 },
        { date: '2024-01-07', volume: 28900, transactions: 98 },
      ]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCurrencyData() {
  return useQuery({
    queryKey: ['currency-distribution'],
    queryFn: async (): Promise<CurrencyData[]> => {
      // Mock data - replace with real API call
      return [
        { name: 'USD', value: 65, color: '#FF4500' },
        { name: 'EUR', value: 35, color: '#3B82F6' },
      ]
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Combined hook for analytics page
export function useAnalytics(request: MetricsRequest) {
  const metrics = useMetrics(request)
  const volumeData = useVolumeData(request)
  const currencyData = useCurrencyData()

  return {
    metrics: metrics.data,
    volumeData: volumeData.data,
    currencyData: currencyData.data,
    loading: metrics.isLoading || volumeData.isLoading || currencyData.isLoading,
    error: metrics.error || volumeData.error || currencyData.error,
    refetch: () => {
      metrics.refetch()
      volumeData.refetch()
      currencyData.refetch()
    },
  }
}
