import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface ExchangeRate {
  rate: string
  updated_at: string
}

interface ExchangeRates {
  USD_EUR: ExchangeRate
  EUR_USD: ExchangeRate
}

interface ConversionRequest {
  amount: string
  from_currency: string
  to_currency: string
}

interface ConversionResult {
  originalAmount: string
  originalCurrency: string
  convertedAmount: string
  convertedCurrency: string
  rate: string
}

interface ExchangeRatesResponse {
  rates: ExchangeRates
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      const data = await api.get<ExchangeRatesResponse>('/api/exchange-rates')
      return data.rates
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}

export function useConvertCurrency() {
  return useMutation({
    mutationFn: async (request: ConversionRequest) => {
      return api.post<ConversionResult>('/api/convert', request)
    },
  })
}
