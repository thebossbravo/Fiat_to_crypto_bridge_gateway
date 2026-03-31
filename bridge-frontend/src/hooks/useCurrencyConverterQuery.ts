import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

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
      return api.get<{ rates: ExchangeRates }>('/api/exchange-rates')
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  })
}

export function useConvertCurrency() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (request: ConvertRequest): Promise<ConvertResponse> => {
      return api.post<ConvertResponse>('/api/convert', request)
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
