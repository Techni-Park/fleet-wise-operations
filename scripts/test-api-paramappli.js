const http = require('http');

async function testParamAppliAPI() {
  console.log('🔍 [API Test] Testing /api/paramappli endpoint...');
  
  const hostname = 'localhost';
  const port = process.env.PORT || 3000;
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port,
      path: '/api/paramappli',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ParametersDebugScript/1.0'
      }
    };

    console.log('📡 [API Test] Making request to:', `http://${hostname}:${port}/api/paramappli`);

    const req = http.request(options, (res) => {
      console.log('📨 [API Test] Response received:', {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.headers
      });

      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📊 [API Test] Response body length:', data.length);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ [API Test] JSON parsed successfully');
          console.log('📋 [API Test] Response data:', {
            hasData: !!jsonData,
            dataType: typeof jsonData,
            isError: !!jsonData.error,
            errorMessage: jsonData.error,
            dataKeys: jsonData && !jsonData.error ? Object.keys(jsonData) : 'error or no data',
            sampleData: jsonData && !jsonData.error ? {
              IDPARAMAPPLI: jsonData.IDPARAMAPPLI,
              RAISON_SOCIALE: jsonData.RAISON_SOCIALE,
              EMAIL: jsonData.EMAIL,
              ADRESSE: jsonData.ADRESSE
            } : 'error or no data'
          });
          
          if (res.statusCode === 200) {
            console.log('✅ [API Test] API call successful');
            resolve(jsonData);
          } else {
            console.log('❌ [API Test] API call failed with status:', res.statusCode);
            reject(new Error(`API returned ${res.statusCode}: ${jsonData.error || 'Unknown error'}`));
          }
        } catch (parseError) {
          console.error('💥 [API Test] Failed to parse JSON response:', parseError);
          console.log('📄 [API Test] Raw response:', data);
          reject(parseError);
        }
      });
    });

    req.on('error', (error) => {
      console.error('💥 [API Test] Request error:', error);
      console.error('📋 [API Test] Error details:', {
        message: error.message,
        code: error.code,
        address: error.address,
        port: error.port
      });
      reject(error);
    });

    req.on('timeout', () => {
      console.error('⏰ [API Test] Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    // Set timeout
    req.setTimeout(10000); // 10 seconds

    req.end();
  });
}

async function testWithAuth() {
  console.log('🔐 [API Test] Note: This test does not include authentication');
  console.log('🔐 [API Test] In a real scenario, you would need to:');
  console.log('  1. First login via /api/login');
  console.log('  2. Extract session cookie');
  console.log('  3. Include cookie in subsequent requests');
  console.log('');
  console.log('🔍 [API Test] For now, testing without auth (should return 401)...');
}

// Fonction principale
async function runTests() {
  try {
    await testWithAuth();
    await testParamAppliAPI();
  } catch (error) {
    console.error('💥 [API Test] Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 [API Test] Server appears to be down. Make sure to start the server first:');
      console.log('  npm run dev');
    } else if (error.message.includes('401')) {
      console.log('💡 [API Test] Got 401 Unauthorized - this is expected without authentication');
      console.log('💡 [API Test] The API endpoint is working but requires login');
    }
  }
}

// Exécuter les tests
console.log('🚀 [API Test] Starting API tests...');
runTests()
  .then(() => console.log('🏁 [API Test] Tests completed'))
  .catch(error => console.error('💥 [API Test] Tests failed:', error)); 