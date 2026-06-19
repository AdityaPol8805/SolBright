import React from 'react';
import { useMNRESubsidy } from '../hooks/useApiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle, CheckCircle, Download } from 'lucide-react';

// Temporary Badge component
const Badge: React.FC<{ 
  variant?: 'default' | 'secondary' | 'outline'; 
  className?: string; 
  children: React.ReactNode;
}> = ({ variant = 'default', className = '', children }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  const variantClasses = {
    default: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    outline: 'border border-gray-300 text-gray-700'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const MNRESubsidyInfo: React.FC = () => {
  const { subsidyData, loading, error, refreshData } = useMNRESubsidy();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading MNRE subsidy data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading subsidy data</span>
          </div>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!subsidyData) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-yellow-700">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">No subsidy data available</span>
          </div>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { subsidyRates, lastUpdated, effectiveDate, version } = subsidyData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            MNRE Solar Rooftop Subsidy
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Official subsidy rates from Ministry of New and Renewable Energy
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Official Data
          </Badge>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Data Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Last Updated</div>
            <div className="font-medium">{new Date(lastUpdated).toLocaleDateString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Effective Date</div>
            <div className="font-medium">{new Date(effectiveDate).toLocaleDateString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Version</div>
            <div className="font-medium">{version}</div>
          </CardContent>
        </Card>
      </div>

      {/* Residential Subsidy Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Residential Subsidy Rates</span>
            <Badge variant="secondary">Consumer Category</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Up to 3 kW */}
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Up to 3 kW Capacity
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subsidy Rate:</span>
                  <span className="font-medium">
                    ₹{subsidyRates.residential.upTo3kW.rate.toLocaleString()}/kW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Amount:</span>
                  <span className="font-medium">
                    ₹{subsidyRates.residential.upTo3kW.maxAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {subsidyRates.residential.upTo3kW.description}
                </p>
              </div>
            </div>

            {/* Above 3 kW up to 10 kW */}
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                Above 3 kW up to 10 kW
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subsidy Rate:</span>
                  <span className="font-medium">
                    ₹{subsidyRates.residential.above3kWUpTo10kW.rate.toLocaleString()}/kW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Amount:</span>
                  <span className="font-medium">
                    ₹{subsidyRates.residential.above3kWUpTo10kW.maxAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {subsidyRates.residential.above3kWUpTo10kW.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-yellow-900">
                Maximum Total Subsidy for Residential
              </span>
              <span className="text-lg font-bold text-yellow-900">
                ₹{subsidyRates.residential.totalMaxSubsidy.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institutional Subsidy Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Institutional Subsidy Rates</span>
            <Badge variant="secondary">Schools, Hospitals, etc.</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">
              Up to 500 kW Capacity
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subsidy Rate:</span>
                <span className="font-medium">
                  ₹{subsidyRates.institutional.upTo500kW.rate.toLocaleString()}/kW
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {subsidyRates.institutional.upTo500kW.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(subsidyData.eligibilityCriteria || []).map((criteria, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{criteria}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(subsidyData.documents || []).map((document, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{document}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Process Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Application Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(subsidyData.processFlow || []).map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MNRESubsidyInfo;