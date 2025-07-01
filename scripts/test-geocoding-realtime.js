import fetch from 'node-fetch';
import fs from 'fs';

/**
 * Test du géocodage en temps réel
 * Vérifie que l'API OpenStreetMap répond correctement
 */

async function testGeocodingAPI() {
  console.log('🗺️  Test du géocodage en temps réel - Fleet Wise Operations');
  console.log('=' .repeat(60));

  const testAddresses = [
    'Place de la République, Paris',
    '123 Rue de Rivoli, Paris',
    'Champs-Élysées, Paris',
    'Avenue des Champs-Élysées 75008 Paris',
    'Tour Eiffel, Paris',
    '10 Downing Street, London'
  ];

  let successCount = 0;
  let totalTests = testAddresses.length;

  for (const [index, address] of testAddresses.entries()) {
    try {
      console.log(`\n📍 Test ${index + 1}/${totalTests}: "${address}"`);
      
      // Simulation de l'appel API comme dans le composant AddressInput
      const params = new URLSearchParams({
        q: address,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: 'fr',
        'accept-language': 'fr'
      });

      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: {
          'User-Agent': 'Fleet-Wise-Operations-Test/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const results = await response.json();
      
      if (results.length > 0) {
        const firstResult = results[0];
        console.log(`   ✅ Succès: ${results.length} résultat(s) trouvé(s)`);
        console.log(`   📊 Premier résultat:`);
        console.log(`      - Adresse: ${firstResult.display_name}`);
        console.log(`      - Coordonnées: ${firstResult.lat}, ${firstResult.lon}`);
        
        if (firstResult.address) {
          console.log(`      - Détails: ${firstResult.address.road || 'N/A'}, ${firstResult.address.city || 'N/A'}`);
        }
        
        successCount++;
      } else {
        console.log(`   ❌ Aucun résultat trouvé`);
      }

      // Délai pour respecter les limites de l'API (comme dans le composant)
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log(`📊 Résultats du test de géocodage:`);
  console.log(`   • Succès: ${successCount}/${totalTests}`);
  console.log(`   • Taux de réussite: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log(`   🎉 Tous les tests de géocodage ont réussi !`);
  } else if (successCount > totalTests / 2) {
    console.log(`   ⚠️  La plupart des tests ont réussi, mais quelques problèmes détectés`);
  } else {
    console.log(`   🚨 Problèmes majeurs détectés avec l'API de géocodage`);
  }

  return {
    success: successCount === totalTests,
    passed: successCount,
    total: totalTests,
    percentage: (successCount / totalTests) * 100
  };
}

async function testComponentIntegration() {
  console.log('\n🔧 Test d\'intégration du composant AddressInput');
  console.log('-' .repeat(40));

  const tests = [
    {
      name: 'Composant AddressInput existe',
      check: () => {
        return fs.existsSync('client/src/components/ui/address-input.tsx');
      }
    },
    {
      name: 'CreateIntervention utilise AddressInput',
      check: () => {
        const content = fs.readFileSync('client/src/pages/CreateIntervention.tsx', 'utf8');
        return content.includes('AddressInput') && content.includes('handleAddressChange');
      }
    },
    {
      name: 'EditIntervention utilise AddressInput',
      check: () => {
        const content = fs.readFileSync('client/src/pages/EditIntervention.tsx', 'utf8');
        return content.includes('AddressInput') && content.includes('handleAddressChange');
      }
    },
    {
      name: 'Champs d\'adresse dans le formData',
      check: () => {
        const createContent = fs.readFileSync('client/src/pages/CreateIntervention.tsx', 'utf8');
        const editContent = fs.readFileSync('client/src/pages/EditIntervention.tsx', 'utf8');
        return createContent.includes('ADRESSE_INTERVENTION') && 
               createContent.includes('COORDS_LAT') &&
               editContent.includes('ADRESSE_INTERVENTION') && 
               editContent.includes('COORDS_LAT');
      }
    }
  ];

  let passedTests = 0;
  for (const test of tests) {
    try {
      const result = test.check();
      console.log(`   ${result ? '✅' : '❌'} ${test.name}`);
      if (result) passedTests++;
    } catch (error) {
      console.log(`   ❌ ${test.name} - Erreur: ${error.message}`);
    }
  }

  console.log(`\n📊 Tests d'intégration: ${passedTests}/${tests.length} (${((passedTests / tests.length) * 100).toFixed(1)}%)`);
  
  return {
    success: passedTests === tests.length,
    passed: passedTests,
    total: tests.length
  };
}

async function main() {
  try {
    console.log('🚀 Test complet du géocodage en temps réel');
    console.log('Démarrage des tests...\n');

    // Test de l'API de géocodage
    const geocodingResults = await testGeocodingAPI();
    
    // Test d'intégration des composants
    const integrationResults = await testComponentIntegration();

    // Résumé global
    console.log('\n' + '=' .repeat(60));
    console.log('📋 RÉSUMÉ GLOBAL');
    console.log('=' .repeat(60));
    console.log(`🗺️  API Géocodage: ${geocodingResults.passed}/${geocodingResults.total} (${geocodingResults.percentage.toFixed(1)}%)`);
    console.log(`🔧 Intégration: ${integrationResults.passed}/${integrationResults.total} (${((integrationResults.passed / integrationResults.total) * 100).toFixed(1)}%)`);
    
    const overallSuccess = geocodingResults.success && integrationResults.success;
    console.log(`\n🎯 État global: ${overallSuccess ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    if (overallSuccess) {
      console.log('\n🎉 Le géocodage en temps réel est prêt à l\'utilisation !');
      console.log('📝 Fonctionnalités disponibles:');
      console.log('   • Auto-complétion d\'adresses avec OpenStreetMap');
      console.log('   • Géocodage automatique avec coordonnées GPS');
      console.log('   • Intégration dans CreateIntervention et EditIntervention');
      console.log('   • Debounce et limitation des requêtes API');
      console.log('   • Interface utilisateur responsive et intuitive');
    } else {
      console.log('\n⚠️  Des problèmes ont été détectés. Vérifiez les logs ci-dessus.');
    }

    return overallSuccess;

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    return false;
  }
}

// Exécution si appelé directement
main().then(success => {
  process.exit(success ? 0 : 1);
});

export { testGeocodingAPI, testComponentIntegration }; 