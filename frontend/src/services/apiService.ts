// API service for BrightSol Advisor Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`🌐 Making API request to: ${url}`);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data received successfully');
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // MNRE Subsidy APIs
  async getMNRESubsidyData() {
    return this.request('/api/mnre/subsidy-data');
  }

  async getSubsidyRates(capacity: number, category: string = 'residential') {
    return this.request(`/api/mnre/subsidy-rates?capacity=${capacity}&category=${category}`);
  }

  async clearCache(key?: string) {
    return this.request('/api/mnre/clear-cache', {
      method: 'POST',
      body: JSON.stringify({ key }),
    });
  }

  async getCacheStatus() {
    return this.request('/api/mnre/cache-status');
  }

  // Solar Calculator APIs
  async calculateSolarSystem(calculationData: SolarCalculationInput) {
    return this.request('/api/solar/calculate', {
      method: 'POST',
      body: JSON.stringify(calculationData),
    });
  }

  async getLocations() {
    return this.request('/api/solar/locations');
  }
}

// Types for API requests/responses
export interface SolarCalculationInput {
  monthlyBill: number;
  location: string;
  roofArea: number;
  roofType: string;
  shadingFactor: number;
  electricityRate: number;
  systemType: string;
}

export interface MNRESubsidyData {
  lastUpdated: string;
  effectiveDate: string;
  version: string;
  subsidyRates: {
    residential: {
      upTo3kW: {
        rate: number;
        maxAmount: number;
        description: string;
      };
      above3kWUpTo10kW: {
        rate: number;
        maxAmount: number;
        description: string;
      };
      totalMaxSubsidy: number;
    };
    institutional: {
      upTo500kW: {
        rate: number;
        description: string;
      };
    };
  };
  eligibilityCriteria: string[];
  documents: string[];
  processFlow: string[];
}

export interface SolarCalculationResult {
  systemSize: number;
  monthlyConsumption: number;
  dailyConsumption: number;
  annualGeneration: number;
  systemCost: number;
  costPerKW: number;
  subsidy: {
    totalSubsidy: number;
    breakdown: Array<{
      range: string;
      capacity: number;
      rate: number;
      amount: number;
    }>;
    eligibleCapacity: number;
    subsidyPercentage: string;
  };
  netCost: number;
  annualSavings: number;
  paybackPeriod: string;
  co2Reduction: number;
  roofRequirement: {
    required: string;
    available: number;
    sufficient: boolean;
  };
  assumptions: {
    solarIrradiation: number;
    systemEfficiency: number;
    shadingFactor: number;
    electricityRate: number;
    systemType: string;
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  lastUpdated?: string;
  source?: string;
  error?: string;
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;