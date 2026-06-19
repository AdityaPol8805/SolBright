const express = require('express');
const NodeCache = require('node-cache');

const router = express.Router();

// Cache for solar calculations
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 minutes TTL

/**
 * @route POST /api/solar/calculate
 * @desc Calculate solar system requirements and costs with MNRE subsidy
 * @access Public
 */
router.post('/calculate', async (req, res) => {
  try {
    const {
      monthlyBill,
      location,
      roofArea,
      roofType,
      shadingFactor,
      electricityRate,
      systemType
    } = req.body;

    // Validation
    if (!monthlyBill || monthlyBill <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid monthly bill amount'
      });
    }

    // Calculate solar system requirements
    const calculation = await calculateSolarSystem({
      monthlyBill: parseFloat(monthlyBill),
      location: location || 'India',
      roofArea: parseFloat(roofArea) || 0,
      roofType: roofType || 'concrete',
      shadingFactor: parseFloat(shadingFactor) || 0.85,
      electricityRate: parseFloat(electricityRate) || 6,
      systemType: systemType || 'grid-tied'
    });

    res.json({
      success: true,
      data: calculation,
      calculatedAt: new Date().toISOString(),
      message: 'Solar system calculation completed successfully'
    });

  } catch (error) {
    console.error('❌ Solar calculation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Solar calculation failed',
      message: error.message
    });
  }
});

/**
 * Calculate solar system requirements
 */
async function calculateSolarSystem(params) {
  const {
    monthlyBill,
    location,
    roofArea,
    roofType,
    shadingFactor,
    electricityRate,
    systemType
  } = params;

  // Estimate monthly consumption in kWh
  const monthlyConsumption = monthlyBill / electricityRate;
  const dailyConsumption = monthlyConsumption / 30;

  // Solar irradiation in India (average 4.5-5.5 kWh/kWp/day)
  const solarIrradiation = getSolarIrradiationByLocation(location);
  
  // System efficiency factors
  const systemEfficiency = 0.8; // 80% system efficiency
  const effectiveIrradiation = solarIrradiation * shadingFactor * systemEfficiency;

  // Calculate required system size in kWp
  const requiredSystemSize = dailyConsumption / effectiveIrradiation;
  
  // Round up to nearest 0.5 kW
  const recommendedSystemSize = Math.ceil(requiredSystemSize * 2) / 2;
  
  // Check roof area constraints
  const requiredRoofArea = recommendedSystemSize * 8; // ~8 sq.m per kWp
  const roofAreaSufficient = roofArea === 0 || roofArea >= requiredRoofArea;
  
  // Cost calculations (approximate Indian market rates)
  const costPerKW = getCostPerKW(systemType, recommendedSystemSize);
  const systemCost = recommendedSystemSize * costPerKW;
  
  // MNRE Subsidy calculation
  const subsidyDetails = calculateMNRESubsidy(recommendedSystemSize, 'residential');
  
  // Financial analysis
  const annualGeneration = recommendedSystemSize * solarIrradiation * 365 * systemEfficiency;
  const annualSavings = Math.min(annualGeneration, monthlyConsumption * 12) * electricityRate;
  const paybackPeriod = (systemCost - subsidyDetails.totalSubsidy) / annualSavings;
  
  // Environmental benefits
  const co2ReductionPerYear = annualGeneration * 0.82; // 0.82 kg CO2 per kWh in India
  
  return {
    systemSize: recommendedSystemSize,
    monthlyConsumption: monthlyConsumption.toFixed(2),
    dailyConsumption: dailyConsumption.toFixed(2),
    annualGeneration: annualGeneration.toFixed(0),
    systemCost: Math.round(systemCost),
    costPerKW: costPerKW,
    subsidy: subsidyDetails,
    netCost: Math.round(systemCost - subsidyDetails.totalSubsidy),
    annualSavings: Math.round(annualSavings),
    paybackPeriod: paybackPeriod.toFixed(1),
    co2Reduction: Math.round(co2ReductionPerYear),
    roofRequirement: {
      required: requiredRoofArea.toFixed(1),
      available: roofArea,
      sufficient: roofAreaSufficient
    },
    assumptions: {
      solarIrradiation: solarIrradiation,
      systemEfficiency: systemEfficiency,
      shadingFactor: shadingFactor,
      electricityRate: electricityRate,
      systemType: systemType
    },
    recommendations: generateRecommendations(params, {
      systemSize: recommendedSystemSize,
      roofAreaSufficient,
      paybackPeriod
    })
  };
}

/**
 * Get solar irradiation by location
 */
function getSolarIrradiationByLocation(location) {
  const irradiationMap = {
    'rajasthan': 5.5,
    'gujarat': 5.3,
    'maharashtra': 5.0,
    'karnataka': 4.8,
    'telangana': 4.9,
    'tamil nadu': 4.7,
    'kerala': 4.5,
    'delhi': 4.6,
    'uttar pradesh': 4.4,
    'punjab': 4.8,
    'haryana': 4.7,
    'default': 4.5
  };

  const locationKey = location.toLowerCase();
  return irradiationMap[locationKey] || irradiationMap['default'];
}

