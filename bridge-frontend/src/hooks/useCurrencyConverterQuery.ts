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
interface ExchangeRates {
  USD_EUR: { rate: string; updated_at: string }
  EUR_USD: { rate: string; updated_at: string }
}

interface ConvertRequest {
  amount: string
  from_currency: 'USD' | 'EUR'
  to_currency: 'USD' | 'EUR'
}

interface ConvertResponse {
  originalAmount: string
  originalCurrency: string
  convertedAmount: string
  convertedCurrency: string
  rate: string
  convertedAt: string
}

// Hooks
export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async (): Promise<{ rates: ExchangeRates }> => {
      const { data } = await api.get('/api/exchange-rates')
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  })
}

export function useConvertCurrency() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (request: ConvertRequest): Promise<ConvertResponse> => {
      const { data } = await api.post('/api/convert', request)
      return data
    },
    onSuccess: () => {
      // Invalidate exchange rates cache after conversion
      queryClient.invalidateQueries({ queryKey: ['exchange-rates'] })
    },
  })
}

// Combined hook for currency converter
export function useCurrencyConverter() {
  const exchangeRates = useExchangeRates()
  const convertCurrency = useConvertCurrency()

  return {
    rates: exchangeRates.data?.rates,
    loading: exchangeRates.isLoading,
    error: exchangeRates.error,
    convertCurrency,
    refreshRates: exchangeRates.refetch,
    isConverting: convertCurrency.isPending,
  }
}
