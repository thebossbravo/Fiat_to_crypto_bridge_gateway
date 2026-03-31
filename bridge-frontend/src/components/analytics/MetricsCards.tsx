import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, Percent, Activity } from 'lucide-react'

interface MetricsCardsProps {
  data: {
    totalVolume: number
    totalFees: number
    successRate: number
    averageTransaction: number
    volumeChange: number
    feesChange: number
    successRateChange: number
    avgTransactionChange: number
  }
  loading?: boolean
}

export function MetricsCards({ data, loading }: MetricsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    badge, 
    format = 'number' 
  }: {
    title: string
    value: number | string
    change: number
    icon: React.ComponentType<any>
    badge?: string
    format?: 'number' | 'currency' | 'percent'
  }) => {
    const isPositive = change > 0
    const isNegative = change < 0
    
    const formattedValue = format === 'currency' 
      ? formatCurrency(Number(value))
      : format === 'percent'
      ? `${value}%`
      : value.toLocaleString()

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formattedValue}</div>
            {badge && (
              <Badge variant="secondary" className="text-green-600">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {change !== 0 && (
              <span className={isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}>
                {isPositive && '+'}{change.toFixed(1)}% from last period
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Volume"
        value={data.totalVolume}
        change={data.volumeChange}
        icon={DollarSign}
        format="currency"
      />
      <MetricCard
        title="Total Fees"
        value={data.totalFees}
        change={data.feesChange}
        icon={TrendingUp}
        format="currency"
      />
      <MetricCard
        title="Success Rate"
        value={data.successRate}
        change={data.successRateChange}
        icon={Percent}
        badge={`${data.successRate.toFixed(1)}%`}
        format="percent"
      />
      <MetricCard
        title="Avg Transaction"
        value={data.averageTransaction}
        change={data.avgTransactionChange}
        icon={Activity}
        format="currency"
      />
    </div>
  )
}
