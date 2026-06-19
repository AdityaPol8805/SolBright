import { useAuth } from '@/contexts/AuthContext'
import { useCalculator } from '@/contexts/CalculatorContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun, Battery, Zap, DollarSign, TrendingUp, Calendar, Bell, Calculator } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const { calculatorResult } = useCalculator()
  const navigate = useNavigate()

  // Generate stats based on calculator results if available
  const stats = calculatorResult ? [
    {
      title: 'System Size',
      value: `${calculatorResult.systemSize} kW`,
      change: 'Optimal',
      icon: Sun,
      color: 'text-yellow-500'
    },
    {
      title: 'Money Saved (Monthly)',
      value: `₹${Math.round(calculatorResult.annualSavings / 12).toLocaleString()}`,
      change: `${Math.round((calculatorResult.annualSavings / 12) / 30).toLocaleString()}/day`,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Payback Period',
      value: `${calculatorResult.paybackPeriod} years`,
      change: 'Estimated',
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      title: 'Battery Level',
      value: '85%',
      change: 'Optimal',
      icon: Battery,
      color: 'text-purple-500'
    }
  ] : [
    {
      title: 'Energy Generated Today',
      value: '22.5 kWh',
      change: '+12%',
      icon: Sun,
      color: 'text-yellow-500'
    },
    {
      title: 'Money Saved This Month',
      value: '₹3,250',
      change: '+8%',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'System Efficiency',
      value: '94.2%',
      change: '+2%',
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      title: 'Battery Level',
      value: '85%',
      change: 'Optimal',
      icon: Battery,
      color: 'text-purple-500'
    }
  ]

  // Generate recent activity based on calculator results when available
  const recentActivity = calculatorResult ? [
    { 
      date: calculatorResult.calculatedAt ? new Date(calculatorResult.calculatedAt).toISOString().split('T')[0] : '2025-10-17', 
      action: 'Solar system sizing completed', 
      value: `${calculatorResult.systemSize} kW` 
    },
    { 
      date: calculatorResult.calculatedAt ? new Date(calculatorResult.calculatedAt).toISOString().split('T')[0] : '2025-10-17', 
      action: 'Annual savings estimated', 
      value: `₹${calculatorResult.annualSavings.toLocaleString()}` 
    },
    { 
      date: calculatorResult.calculatedAt ? new Date(calculatorResult.calculatedAt).toISOString().split('T')[0] : '2025-10-17', 
      action: 'Payback period calculated', 
      value: `${calculatorResult.paybackPeriod} years` 
    },
    { 
      date: calculatorResult.calculatedAt ? new Date(calculatorResult.calculatedAt).toISOString().split('T')[0] : '2025-10-17',
      action: 'CO2 reduction estimated', 
      value: `${calculatorResult.co2Reduction.toLocaleString()} kg` 
    }
  ] : [
    { date: '2025-10-09', action: 'Energy peak reached', value: '8.2 kWh' },
    { date: '2025-10-08', action: 'Monthly savings updated', value: '₹3,250' },
    { date: '2025-10-07', action: 'System maintenance completed', value: '100%' },
    { date: '2025-10-06', action: 'New efficiency record', value: '94.2%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
              </div>
              {!calculatorResult && (
                <span className="text-sm text-orange-600 ml-4">
                  Run the calculator to see your personalized solar insights
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {!calculatorResult && (
                <Button 
                  onClick={() => navigate('/calculator')} 
                  className="flex items-center gap-2 bg-gradient-to-br from-orange-500 to-yellow-500"
                >
                  <Calculator className="h-4 w-4" />
                  Run Calculator
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last period
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Energy Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Energy Production Overview
              </CardTitle>
              <CardDescription>
                Your solar system performance over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { day: 'Mon', production: 22, consumption: 18 },
                  { day: 'Tue', production: 25, consumption: 20 },
                  { day: 'Wed', production: 24, consumption: 19 },
                  { day: 'Thu', production: 26, consumption: 21 },
                  { day: 'Fri', production: 25, consumption: 20 },
                  { day: 'Sat', production: 23, consumption: 16 },
                  { day: 'Sun', production: 22, consumption: 15 }
                ].map((data) => (
                  <div key={data.day} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-12">{data.day}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(data.production / 30) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(data.consumption / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-20 text-right">
                      {data.production}/{data.consumption} kWh
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Consumption</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                    <div className="font-semibold text-blue-600">
                      {activity.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your solar system and account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-16 flex-col gap-2">
                <Zap className="h-5 w-5" />
                View Detailed Analytics
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <DollarSign className="h-5 w-5" />
                Calculate Savings
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Bell className="h-5 w-5" />
                Schedule Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserDashboard
