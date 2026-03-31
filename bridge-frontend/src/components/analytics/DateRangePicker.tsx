import { useState } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, subDays } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
  defaultRange?: '7d' | '30d' | '90d' | 'custom'
}

export function DateRangePicker({ onDateRangeChange, defaultRange = '30d' }: DateRangePickerProps) {
  const { theme } = useTheme()
  const [range, setRange] = useState(defaultRange)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const handleRangeChange = (newRange: string) => {
    setRange(newRange as '7d' | '30d' | '90d' | 'custom')
    
    const endDate = new Date()
    let startDate = new Date()
    
    switch (newRange) {
      case '7d':
        startDate = subDays(endDate, 7)
        break
      case '30d':
        startDate = subDays(endDate, 30)
        break
      case '90d':
        startDate = subDays(endDate, 90)
        break
      case 'custom':
        // TODO: Implement custom date picker
        return
    }
    
    onDateRangeChange(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    )
  }

  const ranges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {ranges.map((r) => (
        <Button
          key={r.value}
          variant={range === r.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRangeChange(r.value)}
          className={range === r.value ? 'bg-[#FF4500] hover:bg-[#FF6B35]' : theme === 'dark' ? '' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}
        >
          {r.label}
        </Button>
      ))}
      
      {range === 'custom' && (
        <>
          <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={theme === 'dark' ? '' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                {startDate ? format(startDate, 'MMM dd, yyyy') : 'Start Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto p-0 ${theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white border-gray-200'}`} align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date)
                  setIsStartOpen(false)
                  if (date && endDate) {
                    onDateRangeChange(
                      format(date, 'yyyy-MM-dd'),
                      format(endDate, 'yyyy-MM-dd')
                    )
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={theme === 'dark' ? '' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                {endDate ? format(endDate, 'MMM dd, yyyy') : 'End Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto p-0 ${theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white border-gray-200'}`} align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date)
                  setIsEndOpen(false)
                  if (date && startDate) {
                    onDateRangeChange(
                      format(startDate, 'yyyy-MM-dd'),
                      format(date, 'yyyy-MM-dd')
                    )
                  }
                }}
                initialFocus
                disabled={startDate ? ((date: Date) => date < startDate) : undefined}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}
