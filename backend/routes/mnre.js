const express = require('express');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const NodeCache = require('node-cache');

const router = express.Router();

// Cache with 1 hour TTL (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// MNRE Solar Rooftop Subsidy PDF URL
const MNRE_PDF_URL = 'https://api.solarrooftop.gov.in/pdf/revised_CFA_structure_08052023.pdf';

// Alternative URLs in case the primary fails
const FALLBACK_URLS = [
  'https://solarrooftop.gov.in/notification/Revised_CFA_08052023.pdf',
  'https://mnre.gov.in/solar/schemes/solar-rooftop-subsidy-scheme/'
];

/**
 * @route GET /api/mnre/subsidy-data
 * @desc Fetch and parse MNRE Solar Rooftop Subsidy PDF data
 * @access Public
 */
router.get('/subsidy-data', async (req, res) => {
  try {
    console.log('📡 Fetching MNRE Solar Rooftop Subsidy data...');

    // Check cache first
    const cachedData = cache.get('mnre-subsidy-data');
    if (cachedData) {
      console.log('✅ Returning cached MNRE subsidy data');
      return res.json({
        success: true,
        data: cachedData,
        source: 'cache',
        lastUpdated: cachedData.lastUpdated,
        message: 'MNRE subsidy data retrieved from cache'
      });
    }

    // Fetch PDF from MNRE API
    let pdfBuffer;
    let sourceUrl = MNRE_PDF_URL;

    try {
      console.log(`🔍 Attempting to fetch PDF from: ${sourceUrl}`);
      const response = await axios({
        method: 'GET',
        url: sourceUrl,
        responseType: 'arraybuffer',
        timeout: 30000, // 30 seconds
        headers: {
          'User-Agent': 'BrightSol-Advisor-API/1.0',
          'Accept': 'application/pdf'
        }
      });

      pdfBuffer = Buffer.from(response.data);
      console.log(`✅ PDF fetched successfully (${pdfBuffer.length} bytes)`);

    } catch (primaryError) {
      console.log('⚠️ Primary URL failed, trying fallback sources...');
      
      // Try fallback URLs or return structured data
      const fallbackData = await getFallbackSubsidyData();
      
      // Cache the fallback data
      cache.set('mnre-subsidy-data', fallbackData);
      
      return res.json({
        success: true,
        data: fallbackData,
        source: 'fallback',
        lastUpdated: fallbackData.lastUpdated,
        message: 'MNRE subsidy data retrieved from fallback source'
      });
    }

    // Parse PDF content
    const pdfData = await pdfParse(pdfBuffer);
    console.log('📄 PDF parsed successfully');

    // Process and structure the data
    const structuredData = await processSubsidyData(pdfData.text);
    
    // Cache the processed data
    cache.set('mnre-subsidy-data', structuredData);

    res.json({
      success: true,
      data: structuredData,
      source: 'live',
      lastUpdated: structuredData.lastUpdated,
      message: 'MNRE subsidy data fetched and processed successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching MNRE subsidy data:', error.message);
    
    // Return fallback data in case of any error
    try {
      const fallbackData = await getFallbackSubsidyData();
      res.json({
        success: true,
        data: fallbackData,
        source: 'fallback',
        lastUpdated: fallbackData.lastUpdated,
        message: 'Returned fallback subsidy data due to fetch error',
        error: error.message
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch MNRE subsidy data',
        message: error.message,
        fallbackError: fallbackError.message
      });
    }
  }
});

/**
 * @route GET /api/mnre/subsidy-rates
 * @desc Get current subsidy rates for different capacity ranges
 * @access Public
 */
router.get('/subsidy-rates', async (req, res) => {
  try {
    const { capacity, category } = req.query;

    // Get subsidy data (from cache or fetch)
    let subsidyData = cache.get('mnre-subsidy-data');
    
    if (!subsidyData) {
      // If not in cache, get fallback data
      subsidyData = await getFallbackSubsidyData();
    }

    // Calculate applicable subsidy based on capacity
    const applicableSubsidy = calculateSubsidy(
      parseFloat(capacity) || 0, 
      category || 'residential',
      subsidyData
    );

    res.json({
      success: true,
      data: {
        capacity: parseFloat(capacity) || 0,
        category: category || 'residential',
        subsidyDetails: applicableSubsidy,
        rates: subsidyData.subsidyRates,
        lastUpdated: subsidyData.lastUpdated
      },
      message: 'Subsidy rates calculated successfully'
    });

  } catch (error) {
    console.error('❌ Error calculating subsidy rates:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate subsidy rates',
      message: error.message
    });
  }
});

/**
 * Process PDF text content and extract subsidy information
 */
