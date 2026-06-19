import React from 'react';
import MNRESubsidyInfo from '../components/MNRESubsidyInfo';
import { useApiHealth } from '../hooks/useApiService';
import { AlertCircle, Server } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const SubsidyInformation: React.FC = () => {
  const { isHealthy, loading: healthLoading } = useApiHealth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MNRE Solar Rooftop Subsidy Information
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the latest official subsidy rates and policies from the Ministry of New and Renewable Energy (MNRE).
            This information is fetched directly from government sources to ensure accuracy and timeliness.
          </p>
        </div>

        {/* API Status Indicator */}
        <div className="mb-6">
          <Card className={`border-l-4 ${isHealthy === true ? 'border-l-green-500 bg-green-50' : 
            isHealthy === false ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Server className={`h-5 w-5 ${
                  isHealthy === true ? 'text-green-600' : 
                  isHealthy === false ? 'text-red-600' : 'text-yellow-600'
                } ${healthLoading ? 'animate-pulse' : ''}`} />
                <div>
                  <div className="font-medium text-gray-900">
                    {isHealthy === true ? 'API Connected' :
                     isHealthy === false ? 'API Disconnected' : 'Checking Connection...'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isHealthy === true ? 'Real-time data from MNRE servers is available' :
                     isHealthy === false ? 'Unable to fetch live data. Fallback data may be used.' : 
                     'Verifying connection to backend services...'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {isHealthy === false && (
          <div className="mb-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-2">
                      Limited Functionality
                    </h3>
                    <p className="text-sm text-yellow-700">
                      The backend API is currently unavailable. The subsidy information shown may be cached or fallback data.
                      For the most current rates, please check the official MNRE website or try refreshing this page later.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <MNRESubsidyInfo />

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Important Notes
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              • Subsidy rates are subject to change based on MNRE policies and state government guidelines.
            </p>
            <p>
              • This information is fetched directly from official government sources and updated regularly.
            </p>
            <p>
              • For specific project approvals, please consult with authorized solar installers and MNRE-approved agencies.
            </p>
            <p>
              • State-specific variations may apply. Please check with your local electricity board for additional details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsidyInformation;