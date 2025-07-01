const mysql = require('mysql2/promise');

// Configuration de test
const config = {
  host: '85.31.239.121',
  user: 'gestinter_admin', 
  password: 'Gestion@2019',
  database: 'gestinter_test'
};

async function testGeocodingLogic() {
  console.log('🗺️ Test de la logique de géolocalisation ADRESSEPOST');
  console.log('================================================\n');
  
  try {
    const connection = await mysql.createConnection(config);
    
    // Test de la requête avec les nouvelles jointures
    const query = `
      SELECT 
        i.IDINTERVENTION,
        i.LIB50,
        z83.IDADRLIEU,
        z83.ADRINTER,
        ap.IDADRESSEPOST,
        ap.ADRESSE1 as ADRESSEPOST_ADRESSE1,
        ap.ADRESSE2 as ADRESSEPOST_ADRESSE2,
        ap.VILLE as ADRESSEPOST_VILLE,
        ap.CPOSTAL as ADRESSEPOST_CPOSTAL,
        ap.LATITUDE as ADRESSEPOST_LATITUDE,
        ap.LONGITUDE as ADRESSEPOST_LONGITUDE,
        CASE 
          WHEN ap.LATITUDE IS NOT NULL AND ap.LONGITUDE IS NOT NULL AND ap.LATITUDE != 0 AND ap.LONGITUDE != 0 
          THEN ap.LATITUDE 
          ELSE NULL 
        END as latitude,
        CASE 
          WHEN ap.LATITUDE IS NOT NULL AND ap.LONGITUDE IS NOT NULL AND ap.LATITUDE != 0 AND ap.LONGITUDE != 0 
          THEN ap.LONGITUDE 
          ELSE NULL 
        END as longitude,
        CASE 
          WHEN ap.ADRESSE1 IS NOT NULL AND ap.ADRESSE1 != '' 
          THEN CONCAT(
            COALESCE(ap.ADRESSE1, ''),
            CASE WHEN ap.ADRESSE2 IS NOT NULL AND ap.ADRESSE2 != '' THEN CONCAT(', ', ap.ADRESSE2) ELSE '' END,
            CASE WHEN ap.VILLE IS NOT NULL AND ap.VILLE != '' THEN CONCAT(', ', ap.VILLE) ELSE '' END
          )
          ELSE z83.ADRINTER 
        END as ADRESSE_INTERVENTION_FULL
      FROM INTERVENTION i
      LEFT JOIN Z83_INTERVENTION z83 ON i.IDINTERVENTION = z83.IDINTERVENTION
      LEFT JOIN ADRESSEPOST ap ON z83.IDADRLIEU = ap.IDADRESSEPOST AND z83.IDADRLIEU IS NOT NULL AND z83.IDADRLIEU > 0
      ORDER BY i.IDINTERVENTION DESC
      LIMIT 5
    `;
    
    const [rows] = await connection.execute(query);
    
    console.log(`✅ Requête exécutée avec succès`);
    console.log(`📊 ${rows.length} interventions récupérées\n`);
    
    if (rows.length === 0) {
      console.log('⚠️ Aucune intervention trouvée');
      await connection.end();
      return;
    }
    
    let hasAdressePost = 0;
    let hasAdrinter = 0;
    let hasCoordinates = 0;
    
    rows.forEach((row, index) => {
      console.log(`${index + 1}. Intervention #${row.IDINTERVENTION}`);
      console.log(`   Titre: ${row.LIB50 || 'Sans titre'}`);
      
      if (row.IDADRESSEPOST) {
        console.log(`   ✅ ADRESSEPOST trouvée (ID: ${row.IDADRESSEPOST})`);
        console.log(`   📍 Adresse: ${row.ADRESSE_INTERVENTION_FULL || 'Non définie'}`);
        hasAdressePost++;
        
        if (row.latitude && row.longitude) {
          console.log(`   🌍 Coordonnées: ${row.latitude}, ${row.longitude}`);
          hasCoordinates++;
        } else {
          console.log(`   🌍 Coordonnées: Non disponibles`);
        }
      } else if (row.ADRINTER) {
        console.log(`   📝 ADRINTER: ${row.ADRINTER}`);
        console.log(`   🌍 Géocodage externe nécessaire`);
        hasAdrinter++;
      } else {
        console.log(`   ❌ Aucune adresse disponible`);
      }
      console.log('');
    });
    
    console.log('📈 Statistiques:');
    console.log(`   • Interventions avec ADRESSEPOST: ${hasAdressePost}/${rows.length}`);
    console.log(`   • Interventions avec ADRINTER: ${hasAdrinter}/${rows.length}`);
    console.log(`   • Interventions géolocalisées: ${hasCoordinates}/${rows.length}`);
    
    await connection.end();
    
    console.log('\n✨ Test terminé avec succès !');
    console.log('\n📋 Logique implémentée:');
    console.log('   1. Si IDADRLIEU existe → utiliser ADRESSEPOST');
    console.log('   2. Sinon → utiliser ADRINTER');
    console.log('   3. Coordonnées GPS depuis ADRESSEPOST.LATITUDE/LONGITUDE');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes("doesn't exist")) {
      console.log('\n💡 Solutions possibles:');
      console.log('   • Créer la table ADRESSEPOST: mysql < create_adressepost_table.sql');
      console.log('   • Vérifier que Z83_INTERVENTION existe');
    }
  }
}

testGeocodingLogic(); 