/**
 * Get cost per kW based on system type and size
 */
function getCostPerKW(systemType, systemSize) {
  const baseCosts = {
    'grid-tied': 45000,
    'hybrid': 65000,
    'off-grid': 70000
  };

  const baseCost = baseCosts[systemType] || baseCosts['grid-tied'];
  
  // Economies of scale - larger systems have lower per-kW cost
  let scaleFactor = 1;
  if (systemSize > 5) scaleFactor = 0.95;
  if (systemSize > 10) scaleFactor = 0.90;
  
  return Math.round(baseCost * scaleFactor);
}

/**
 * Calculate MNRE subsidy (residential category)
 */
function calculateMNRESubsidy(capacity, category = 'residential') {
  const rates = {
    residential: {
      upTo3kW: { rate: 14588, max: 43764 },
      above3kWUpTo10kW: { rate: 7294, max: 51058 },
      totalMax: 94822
    }
  };

  const categoryRates = rates[category] || rates.residential;
  
  let totalSubsidy = 0;
  let breakdown = [];

  // First 3 kW
  const first3kW = Math.min(capacity, 3);
  if (first3kW > 0) {
    const amount = first3kW * categoryRates.upTo3kW.rate;
    totalSubsidy += amount;
    breakdown.push({
      range: '0-3 kW',
      capacity: first3kW,
      rate: categoryRates.upTo3kW.rate,
      amount: Math.round(amount)
    });
  }

  // Next 7 kW (3-10 kW)
  const next7kW = Math.min(Math.max(capacity - 3, 0), 7);
  if (next7kW > 0) {
    const amount = next7kW * categoryRates.above3kWUpTo10kW.rate;
    totalSubsidy += amount;
    breakdown.push({
      range: '3-10 kW',
      capacity: next7kW,
      rate: categoryRates.above3kWUpTo10kW.rate,
      amount: Math.round(amount)
    });
  }

  // Cap at maximum
  totalSubsidy = Math.min(totalSubsidy, categoryRates.totalMax);

  return {
    totalSubsidy: Math.round(totalSubsidy),
    breakdown: breakdown,
    eligibleCapacity: Math.min(capacity, 10),
    subsidyPercentage: capacity > 0 ? ((totalSubsidy / (capacity * 50000)) * 100).toFixed(1) : 0
  };
}

/**
 * Generate recommendations based on calculation
 */
function generateRecommendations(params, results) {
  const recommendations = [];

  if (!results.roofAreaSufficient) {
    recommendations.push({
      type: 'warning',
      title: 'Insufficient Roof Area',
      description: `You need ${results.systemSize * 8} sq.m but have ${params.roofArea} sq.m available.`
    });
  }

  if (results.paybackPeriod > 8) {
    recommendations.push({
      type: 'info',
      title: 'Long Payback Period',
      description: 'Consider energy efficiency measures to reduce consumption first.'
    });
  }

  if (results.systemSize > 10) {
    recommendations.push({
      type: 'info',
      title: 'System Size Exceeds Subsidy Limit',
      description: 'MNRE subsidy is available only up to 10 kW for residential installations.'
    });
  }

  if (params.shadingFactor < 0.8) {
    recommendations.push({
      type: 'warning',
      title: 'Shading Issues Detected',
      description: 'Consider removing obstructions or optimizing panel placement.'
    });
  }

  return recommendations;
}

/**
 * @route GET /api/solar/locations
 * @desc Get list of supported locations with solar irradiation data
 * @access Public
 */
router.get('/locations', (req, res) => {
  const locations = [
    { name: 'Rajasthan', irradiation: 5.5, climate: 'Arid' },
    { name: 'Gujarat', irradiation: 5.3, climate: 'Arid to Semi-Arid' },
    { name: 'Maharashtra', irradiation: 5.0, climate: 'Tropical' },
    { name: 'Karnataka', irradiation: 4.8, climate: 'Tropical' },
    { name: 'Telangana', irradiation: 4.9, climate: 'Tropical' },
    { name: 'Tamil Nadu', irradiation: 4.7, climate: 'Tropical' },
    { name: 'Kerala', irradiation: 4.5, climate: 'Tropical' },
    { name: 'Delhi', irradiation: 4.6, climate: 'Semi-Arid' },
    { name: 'Uttar Pradesh', irradiation: 4.4, climate: 'Subtropical' },
    { name: 'Punjab', irradiation: 4.8, climate: 'Semi-Arid' },
    { name: 'Haryana', irradiation: 4.7, climate: 'Semi-Arid' }
  ];

  res.json({
    success: true,
    data: locations,
    message: 'Solar irradiation data for Indian states'
  });
});

module.exports = router;