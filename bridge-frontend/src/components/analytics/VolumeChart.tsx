import { useTheme } from '@/contexts/theme-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface VolumeChartProps {
  data: Array<{
    date: string
    volume: number
    transactions: number
  }>
  loading?: boolean
  chartType?: 'bar' | 'line'
  onChartTypeChange?: (type: 'bar' | 'line') => void
}

export function VolumeChart({ data, loading, chartType = 'bar', onChartTypeChange }: VolumeChartProps) {
  const { theme } = useTheme()
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`border rounded-lg shadow-lg p-3 ${theme === 'dark' ? 'bg-black/90 text-white border-white/10' : 'bg-white text-gray-900 border-gray-200'}`}>
          <p className="font-medium">Date: {label ? formatDate(label) : 'N/A'}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Volume' 
                ? `$${entry.value.toLocaleString()}`
                : `${entry.value} transactions`
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          />
          <YAxis 
            yAxisId="volume"
            orientation="left"
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="transactions"
            orientation="right"
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            yAxisId="volume"
            type="monotone" 
            dataKey="volume" 
            stroke="#FF4500" 
            strokeWidth={2}
            dot={{ fill: '#FF4500', r: 4 }}
            name="Volume"
          />
          <Line 
            yAxisId="transactions"
            type="monotone" 
            dataKey="transactions" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            name="Transactions"
          />
        </LineChart>
      )
    }

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="volume" fill="#FF4500" name="Volume" />
      </BarChart>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Transaction Volume</CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Daily transaction volume over time</CardDescription>
        </div>
        {onChartTypeChange && (
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger className={`w-[120px] ${theme === 'dark' ? '' : 'text-gray-700 border-gray-300'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={theme === 'dark' ? 'bg-black/80 border-white/20' : 'bg-white border-gray-200'}>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
