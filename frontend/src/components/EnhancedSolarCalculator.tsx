import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSolarCalculator } from '../hooks/useApiService';
import { Calculator, Home, Zap, DollarSign, TrendingUp, MapPin, Building, Sun, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CalculatorFormData {
  monthlyBill: number;
  location: string;
  roofArea: number;
  roofType: string;
  shadingFactor: number;
  electricityRate: number;
  systemType: string;
}

const EnhancedSolarCalculator: React.FC = () => {
  const { calculate: calculateSystem, result, loading, error } = useSolarCalculator();
  
  const [formData, setFormData] = useState<CalculatorFormData>({
    monthlyBill: 0,
    location: 'Delhi',
    roofArea: 0,
    roofType: 'RCC',
    shadingFactor: 0.1,
    electricityRate: 6.5,
    systemType: 'grid-tied'
  });

  const handleInputChange = (field: keyof CalculatorFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? (isNaN(Number(value)) ? value : Number(value)) : value
    }));
  };

  const handleCalculate = async () => {
    // Validation
    if (formData.monthlyBill <= 0) {
      toast.error('Please enter a valid monthly electricity bill');
      return;
    }
    if (formData.roofArea <= 0) {
      toast.error('Please enter a valid roof area');
      return;
    }

    try {
      await calculateSystem(formData);
      toast.success('Calculation completed with MNRE subsidy data!');
    } catch (err) {
      toast.error('Calculation failed. Please try again.');
    }
  };

  const locations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 
    'Patna', 'Vadodara', 'Ghaziabad'
  ];

  const roofTypes = [
    { value: 'RCC', label: 'RCC (Reinforced Concrete)' },
    { value: 'Sheet', label: 'Metal Sheet' },
    { value: 'Tile', label: 'Tile Roof' },
    { value: 'Asbestos', label: 'Asbestos Sheet' }
  ];

  const systemTypes = [
    { value: 'grid-tied', label: 'Grid-Tied System' },
    { value: 'off-grid', label: 'Off-Grid System' },
    { value: 'hybrid', label: 'Hybrid System' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advanced Solar Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Calculate your solar system requirements with real-time MNRE subsidy data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>System Requirements</span>
            </CardTitle>
            <CardDescription>
              Enter your details to get accurate solar calculations with official MNRE subsidy rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Monthly Bill */}
            <div className="space-y-2">
              <Label htmlFor="monthlyBill" className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Monthly Electricity Bill (₹)</span>
              </Label>
              <Input
                id="monthlyBill"
                type="number"
                placeholder="e.g., 5000"
                value={formData.monthlyBill || ''}
                onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Roof Area */}
            <div className="space-y-2">
              <Label htmlFor="roofArea" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Available Roof Area (sq ft)</span>
              </Label>
              <Input
                id="roofArea"
                type="number"
                placeholder="e.g., 500"
                value={formData.roofArea || ''}
                onChange={(e) => handleInputChange('roofArea', e.target.value)}
              />
            </div>

            {/* Roof Type */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>Roof Type</span>
              </Label>
              <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select roof type" />
                </SelectTrigger>
                <SelectContent>
                  {roofTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* System Type */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>System Type</span>
              </Label>
              <Select value={formData.systemType} onValueChange={(value) => handleInputChange('systemType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select system type" />
                </SelectTrigger>
                <SelectContent>
                  {systemTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-gray-900">Advanced Options</h4>
              
              <div className="space-y-2">
                <Label htmlFor="electricityRate">Electricity Rate (₹/kWh)</Label>
                <Input
                  id="electricityRate"
                  type="number"
                  step="0.1"
                  value={formData.electricityRate || ''}
                  onChange={(e) => handleInputChange('electricityRate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shadingFactor">Shading Factor (0.0 - 1.0)</Label>
                <Input
                  id="shadingFactor"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.shadingFactor || ''}
                  onChange={(e) => handleInputChange('shadingFactor', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  0.0 = No shading, 1.0 = Completely shaded
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <Button 
              onClick={handleCalculate} 
              disabled={loading} 
              className="w-full"
              size="lg"
            >
              {loading ? 'Calculating...' : 'Calculate Solar System'}
              <Calculator className="ml-2 h-4 w-4" />
            </Button>

            {error && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Calculation Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* System Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span>Recommended Solar System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">
                        {result.systemSize} kW
                      </div>
                      <div className="text-sm text-blue-700">System Size</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">
                        {result.annualGeneration?.toLocaleString()} kWh
                      </div>
                      <div className="text-sm text-green-700">Annual Generation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span>Cost Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total System Cost:</span>
                        <span className="font-medium">₹{result.systemCost?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">MNRE Subsidy:</span>
                        <span className="font-medium text-green-600">
                          -₹{result.subsidy?.totalSubsidy?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Net Cost:</span>
                        <span className="font-bold text-lg">₹{result.netCost?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Savings:</span>
                        <span className="font-medium">₹{result.annualSavings?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payback Period:</span>
                        <span className="font-medium">{result.paybackPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CO₂ Reduction:</span>
                        <span className="font-medium text-green-600">
                          {result.co2Reduction?.toLocaleString()} kg/year
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subsidy Breakdown */}
              {result.subsidy && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <span>MNRE Subsidy Breakdown</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.subsidy.breakdown?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{item.range}</div>
                            <div className="text-sm text-gray-600">
                              {item.capacity} kW × ₹{item.rate?.toLocaleString()}/kW
                            </div>
                          </div>
                          <div className="font-bold text-green-600">
                            ₹{item.amount?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-medium">Total Subsidy ({result.subsidy.subsidyPercentage})</span>
                        <span className="font-bold text-lg text-green-600">
                          ₹{result.subsidy.totalSubsidy?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Roof Requirement */}
              {result.roofRequirement && (
                <Card className={`border-l-4 ${result.roofRequirement.sufficient ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.roofRequirement.sufficient ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">Roof Space Analysis</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Required Space:</span>
                        <span>{result.roofRequirement.required}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Space:</span>
                        <span>{result.roofRequirement.available} sq ft</span>
                      </div>
                      <p className={`mt-2 ${result.roofRequirement.sufficient ? 'text-green-700' : 'text-red-700'}`}>
                        {result.roofRequirement.sufficient 
                          ? 'Sufficient space available for the recommended system.'
                          : 'Insufficient space. Consider a smaller system or increasing available roof area.'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      <span>Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-900">{rec.title}</div>
                          <div className="text-sm text-blue-700 mt-1">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-600">
                  Fill in your details and click "Calculate Solar System" to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSolarCalculator;