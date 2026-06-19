import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calculator, Home, Zap, DollarSign, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useCalculator } from '@/contexts/CalculatorContext'

// Local interface for component state management
interface CalculationResult {
  systemSize: number
  estimatedCost: number
  annualSavings: number
  paybackPeriod: number
  co2Reduction: number
}

const SolarCalculator = () => {
  const { saveCalculatorResult } = useCalculator()
  const [formData, setFormData] = useState({
    monthlyBill: '',
    roofSize: '',
    location: '',
    energyUsage: ''
  })
  
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateSolar = async () => {
    if (!formData.monthlyBill || !formData.roofSize || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCalculating(true)
    
    // Simulate API call with realistic calculations
    setTimeout(() => {
      const monthlyBill = parseFloat(formData.monthlyBill)
      const roofSize = parseFloat(formData.roofSize)
      const energyUsage = parseFloat(formData.energyUsage) || monthlyBill * 12

      // Simplified solar calculations for Indian market
      const systemSize = Math.min(roofSize / 80, energyUsage / 1500) // kW (adjusted for Indian solar irradiation)
      const estimatedCost = systemSize * 60000 // ₹60,000 per kW (typical cost in India)
      const annualSavings = monthlyBill * 12 * 0.90 // 90% bill reduction (India has high solar potential)
      const paybackPeriod = estimatedCost / annualSavings
      const co2Reduction = systemSize * 680 // kg CO2 per year per kW (Indian grid emission factor)

      const calculationResult = {
        systemSize: Math.round(systemSize * 10) / 10,
        estimatedCost: Math.round(estimatedCost),
        annualSavings: Math.round(annualSavings),
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
        co2Reduction: Math.round(co2Reduction)
      }
      
      setResult(calculationResult)
      // Save to context for use in dashboard
      saveCalculatorResult(calculationResult)
      
      setIsCalculating(false)
      toast.success('Solar calculation completed!')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Solar Calculator
        </h1>
        <p className="text-lg text-black-600">
          Get personalized solar estimates based on your energy usage and location
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Enter your details to get accurate solar estimates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Electricity Bill (₹) *
              </label>
              <Input
                type="number"
                name="monthlyBill"
                value={formData.monthlyBill}
                onChange={handleInputChange}
                placeholder="e.g., 2500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Roof Space (sq ft) *
              </label>
              <Input
                type="number"
                name="roofSize"
                value={formData.roofSize}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (City, State) *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Energy Usage (kWh)
              </label>
              <Input
                type="number"
                name="energyUsage"
                value={formData.energyUsage}
                onChange={handleInputChange}
                placeholder="e.g., 12000 (optional)"
              />
            </div>
            
            <Button 
              onClick={calculateSolar} 
              disabled={isCalculating}
              className="w-full"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Solar Potential'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Your Solar Estimate
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">System Size</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{result.systemSize} kW</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Estimated Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">₹{result.estimatedCost.toLocaleString()}</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">Annual Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">₹{result.annualSavings.toLocaleString()}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Payback Period</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{result.paybackPeriod} years</p>
                </div>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Environmental Impact</h4>
                <p className="text-green-800">
                  Your solar system will reduce CO2 emissions by approximately{' '}
                  <span className="font-bold">{result.co2Reduction.toLocaleString()} kg</span> per year!
                </p>
              </div>
              
              <Button className="w-full" variant="outline">
                Get Detailed Quote
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SolarCalculator