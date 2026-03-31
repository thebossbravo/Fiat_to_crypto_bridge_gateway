import { useAnalytics } from './useAnalyticsQuery'
import { subDays, subWeeks, subMonths, format } from 'date-fns'

interface PeriodComparison {
  volumeChange: number
  feesChange: number
  successRateChange: number
  avgTransactionChange: number
}

export function usePeriodComparison(period: 'daily' | 'weekly' | 'monthly') {
  const currentDate = new Date()
  let previousStartDate: Date
  let previousEndDate: Date
  let currentStartDate: Date
  let currentEndDate: Date = currentDate

  // Calculate previous period based on current period
  switch (period) {
    case 'daily':
      currentStartDate = subDays(currentDate, 1)
      previousStartDate = subDays(currentDate, 2)
      previousEndDate = subDays(currentDate, 1)
      break
    case 'weekly':
      currentStartDate = subWeeks(currentDate, 1)
      previousStartDate = subWeeks(currentDate, 2)
      previousEndDate = subWeeks(currentDate, 1)
      break
    case 'monthly':
      currentStartDate = subMonths(currentDate, 1)
      previousStartDate = subMonths(currentDate, 2)
      previousEndDate = subMonths(currentDate, 1)
      break
  }

  // Current period data
  const currentPeriod = useAnalytics({
    period,
    start_date: format(currentStartDate, 'yyyy-MM-dd'),
    end_date: format(currentEndDate, 'yyyy-MM-dd'),
  })

  // Previous period data
  const previousPeriod = useAnalytics({
    period,
    start_date: format(previousStartDate, 'yyyy-MM-dd'),
    end_date: format(previousEndDate, 'yyyy-MM-dd'),
  })

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const comparison: PeriodComparison | undefined = currentPeriod.metrics && previousPeriod.metrics ? {
    volumeChange: calculateChange(
      parseFloat(currentPeriod.metrics.metrics?.total_volume || '0'),
      parseFloat(previousPeriod.metrics.metrics?.total_volume || '0')
    ),
    feesChange: calculateChange(
      parseFloat(currentPeriod.metrics.metrics?.total_fees || '0'),
      parseFloat(previousPeriod.metrics.metrics?.total_fees || '0')
    ),
    successRateChange: calculateChange(
      parseFloat(currentPeriod.metrics.metrics?.success_rate || '0'),
      parseFloat(previousPeriod.metrics.metrics?.success_rate || '0')
    ),
    avgTransactionChange: calculateChange(
      parseFloat(currentPeriod.metrics.metrics?.average_transaction || '0'),
      parseFloat(previousPeriod.metrics.metrics?.average_transaction || '0')
    ),
  } : undefined

  return {
    comparison,
    isLoading: currentPeriod.loading || previousPeriod.loading,
    error: currentPeriod.error || previousPeriod.error,
    currentPeriod: currentPeriod.metrics,
    previousPeriod: previousPeriod.metrics,
  }
}
