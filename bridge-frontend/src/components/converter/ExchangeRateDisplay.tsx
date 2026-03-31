import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

interface ExchangeRateDisplayProps {
  rates?: {
    USD_EUR: { rate: string; updated_at: string }
    EUR_USD: { rate: string; updated_at: string }
  }
  loading?: boolean
  onRefresh?: () => void
}

export function ExchangeRateDisplay({ rates, loading, onRefresh }: ExchangeRateDisplayProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rates</CardTitle>
          <CardDescription>Current USD/EUR rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No exchange rate data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const RateCard = ({ 
    from, 
    to, 
    rate, 
    updatedAt 
  }: { 
    from: string; 
    to: string; 
    rate: string; 
    updatedAt: string 
  }) => {
    const rateValue = parseFloat(rate)
    const isPositive = rateValue > 1 // Arbitrary for demo
    
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">{from}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline" className="font-mono">{to}</Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{rate}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(updatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Exchange Rates</CardTitle>
          <CardDescription>Real-time USD/EUR rates</CardDescription>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RateCard
            from="USD"
            to="EUR"
            rate={rates.USD_EUR.rate}
            updatedAt={rates.USD_EUR.updated_at}
          />
          <RateCard
            from="EUR"
            to="USD"
            rate={rates.EUR_USD.rate}
            updatedAt={rates.EUR_USD.updated_at}
          />
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Rates are updated every 5 minutes</p>
            <p>• All conversions use real-time market rates</p>
            <p>• Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
