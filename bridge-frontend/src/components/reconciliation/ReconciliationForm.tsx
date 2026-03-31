import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface ReconciliationFormProps {
  onReconcile: (data: ReconciliationData) => void
  loading?: boolean
  result?: {
    entry: {
      id: string
      transaction_id: string
      expected_amount: string
      actual_amount: string
      variance: string
      variance_percent: string
      status: string
      reconciled_at: string
      notes: string
    }
    status: string
  }
}

interface ReconciliationData {
  transaction_id: string
  expected_amount: string
  actual_amount: string
  currency: string
  tolerance: string
  notes?: string
}

export function ReconciliationForm({ onReconcile, loading, result }: ReconciliationFormProps) {
  const [formData, setFormData] = useState<ReconciliationData>({
    transaction_id: '',
    expected_amount: '',
    actual_amount: '',
    currency: 'USD',
    tolerance: '1.0',
    notes: '',
  })

  const handleInputChange = (field: keyof ReconciliationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReconcile(formData)
  }

  const handleQuickFill = () => {
    // Quick fill with sample data for testing
    setFormData({
      transaction_id: 'tx_' + Math.random().toString(36).substr(2, 9),
      expected_amount: '100.50',
      actual_amount: '100.48',
      currency: 'USD',
      tolerance: '1.0',
      notes: 'Auto-generated test data',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'mismatch':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'missing':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched':
        return 'bg-green-100 text-green-800'
      case 'mismatch':
        return 'bg-red-100 text-red-800'
      case 'missing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Reconciliation</CardTitle>
        <CardDescription>Match expected vs actual transaction amounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Fill Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleQuickFill}>
            Quick Fill Test Data
          </Button>
        </div>

        {/* Reconciliation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Transaction ID */}
            <div className="space-y-2">
              <Label htmlFor="transaction_id">Transaction ID *</Label>
              <Input
                id="transaction_id"
                placeholder="tx_123456789"
                value={formData.transaction_id}
                onChange={(e) => handleInputChange('transaction_id', e.target.value)}
                required
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expected Amount */}
            <div className="space-y-2">
              <Label htmlFor="expected_amount">Expected Amount *</Label>
              <Input
                id="expected_amount"
                type="number"
                step="0.01"
                placeholder="100.50"
                value={formData.expected_amount}
                onChange={(e) => handleInputChange('expected_amount', e.target.value)}
                required
              />
            </div>

            {/* Actual Amount */}
            <div className="space-y-2">
              <Label htmlFor="actual_amount">Actual Amount *</Label>
              <Input
                id="actual_amount"
                type="number"
                step="0.01"
                placeholder="100.48"
                value={formData.actual_amount}
                onChange={(e) => handleInputChange('actual_amount', e.target.value)}
                required
              />
            </div>

            {/* Tolerance */}
            <div className="space-y-2">
              <Label htmlFor="tolerance">Tolerance (%)</Label>
              <Input
                id="tolerance"
                type="number"
                step="0.1"
                placeholder="1.0"
                value={formData.tolerance}
                onChange={(e) => handleInputChange('tolerance', e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this reconciliation..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !formData.transaction_id || !formData.expected_amount || !formData.actual_amount}
            className="w-full"
          >
            {loading ? 'Reconciling...' : 'Reconcile Transaction'}
          </Button>
        </form>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Reconciliation Result</h3>
              
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                {getStatusIcon(result.entry.status)}
                <Badge className={getStatusColor(result.entry.status)}>
                  {result.entry.status.charAt(0).toUpperCase() + result.entry.status.slice(1)}
                </Badge>
              </div>

              {/* Result Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <p className="font-mono">{result.entry.transaction_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reconciled At:</span>
                  <p>{new Date(result.entry.reconciled_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Amount:</span>
                  <p className="font-medium">{result.entry.expected_amount} {formData.currency}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actual Amount:</span>
                  <p className="font-medium">{result.entry.actual_amount} {formData.currency}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Variance:</span>
                  <p className={`font-medium ${parseFloat(result.entry.variance) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.entry.variance} {formData.currency}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Variance %:</span>
                  <p className={`font-medium ${parseFloat(result.entry.variance_percent) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.entry.variance_percent}%
                  </p>
                </div>
              </div>

              {result.entry.notes && (
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="text-sm mt-1">{result.entry.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
