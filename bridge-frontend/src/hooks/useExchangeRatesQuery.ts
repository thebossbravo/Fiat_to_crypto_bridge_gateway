import { useQuery, useMutation } from '@tanstack/react-query'
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

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      const { data } = await api.get('/api/exchange-rates')
      return data.rates as ExchangeRates
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

export function useConvertCurrency() {
  return useMutation({
    mutationFn: async (request: ConversionRequest) => {
      const { data } = await api.post('/api/convert', request)
      return data as ConversionResult
    },
  })
}
