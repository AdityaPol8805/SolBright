// Hooks for MNRE Subsidy and Solar Calculator APIs
import { useState, useEffect } from 'react';
import { apiService, SolarCalculationInput, SolarCalculationResult, MNRESubsidyData, ApiResponse } from '../services/apiService';

// Hook for MNRE Subsidy Data
export const useMNRESubsidy = () => {
  const [subsidyData, setSubsidyData] = useState<MNRESubsidyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubsidyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Attempting to fetch MNRE subsidy data...');
      const response = await apiService.getMNRESubsidyData() as ApiResponse<MNRESubsidyData>;
      console.log('✅ MNRE API response received:', response);
      if (response.success) {
        setSubsidyData(response.data);
      } else {
        setError(response.message || 'Failed to fetch subsidy data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubsidyData();
  }, []);

  const refreshData = () => {
    fetchSubsidyData();
  };

  return {
    subsidyData,
    loading,
    error,
    refreshData,
  };
};

// Hook for Solar Calculator
export const useSolarCalculator = () => {
  const [result, setResult] = useState<SolarCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (inputData: SolarCalculationInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.calculateSolarSystem(inputData) as ApiResponse<SolarCalculationResult>;
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message || 'Calculation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error occurred');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    loading,
    error,
    calculate,
    reset,
  };
};

// Hook for Subsidy Rates
export const useSubsidyRates = () => {
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRates = async (capacity: number, category: string = 'residential') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getSubsidyRates(capacity, category) as any;
      if (response.success) {
        setRates(response.data);
      } else {
        setError(response.message || 'Failed to fetch subsidy rates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    rates,
    loading,
    error,
    getRates,
  };
};

// Hook for API Health Check
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    
    try {
      const response = await apiService.healthCheck() as any;
      // Check if response has status 'OK' or success property
      setIsHealthy(response.status === 'OK' || response.success === true);
    } catch (err) {
      setIsHealthy(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    isHealthy,
    loading,
    checkHealth,
  };
};

// Combined hook for solar system calculation with subsidy integration
export const useSolarSystemWithSubsidy = () => {
  const { subsidyData, loading: subsidyLoading } = useMNRESubsidy();
  const { result, loading: calculationLoading, error, calculate, reset } = useSolarCalculator();

  const calculateWithSubsidy = async (inputData: SolarCalculationInput) => {
    // Ensure subsidy data is available before calculation
    if (!subsidyData && !subsidyLoading) {
      throw new Error('Subsidy data not available. Please try again.');
    }
    
    await calculate(inputData);
  };

  return {
    result,
    subsidyData,
    loading: calculationLoading || subsidyLoading,
    error,
    calculate: calculateWithSubsidy,
    reset,
  };
};