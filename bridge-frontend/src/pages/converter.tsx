import { useState, useEffect } from 'react'
import { AmountConverter } from '@/components/converter/AmountConverter'
import { ExchangeRateDisplay } from '@/components/converter/ExchangeRateDisplay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

interface ConversionResult {
  originalAmount: string
  originalCurrency: string
  convertedAmount: string
  convertedCurrency: string
  rate: string
}

interface ExchangeRates {
  USD_EUR: { rate: string; updated_at: string }
  EUR_USD: { rate: string; updated_at: string }
}

export default function ConverterPage() {
  const { theme } = useTheme()
  const [rates, setRates] = useState<ExchangeRates>()
  const [loading, setLoading] = useState(false)
  const [conversionResult, setConversionResult] = useState<ConversionResult>()
  const [converting, setConverting] = useState(false)
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([])

  // Mock data - replace with real API calls
  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    setLoading(true)
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
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      // Fallback to mock data
      setRates({
        USD_EUR: { rate: '0.851', updated_at: new Date().toISOString() },
        EUR_USD: { rate: '1.175', updated_at: new Date().toISOString() },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConvert = async (amount: string, fromCurrency: string, toCurrency: string) => {
    setConverting(true)
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

      const result: ConversionResult = await response.json()
      setConversionResult(result)
      
      // Add to history (keep last 10 conversions)
      setConversionHistory(prev => [result, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error converting currency:', error)
      // Fallback calculation
      if (rates && amount) {
        const key = `${fromCurrency}_${toCurrency}` as keyof typeof rates
        const rate = parseFloat(rates[key]?.rate || '1')
        const convertedAmount = (parseFloat(amount) * rate).toFixed(2)
        
        const fallbackResult: ConversionResult = {
          originalAmount: amount,
          originalCurrency: fromCurrency,
          convertedAmount,
          convertedCurrency: toCurrency,
          rate: rates[key]?.rate || '1',
        }
        
        setConversionResult(fallbackResult)
        setConversionHistory(prev => [fallbackResult, ...prev.slice(0, 9)])
      }
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Currency Converter</h1>
          <p className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Real-time USD/EUR conversion</p>
        </div>
          <Button
            variant="outline"
            onClick={fetchExchangeRates}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Rates
          </Button>
        </div>
      <div className="grid gap-6 lg:grid-cols-2">

        <AmountConverter
          onConvert={handleConvert}
          loading={converting}
          result={conversionResult}
          exchangeRates={rates}
        />

        <ExchangeRateDisplay
          rates={rates}
          loading={loading}
          onRefresh={fetchExchangeRates}
        />
      </div>
      {conversionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion History</CardTitle>
            <CardDescription>Your recent conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionHistory.map((conversion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {conversion.originalAmount} {conversion.originalCurrency} → {conversion.convertedAmount} {conversion.convertedCurrency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rate: {conversion.rate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
