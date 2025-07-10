const mysql = require('mysql2/promise');

async function testParamAppli() {
  console.log('🔍 [Test] Testing PARAMAPPLI table directly...');
  
  let connection;
  try {
    // Configuration de la base de données (à adapter selon votre configuration)
    const dbConfig = {
      host: process.env.DB_HOST || '85.31.239.121',
      user: process.env.DB_USER || 'gestinter_test',
      password: process.env.DB_PASSWORD || 'nV4&gP8$xL2@mK9!',
      database: process.env.DB_NAME || 'gestinter_test',
      port: process.env.DB_PORT || 3306
    };
    
    console.log('📡 [Test] Connecting to database:', {
      host: dbConfig.host,
      database: dbConfig.database,
      user: dbConfig.user,
      port: dbConfig.port
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ [Test] Database connection established');
    
    // Tester si la table existe
    console.log('🔍 [Test] Checking if PARAMAPPLI table exists...');
    const [tableExists] = await connection.execute(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'PARAMAPPLI'",
      [dbConfig.database]
    );
    
    console.log('📊 [Test] Table existence check:', tableExists[0]);
    
    if (tableExists[0].count === 0) {
      console.log('❌ [Test] PARAMAPPLI table does not exist!');
      return;
    }
    
    // Compter les lignes dans la table
    console.log('📊 [Test] Counting rows in PARAMAPPLI...');
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM PARAMAPPLI');
    console.log('📊 [Test] Row count:', countResult[0]);
    
    // Si aucune ligne, proposer d'en créer une
    if (countResult[0].count === 0) {
      console.log('❌ [Test] PARAMAPPLI table is empty!');
      console.log('💡 [Test] Would you like to insert a default row? (This script will show what would be inserted)');
      
      const defaultParams = {
        RAISON_SOCIALE: 'FleetWise Operations',
        EMAIL: 'contact@fleetwise.com',
        ADRESSE: '123 Rue de la Flotte',
        VILLE: 'Paris',
        CPOSTAL: '75001',
        SIRET: '12345678901234',
        NUM_TVA: 'FR12345678901',
        CD_DEVISE: 'EUR',
        CD_LANG: 1,
        CODE_APE: '7022Z'
      };
      
      console.log('🔧 [Test] Default parameters that could be inserted:', defaultParams);
      console.log('📝 [Test] Run this SQL to insert default data:');
      console.log(`
INSERT INTO PARAMAPPLI (RAISON_SOCIALE, EMAIL, ADRESSE, VILLE, CPOSTAL, SIRET, NUM_TVA, CD_DEVISE, CD_LANG, CODE_APE, DHCRE, USCRE) 
VALUES ('${defaultParams.RAISON_SOCIALE}', '${defaultParams.EMAIL}', '${defaultParams.ADRESSE}', '${defaultParams.VILLE}', '${defaultParams.CPOSTAL}', '${defaultParams.SIRET}', '${defaultParams.NUM_TVA}', '${defaultParams.CD_DEVISE}', ${defaultParams.CD_LANG}, '${defaultParams.CODE_APE}', NOW(), 'SYS');
      `);
      
      return;
    }
    
    // Récupérer les données existantes
    console.log('📊 [Test] Fetching existing data...');
    const [rows] = await connection.execute('SELECT * FROM PARAMAPPLI LIMIT 1');
    
    if (rows.length > 0) {
      console.log('✅ [Test] PARAMAPPLI data found:');
      console.log('📋 [Test] Keys:', Object.keys(rows[0]));
      console.log('📊 [Test] Sample data:', {
        IDPARAMAPPLI: rows[0].IDPARAMAPPLI,
        RAISON_SOCIALE: rows[0].RAISON_SOCIALE,
        EMAIL: rows[0].EMAIL,
        ADRESSE: rows[0].ADRESSE,
        VILLE: rows[0].VILLE,
        CPOSTAL: rows[0].CPOSTAL,
        SIRET: rows[0].SIRET,
        NUM_TVA: rows[0].NUM_TVA,
        CD_DEVISE: rows[0].CD_DEVISE,
        CD_LANG: rows[0].CD_LANG
      });
      console.log('📊 [Test] Full first row:', rows[0]);
    } else {
      console.log('❌ [Test] No data found in PARAMAPPLI table');
    }
    
  } catch (error) {
    console.error('💥 [Test] Error testing PARAMAPPLI:', error);
    console.error('📋 [Test] Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 [Test] Database connection closed');
    }
  }
}

// Exécuter le test
testParamAppli()
  .then(() => console.log('🏁 [Test] Test completed'))
  .catch(error => console.error('💥 [Test] Test failed:', error)); 