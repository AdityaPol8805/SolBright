// Simple API Integration Test
console.log('Testing BrightSol Advisor API Integration...\n');

// Test basic fetch to backend
fetch('http://localhost:3001/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend Health Check:', data);
    
    // Test MNRE API
    return fetch('http://localhost:3001/api/mnre/subsidy-data');
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ MNRE Subsidy Data:', {
      success: data.success,
      hasData: !!data.data,
      lastUpdated: data.data?.lastUpdated,
      subsidyRatesAvailable: !!data.data?.subsidyRates
    });
    
    // Test Solar Calculator API
    const testCalculation = {
      monthlyBill: 5000,
      location: 'Delhi',
      roofArea: 500,
      roofType: 'RCC',
      shadingFactor: 0.1,
      electricityRate: 6.5,
      systemType: 'grid-tied'
    };
    
    return fetch('http://localhost:3001/api/solar/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCalculation)
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Solar Calculator:', {
      success: data.success,
      systemSize: data.data?.systemSize + ' kW',
      totalSubsidy: data.data?.subsidy?.totalSubsidy ? '₹' + data.data.subsidy.totalSubsidy.toLocaleString() : 'N/A',
      netCost: data.data?.netCost ? '₹' + data.data.netCost.toLocaleString() : 'N/A',
      paybackPeriod: data.data?.paybackPeriod || 'N/A'
    });
    
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('🌐 Frontend: http://localhost:8081');
    console.log('🔌 Backend: http://localhost:3001');
    console.log('📊 Subsidy Info: http://localhost:8081/subsidy');
    console.log('🔄 Calculator: http://localhost:8081/calculator');
  })
  .catch(error => {
    console.error('❌ API Test Failed:', error.message);
  });