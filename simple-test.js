// Simple HTTP test for Node.js
const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:8080',
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ ${description}:`, {
            status: res.statusCode,
            success: result.success || 'OK',
            message: result.message || 'Response received'
          });
          resolve(result);
        } catch (e) {
          console.log(`✅ ${description}:`, {
            status: res.statusCode,
            data: data.substring(0, 100) + '...'
          });
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${description}:`, error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error(`⏰ ${description}: Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing BrightSol Advisor API Integration...\n');
  
  try {
    await testEndpoint('/health', 'Health Check');
    await testEndpoint('/api/mnre/subsidy-data', 'MNRE Subsidy Data');
    await testEndpoint('/api/mnre/cache-status', 'Cache Status');
    
    console.log('\n🎉 All tests completed!');
    console.log('🌐 Frontend: http://localhost:8080');
    console.log('🔌 Backend: http://localhost:3001');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
}

runTests();