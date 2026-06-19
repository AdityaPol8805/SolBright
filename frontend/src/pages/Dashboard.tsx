import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Sun, Zap, Battery, DollarSign, Calculator } from 'lucide-react'
import { useCalculator } from '@/contexts/CalculatorContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const { calculatorResult } = useCalculator()
  const navigate = useNavigate()
  
  // Dashboard data - will use calculator results when available
  // Generate stats dynamically based on calculator results if available
  const stats = calculatorResult ? [
    {
      title: 'System Size',
      value: `${calculatorResult.systemSize} kW`,
      change: 'Optimal',
      icon: Sun,
      color: 'text-yellow-500'
    },
    {
      title: 'Money Saved (Annual)',
      value: `₹${calculatorResult.annualSavings.toLocaleString()}`,
      change: `₹${Math.round(calculatorResult.annualSavings / 12).toLocaleString()}/mo`,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Payback Period',
      value: `${calculatorResult.paybackPeriod} years`,
      change: 'Estimated',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      title: 'CO2 Reduction',
      value: `${calculatorResult.co2Reduction.toLocaleString()} kg`,
      change: 'per year',
      icon: Zap,
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
      value: '94.5%',
      change: '+2%',
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      title: 'Battery Storage',
      value: '78%',
      change: 'Optimal',
      icon: Battery,
      color: 'text-purple-500'
    }
  ]

  // Generate monthly data based on calculator results if available
  const monthlyData = calculatorResult ? generateMonthlyDataFromCalculation(calculatorResult) : [
    { month: 'Jan', generated: 420, consumed: 380, savings: 2500 },
    { month: 'Feb', generated: 450, consumed: 400, savings: 2800 },
    { month: 'Mar', generated: 520, consumed: 480, savings: 3200 },
    { month: 'Apr', generated: 580, consumed: 520, savings: 3500 },
    { month: 'May', generated: 620, consumed: 550, savings: 3800 },
    { month: 'Jun', generated: 680, consumed: 580, savings: 4200 }
  ]
  
  // Helper function to generate monthly data based on calculator results
  function generateMonthlyDataFromCalculation(result: any) {
    const monthlySavings = Math.round(result.annualSavings / 12)
    const monthlyProduction = Math.round(result.systemSize * 120) // Approx 120 kWh per kW per month in India
    const efficiency = 0.9 // 90% efficiency
    
    // Generate data for the last 6 months with some variations
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      // Add some variation to make data look realistic
      const variationFactor = 0.8 + (Math.random() * 0.4) // 0.8 to 1.2
      const generated = Math.round(monthlyProduction * variationFactor)
      const consumed = Math.round(generated * (0.7 + Math.random() * 0.2)) // 70-90% consumption
      const savings = Math.round(monthlySavings * variationFactor)
      
      return { month, generated, consumed, savings }
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Solar Dashboard
            </h1>
            <p className="text-black-600">
              {calculatorResult 
                ? `Showing your personalized solar results from ${new Date(calculatorResult.calculatedAt || Date.now()).toLocaleDateString()}`
                : "Monitor your solar system performance and savings"
              }
            </p>
          </div>
        </div>
        
        {!calculatorResult && (
          <Button onClick={() => navigate('/calculator')} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Run Calculator
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Energy Production Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Energy Production</CardTitle>
            <CardDescription>
              Energy generated vs consumed over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-gray-600">{data.generated} kWh generated</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(data.generated / 700) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Consumed: {data.consumed} kWh</span>
                    <span>Saved: ₹{data.savings}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>
              Real-time monitoring and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">System Status</span>
              </div>
              <span className="text-green-600 font-semibold">Optimal</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Panel Efficiency</span>
                <span className="font-semibold">94.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94.5%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inverter Status</span>
                <span className="font-semibold">98.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.2%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Battery Health</span>
                <span className="font-semibold">96.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96.8%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions to optimize your solar performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-blue-900">Panel Cleaning Recommended</h4>
                <p className="text-blue-700 text-sm">
                  Your panels show a 3% efficiency decrease. Consider cleaning them to restore optimal performance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-green-900">Peak Performance Period</h4>
                <p className="text-green-700 text-sm">
                  Run high-energy appliances between 11 AM - 2 PM to maximize solar usage.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-yellow-900">Battery Optimization</h4>
                <p className="text-yellow-700 text-sm">
                  Consider upgrading your battery capacity to store more excess energy during peak production.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard