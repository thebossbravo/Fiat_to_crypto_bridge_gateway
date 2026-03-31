import React from 'react'
import { useTheme } from '@/contexts/theme-context'
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
  const { theme } = useTheme()
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className={theme === 'dark' ? 'bg-black/60 backdrop-blur-xl border-white/10' : 'bg-white border-gray-200 shadow-sm'}>
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
      <Card className={theme === 'dark' ? 'bg-black/60 backdrop-blur-xl border-white/10' : 'bg-white border-gray-200 shadow-sm'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</CardTitle>
          <Icon className={`h-4 w-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formattedValue}</div>
            {badge && (
              <Badge variant="secondary" className={theme === 'dark' ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-green-100 text-green-800 border-green-200'}>
                {badge}
              </Badge>
            )}
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'} mt-1`}>
            {change !== 0 && (
              <span className={isPositive ? (theme === 'dark' ? 'text-green-400' : 'text-green-700') : isNegative ? (theme === 'dark' ? 'text-red-400' : 'text-red-700') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
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
