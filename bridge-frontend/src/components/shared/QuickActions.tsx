import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, Calculator, Search } from 'lucide-react'
import { useNavigate } from 'react-router'

export function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      title: 'Currency Converter',
      description: 'Convert USD/EUR in real-time',
      icon: Calculator,
      href: '/dashboard/converter',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Analytics',
      description: 'View transaction metrics',
      icon: TrendingUp,
      href: '/dashboard/analytics',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Reconciliation',
      description: 'Match transaction amounts',
      icon: Search,
      href: '/dashboard/reconciliation',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => navigate(action.href)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
