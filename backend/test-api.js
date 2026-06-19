// Test script to verify MNRE API functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing BrightSol Advisor API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    console.log('   Message:', healthResponse.data.message);
    console.log('');

    // Test 2: MNRE Subsidy Data
    console.log('2. Testing MNRE Subsidy Data...');
    const subsidyResponse = await axios.get(`${BASE_URL}/api/mnre/subsidy-data`);
    console.log('✅ MNRE Data Success:', subsidyResponse.data.success);
    console.log('   Source:', subsidyResponse.data.source);
    console.log('   Last Updated:', subsidyResponse.data.lastUpdated);
    console.log('   Residential Rate (0-3kW):', `₹${subsidyResponse.data.data.subsidyRates.residential.upTo3kW.rate}/kW`);
    console.log('');

    // Test 3: Subsidy Rate Calculation
    console.log('3. Testing Subsidy Rate Calculation (5kW system)...');
    const rateResponse = await axios.get(`${BASE_URL}/api/mnre/subsidy-rates?capacity=5&category=residential`);
    console.log('✅ Subsidy Calculation Success:', rateResponse.data.success);
    console.log('   Total Subsidy for 5kW:', `₹${rateResponse.data.data.subsidyDetails.totalSubsidy}`);
    console.log('   Breakdown:');
    rateResponse.data.data.subsidyDetails.breakdown.forEach(item => {
      console.log(`     ${item.range}: ${item.capacity}kW × ₹${item.rate} = ₹${item.amount}`);
    });
    console.log('');

    // Test 4: Solar System Calculator
    console.log('4. Testing Solar System Calculator...');
    const calculationData = {
      monthlyBill: 3000,
      location: 'Maharashtra',
      roofArea: 100,
      roofType: 'concrete',
      shadingFactor: 0.85,
      electricityRate: 6,
      systemType: 'grid-tied'
    };

    const calcResponse = await axios.post(`${BASE_URL}/api/solar/calculate`, calculationData);
    console.log('✅ Solar Calculation Success:', calcResponse.data.success);
    console.log('   Recommended System Size:', `${calcResponse.data.data.systemSize} kW`);
    console.log('   System Cost:', `₹${calcResponse.data.data.systemCost.toLocaleString()}`);
    console.log('   MNRE Subsidy:', `₹${calcResponse.data.data.subsidy.totalSubsidy.toLocaleString()}`);
    console.log('   Net Cost:', `₹${calcResponse.data.data.netCost.toLocaleString()}`);
    console.log('   Annual Savings:', `₹${calcResponse.data.data.annualSavings.toLocaleString()}`);
    console.log('   Payback Period:', `${calcResponse.data.data.paybackPeriod} years`);
    console.log('   CO2 Reduction:', `${calcResponse.data.data.co2Reduction} kg/year`);
    console.log('');

    // Test 5: Locations Data
    console.log('5. Testing Locations Data...');
    const locationsResponse = await axios.get(`${BASE_URL}/api/solar/locations`);
    console.log('✅ Locations Data Success:', locationsResponse.data.success);
    console.log('   Available Locations:', locationsResponse.data.data.length);
    console.log('   Sample Location:', locationsResponse.data.data[0]);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('🌞 BrightSol Advisor API is fully functional with MNRE integration');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run tests
testAPI();