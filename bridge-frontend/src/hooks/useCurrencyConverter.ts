import { useState, useEffect } from 'react'

interface ExchangeRates {
  USD_EUR: { rate: string; updated_at: string }
  EUR_USD: { rate: string; updated_at: string }
}

interface ConversionResult {
  originalAmount: string
  originalCurrency: string
  convertedAmount: string
  convertedCurrency: string
  rate: string
}

export function useCurrencyConverter() {
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/exchange-rates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }

      const data = await response.json()
      setRates(data.rates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching exchange rates:', err)
      
      // Fallback to mock data
      setRates({
        USD_EUR: { rate: '0.851', updated_at: new Date().toISOString() },
        EUR_USD: { rate: '1.175', updated_at: new Date().toISOString() },
      })
    } finally {
      setLoading(false)
    }
  }

  const convertCurrency = async (amount: string, fromCurrency: string, toCurrency: string): Promise<ConversionResult> => {
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount,
          from_currency: fromCurrency,
          to_currency: toCurrency,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to convert currency')
      }

      return await response.json()
    } catch (err) {
      console.error('Error converting currency:', err)
      
      // Fallback calculation
      if (rates && amount) {
        const key = `${fromCurrency}_${toCurrency}` as keyof typeof rates
        const rate = parseFloat(rates[key]?.rate || '1')
        const convertedAmount = (parseFloat(amount) * rate).toFixed(2)
        
        return {
          originalAmount: amount,
          originalCurrency: fromCurrency,
          convertedAmount,
          convertedCurrency: toCurrency,
          rate: rates[key]?.rate || '1',
        }
      }
      
      throw err
    }
  }

  return {
    rates,
    loading,
    error,
    convertCurrency,
    refreshRates: fetchExchangeRates,
  }
}
