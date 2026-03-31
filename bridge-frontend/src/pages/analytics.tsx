import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricsCards } from '@/components/analytics/MetricsCards'
import { VolumeChart } from '@/components/analytics/VolumeChart'
import { CurrencyDistribution } from '@/components/analytics/CurrencyDistribution'
import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { format, subDays } from 'date-fns'
import { useAnalytics } from '@/hooks/useAnalyticsQuery'
import { usePeriodComparison } from '@/hooks/usePeriodComparison'
import { useTheme } from '@/contexts/theme-context'



export default function AnalyticsPage() {
  const { theme } = useTheme()
  const [period, setPeriod] = useState('weekly')
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  })
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

  // Use TanStack Query for API calls
  const { metrics, volumeData, currencyData, loading } = useAnalytics({
    period: period as 'daily' | 'weekly' | 'monthly',
    start_date: dateRange.startDate,
    end_date: dateRange.endDate,
  })

  // Period-over-period comparison
  const { comparison } = usePeriodComparison(period as 'daily' | 'weekly' | 'monthly')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</h1>
          <p className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Monitor your bridge protocol performance</p>
        </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker onDateRangeChange={(start, end) => setDateRange({ startDate: start, endDate: end })} />
          </div>
        </div>

      <MetricsCards 
        data={{
          totalVolume: parseFloat(metrics?.metrics?.total_volume || '0'),
          totalFees: parseFloat(metrics?.metrics?.total_fees || '0'),
          successRate: parseFloat(metrics?.metrics?.success_rate || '0'),
          averageTransaction: parseFloat(metrics?.metrics?.average_transaction || '0'),
          volumeChange: comparison?.volumeChange || 0,
          feesChange: comparison?.feesChange || 0,
          successRateChange: comparison?.successRateChange || 0,
          avgTransactionChange: comparison?.avgTransactionChange || 0,
        }} 
        loading={loading} 
      />

      <Tabs defaultValue="volume" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          <TabsTrigger value="currency">Currency Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <VolumeChart 
              data={volumeData || []} 
              loading={loading}
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
            <Card>
              <CardHeader>
                <CardTitle>Transaction Count</CardTitle>
                <CardDescription>Number of transactions per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(volumeData || []).slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                      <span className="text-sm font-medium">{item.transactions} transactions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="currency" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <CurrencyDistribution data={currencyData || []} loading={loading} />
            <Card>
              <CardHeader>
                <CardTitle>Currency Statistics</CardTitle>
                <CardDescription>Detailed breakdown by currency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(currencyData || []).map((currency) => (
                    <div key={currency.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: currency.color }}
                        />
                        <span className="text-sm font-medium">{currency.name}</span>
                      </div>
                      <span className="text-sm">{currency.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>Transaction success percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{parseFloat(metrics?.metrics?.success_rate || '0').toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {comparison?.successRateChange && comparison.successRateChange !== 0 ? (
                    <span className={comparison.successRateChange > 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                      {comparison.successRateChange > 0 ? '+' : ''}{comparison.successRateChange.toFixed(1)}% from last period
                    </span>
                  ) : (
                    <span>No change from last period</span>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Transaction</CardTitle>
                <CardDescription>Mean transaction value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${parseFloat(metrics?.metrics?.average_transaction || '0').toFixed(2)}</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'} mt-2`}>
                  {comparison?.avgTransactionChange && comparison.avgTransactionChange !== 0 ? (
                    <span className={comparison.avgTransactionChange > 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                      {comparison.avgTransactionChange > 0 ? '+' : ''}{comparison.avgTransactionChange.toFixed(1)}% from last period
                    </span>
                  ) : (
                    <span>No change from last period</span>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Fees</CardTitle>
                <CardDescription>Fees collected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>${parseFloat(metrics?.metrics?.total_fees || '0').toFixed(2)}</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'} mt-2`}>
                  {comparison?.feesChange && comparison.feesChange !== 0 ? (
                    <span className={comparison.feesChange > 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                      {comparison.feesChange > 0 ? '+' : ''}{comparison.feesChange.toFixed(1)}% from last period
                    </span>
                  ) : (
                    <span>No change from last period</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
