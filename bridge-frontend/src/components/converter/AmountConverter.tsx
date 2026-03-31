import { useState } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, TrendingUp } from 'lucide-react'

interface AmountConverterProps {
  onConvert: (amount: string, fromCurrency: string, toCurrency: string) => void
  loading?: boolean
  result?: {
    originalAmount: string
    originalCurrency: string
    convertedAmount: string
    convertedCurrency: string
    rate: string
  }
  exchangeRates?: {
    USD_EUR: { rate: string; updated_at: string }
    EUR_USD: { rate: string; updated_at: string }
  }
}

export function AmountConverter({ onConvert, loading, result, exchangeRates }: AmountConverterProps) {
  const { theme } = useTheme()
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')

  const quickAmounts = ['100', '500', '1000', '5000', '10000']

  const handleConvert = () => {
    if (amount && fromCurrency && toCurrency) {
      onConvert(amount, fromCurrency, toCurrency)
    }
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setAmount('')
  }

  const handleQuickAmount = (value: string) => {
    setAmount(value)
  }

  const getCurrentRate = () => {
    if (!exchangeRates) return null
    
    const key = `${fromCurrency}_${toCurrency}` as keyof typeof exchangeRates
    return exchangeRates[key]?.rate
  }

  const currentRate = getCurrentRate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between USD and EUR in real-time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(value)}
              className={amount === value ? 'bg-[#FF4500] text-white hover:bg-[#FF6B35]' : ''}
            >
              ${value}
            </Button>
          ))}
        </div>

        {/* Converter Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="flex gap-2">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="rounded-full"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="flex gap-2">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={result?.convertedAmount || ''}
                  readOnly
                  className="flex-1 bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Exchange Rate Display */}
          {currentRate && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Exchange Rate</span>
                <Badge variant="secondary" className="text-xs">
                  Live
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">1 {fromCurrency} = {currentRate} {toCurrency}</div>
                <div className="text-xs text-muted-foreground">
                  Updated: {exchangeRates && new Date(exchangeRates[`${fromCurrency}_${toCurrency}` as keyof typeof exchangeRates]?.updated_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <Button 
            onClick={handleConvert}
            disabled={!amount || loading}
            className="w-full bg-[#FF4500] hover:bg-[#FF6B35]"
          >
            {loading ? 'Converting...' : 'Convert'}
          </Button>

          {/* Result Display */}
          {result && (
            <div className={`p-4 ${theme === 'dark' ? 'bg-green-900/30 border-green-700/50' : 'bg-green-50 border-green-200'} rounded-lg`}>
              <div className="text-center space-y-2">
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                  {result.originalAmount} {result.originalCurrency} = {result.convertedAmount} {result.convertedCurrency}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                  Rate: {result.rate}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