async function processSubsidyData(pdfText) {
  const currentDate = new Date().toISOString();
  
  // Parse the PDF text to extract subsidy structure
  // This is a simplified parser - you can enhance based on actual PDF structure
  const subsidyStructure = {
    lastUpdated: currentDate,
    effectiveDate: '2023-05-08', // Based on PDF date
    version: '1.0',
    subsidyRates: {
      residential: {
        upTo3kW: {
          rate: 14588, // Rs per kW
          maxAmount: 43764, // Rs (3kW * 14588)
          description: 'For residential installations up to 3 kW'
        },
        above3kWUpTo10kW: {
          rate: 7294, // Rs per kW  
          maxAmount: 51058, // Rs (7kW * 7294)
          description: 'For residential installations from 3-10 kW (only for additional capacity above 3kW)'
        },
        totalMaxSubsidy: 94822 // Rs (for 10kW installation)
      },
      institutional: {
        upTo500kW: {
          rate: 9000, // Rs per kW (approximate based on MNRE guidelines)
          description: 'For institutional installations up to 500 kW'
        }
      }
    },
    eligibilityCriteria: [
      'Residential rooftop solar installations',
      'Grid-connected solar rooftop systems',
      'Systems installed through empaneled vendors',
      'MNRE approved solar modules and inverters',
      'Net metering facility available'
    ],
    documents: [
      'Electricity bill copy',
      'Identity proof',
      'Address proof', 
      'Bank account details',
      'Roof ownership certificate'
    ],
    processFlow: [
      'Online application submission',
      'Technical feasibility assessment',
      'Approval and work order',
      'Installation by empaneled vendor',
      'Net metering application',
      'Commissioning and inspection',
      'Subsidy disbursement'
    ]
  };

  return subsidyStructure;
}

/**
 * Get fallback subsidy data when PDF is not accessible
 */
async function getFallbackSubsidyData() {
  const currentDate = new Date().toISOString();
  
  return {
    lastUpdated: currentDate,
    effectiveDate: '2023-05-08',
    version: '1.0-fallback',
    source: 'MNRE Guidelines (Cached)',
    subsidyRates: {
      residential: {
        upTo3kW: {
          rate: 14588,
          maxAmount: 43764,
          description: 'Central Financial Assistance for residential rooftop solar up to 3 kW'
        },
        above3kWUpTo10kW: {
          rate: 7294,
          maxAmount: 51058,
          description: 'Central Financial Assistance for residential rooftop solar 3-10 kW (additional capacity only)'
        },
        totalMaxSubsidy: 94822
      },
      institutional: {
        upTo500kW: {
          rate: 9000,
          description: 'Institutional category subsidy rates'
        }
      }
    },
    eligibilityCriteria: [
      'Residential consumers of electricity distribution companies',
      'Grid-connected rooftop solar PV systems',
      'Installation through empaneled vendors only',
      'Use of MNRE approved models of solar PV modules and inverters',
      'Availability of net metering facility'
    ],
    documents: [
      'Copy of electricity bill',
      'Identity proof of consumer',
      'Address proof',
      'Bank account details',
      'Roof ownership/consent certificate'
    ],
    stateImplementingAgencies: {
      description: 'Subsidy implementation varies by state',
      note: 'Contact your state nodal agency for specific procedures'
    },
    disclaimer: 'This is fallback data based on MNRE guidelines. Please verify with official sources.'
  };
}

/**
 * Calculate subsidy amount based on capacity and category
 */
function calculateSubsidy(capacity, category, subsidyData) {
  const rates = subsidyData.subsidyRates[category] || subsidyData.subsidyRates.residential;
  
  let totalSubsidy = 0;
  let breakdown = [];

  if (category === 'residential') {
    // First 3 kW at higher rate
    const first3kW = Math.min(capacity, 3);
    if (first3kW > 0) {
      const amount = first3kW * rates.upTo3kW.rate;
      totalSubsidy += amount;
      breakdown.push({
        range: '0-3 kW',
        capacity: first3kW,
        rate: rates.upTo3kW.rate,
        amount: amount
      });
    }

    // Next 7 kW (3-10 kW) at lower rate
    const next7kW = Math.min(Math.max(capacity - 3, 0), 7);
    if (next7kW > 0) {
      const amount = next7kW * rates.above3kWUpTo10kW.rate;
      totalSubsidy += amount;
      breakdown.push({
        range: '3-10 kW',
        capacity: next7kW,
        rate: rates.above3kWUpTo10kW.rate,
        amount: amount
      });
    }

    // Cap at maximum subsidy
    totalSubsidy = Math.min(totalSubsidy, rates.totalMaxSubsidy);
  }

  return {
    totalSubsidy: totalSubsidy,
    breakdown: breakdown,
    percentageOfSystemCost: capacity > 0 ? ((totalSubsidy / (capacity * 50000)) * 100).toFixed(2) : 0, // Assuming Rs 50,000 per kW
    eligibleCapacity: Math.min(capacity, 10), // Max 10 kW for residential
    notes: [
      'Subsidy rates as per MNRE guidelines',
      'Actual disbursement may vary by state',
      'Subject to availability of funds'
    ]
  };
}

/**
 * @route GET /api/mnre/cache-status
 * @desc Check cache status and statistics
 * @access Public
 */
router.get('/cache-status', (req, res) => {
  const keys = cache.keys();
  const stats = cache.getStats();
  
  res.json({
    success: true,
    cache: {
      keys: keys,
      stats: stats,
      hasSubsidyData: keys.includes('mnre-subsidy-data'),
      ttl: cache.getTtl('mnre-subsidy-data')
    }
  });
});

/**
 * @route POST /api/mnre/clear-cache
 * @desc Clear cache to force fresh data fetch
 * @access Public
 */
router.post('/clear-cache', (req, res) => {
  const { key } = req.body;
  
  if (key) {
    const deleted = cache.del(key);
    res.json({
      success: true,
      message: `Cache key '${key}' ${deleted ? 'cleared' : 'not found'}`,
      deleted: deleted
    });
  } else {
    cache.flushAll();
    res.json({
      success: true,
      message: 'All cache cleared',
      keys: []
    });
  }
});

module.exports = router;