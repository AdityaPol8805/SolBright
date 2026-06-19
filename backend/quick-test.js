// Quick API test script
const testAPI = async () => {
  console.log('Testing BrightSol Advisor API...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', JSON.stringify(healthData, null, 2));
    
    // Test MNRE subsidy data endpoint
    console.log('\n2. Testing MNRE subsidy data...');
    const subsidyResponse = await fetch('http://localhost:3001/api/mnre/subsidy-data');
    const subsidyData = await subsidyResponse.json();
    console.log('✅ MNRE subsidy data received');
    console.log('   Data keys:', Object.keys(subsidyData.data || {}));
    console.log('   Last updated:', subsidyData.data?.lastUpdated);
    console.log('   Subsidy rates available:', !!subsidyData.data?.subsidyRates);
    
    // Test cache status
    console.log('\n3. Testing cache status...');
    const cacheResponse = await fetch('http://localhost:3001/api/mnre/cache-status');
    const cacheData = await cacheResponse.json();
    console.log('✅ Cache status:', JSON.stringify(cacheData, null, 2));
    
    // Test solar calculation
    console.log('\n4. Testing solar calculation...');
    const calculationPayload = {
      monthlyBill: 5000,
      location: 'Delhi',
      roofArea: 500,
      roofType: 'RCC',
      shadingFactor: 0.1,
      electricityRate: 6.5,
      systemType: 'grid-tied'
    };
    
    const calcResponse = await fetch('http://localhost:3001/api/solar/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calculationPayload)
    });
    
    const calcData = await calcResponse.json();
    console.log('✅ Solar calculation completed');
    console.log('   System size:', calcData.data?.systemSize, 'kW');
    console.log('   Total subsidy:', '₹' + calcData.data?.subsidy?.totalSubsidy?.toLocaleString());
    console.log('   Net cost:', '₹' + calcData.data?.netCost?.toLocaleString());
    console.log('   Payback period:', calcData.data?.paybackPeriod);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

testAPI();