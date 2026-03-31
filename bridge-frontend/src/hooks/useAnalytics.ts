import { useState, useEffect } from 'react'

interface MetricsData {
  totalVolume: number
  totalFees: number
  successRate: number
  averageTransaction: number
  volumeChange: number
  feesChange: number
  successRateChange: number
  avgTransactionChange: number
}

interface VolumeData {
  date: string
  volume: number
  transactions: number
}

interface CurrencyData {
  name: string
  value: number
  color: string
}

export function useAnalytics(period: string, startDate: string, endDate: string) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [period, startDate, endDate])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          period,
          start_date: startDate,
          end_date: endDate,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const data = await response.json()
      setMetrics(data.metrics)
      
      // Mock volume and currency data for now
      setVolumeData([
        { date: '2024-01-01', volume: 12500, transactions: 45 },
        { date: '2024-01-02', volume: 18900, transactions: 67 },
        { date: '2024-01-03', volume: 15600, transactions: 52 },
        { date: '2024-01-04', volume: 22300, transactions: 78 },
        { date: '2024-01-05', volume: 19800, transactions: 69 },
        { date: '2024-01-06', volume: 24100, transactions: 85 },
        { date: '2024-01-07', volume: 28900, transactions: 98 },
      ])
      
      setCurrencyData([
        { name: 'USD', value: 65, color: '#FF4500' },
        { name: 'EUR', value: 35, color: '#3B82F6' },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    metrics,
    volumeData,
    currencyData,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
