const https = require('https');

async function testExternalAPI() {
  console.log('🌐 [External Test] Testing API from fleet.voluntis.space...');
  
  const hostname = 'fleet.voluntis.space';
  const endpoints = [
    '/api/auth-test',
    '/api/paramappli',
    '/api/db-test'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🔍 [External Test] Testing ${endpoint}...`);
    
    await new Promise((resolve) => {
      const options = {
        hostname,
        port: 443,
        path: endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ExternalAPITest/1.0'
        },
        // Ignorer les erreurs SSL pour les tests
        rejectUnauthorized: false
      };

      const req = https.request(options, (res) => {
        console.log(`📨 [External Test] ${endpoint} Response:`, {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers
        });

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log(`📊 [External Test] ${endpoint} Body length:`, data.length);
          
          try {
            const jsonData = JSON.parse(data);
            console.log(`✅ [External Test] ${endpoint} JSON parsed:`, jsonData);
          } catch (parseError) {
            console.log(`📄 [External Test] ${endpoint} Raw response (first 200 chars):`, data.substring(0, 200));
          }
          
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error(`💥 [External Test] ${endpoint} Error:`, {
          message: error.message,
          code: error.code
        });
        resolve();
      });

      req.setTimeout(10000, () => {
        console.error(`⏰ [External Test] ${endpoint} Timeout`);
        req.destroy();
        resolve();
      });

      req.end();
    });
  }
}

// Fonction pour tester localhost aussi
async function testLocalAPI() {
  console.log('\n🏠 [Local Test] Testing API from localhost...');
  
  const http = require('http');
  const hostname = 'localhost';
  const port = 5000;
  
  await new Promise((resolve) => {
    const options = {
      hostname,
      port,
      path: '/api/auth-test',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LocalAPITest/1.0'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`📨 [Local Test] Response:`, {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage
      });

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ [Local Test] JSON parsed:`, jsonData);
        } catch (parseError) {
          console.log(`📄 [Local Test] Raw response:`, data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`💥 [Local Test] Error:`, error.message);
      resolve();
    });

    req.setTimeout(5000, () => {
      console.error(`⏰ [Local Test] Timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

// Exécuter les tests
async function runAllTests() {
  console.log('🚀 [Test] Starting external API tests...\n');
  
  await testLocalAPI();
  await testExternalAPI();
  
  console.log('\n🏁 [Test] All tests completed');
}

runAllTests()
  .catch(error => console.error('💥 [Test] Tests failed:', error)); 