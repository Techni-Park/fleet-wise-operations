#!/usr/bin/env node

// Script de test du mode hors ligne pour Fleet Wise Operations PWA
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔌 TEST MODE HORS LIGNE - Fleet Wise Operations PWA');
console.log('='.repeat(60));

// Test 1: Vérification de la page offline
function testOfflinePage() {
  console.log('\n📄 Test 1: Page Offline');
  
  const offlinePagePath = join(__dirname, 'client', 'public', 'offline.html');
  
  if (fs.existsSync(offlinePagePath)) {
    const content = fs.readFileSync(offlinePagePath, 'utf8');
    const hasTitle = content.includes('Fleet Wise Operations');
    const hasMessage = content.includes('hors ligne');
    const hasRetry = content.includes('Réessayer');
    
    console.log('  ✅ Page offline.html existe');
    console.log(`  ${hasTitle ? '✅' : '❌'} Titre Fleet Wise présent`);
    console.log(`  ${hasMessage ? '✅' : '❌'} Message hors ligne présent`);
    console.log(`  ${hasRetry ? '✅' : '❌'} Bouton réessayer présent`);
  } else {
    console.log('  ❌ Page offline.html manquante');
  }
}

// Test 2: Vérification du Service Worker
function testServiceWorker() {
  console.log('\n⚙️ Test 2: Service Worker');
  
  const swPath = join(__dirname, 'client', 'public', 'sw.js');
  
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf8');
    const hasOfflineHandler = content.includes('handleStaticRequest');
    const hasAuthExclusion = content.includes('AUTH_URLS');
    const hasCacheStrategy = content.includes('CACHE_NAME');
    const hasCredentials = content.includes('credentials: \'include\'');
    
    console.log('  ✅ Service Worker sw.js existe');
    console.log(`  ${hasOfflineHandler ? '✅' : '❌'} Gestionnaire offline présent`);
    console.log(`  ${hasAuthExclusion ? '✅' : '❌'} Exclusion URLs auth présente`);
    console.log(`  ${hasCacheStrategy ? '✅' : '❌'} Stratégie de cache définie`);
    console.log(`  ${hasCredentials ? '✅' : '❌'} Gestion credentials configurée`);
  } else {
    console.log('  ❌ Service Worker sw.js manquant');
  }
}

// Test 3: Vérification du stockage offline
function testOfflineStorage() {
  console.log('\n💾 Test 3: Stockage Offline');
  
  const storagePath = join(__dirname, 'client', 'src', 'services', 'offlineStorage.ts');
  
  if (fs.existsSync(storagePath)) {
    const content = fs.readFileSync(storagePath, 'utf8');
    const hasIndexedDB = content.includes('indexedDB');
    const hasInterventions = content.includes('interventions');
    const hasSync = content.includes('sync');
    const hasMedia = content.includes('media');
    
    console.log('  ✅ Service offlineStorage.ts existe');
    console.log(`  ${hasIndexedDB ? '✅' : '❌'} IndexedDB configuré`);
    console.log(`  ${hasInterventions ? '✅' : '❌'} Stockage interventions disponible`);
    console.log(`  ${hasSync ? '✅' : '❌'} Mécanisme de synchronisation présent`);
    console.log(`  ${hasMedia ? '✅' : '❌'} Stockage média configuré`);
  } else {
    console.log('  ❌ Service offlineStorage.ts manquant');
  }
}

// Test 4: Instructions de test manuel
function showManualTestInstructions() {
  console.log('\n📋 Instructions de Test Manuel');
  console.log('-'.repeat(40));
  
  console.log(`
🌐 Test Navigation Offline:
   1. Ouvrir Chrome/Edge sur http://localhost:5000
   2. Se connecter (dev@techni-park.com / DEV)
   3. F12 → Application → Service Workers → ☑️ Offline
   4. Naviguer dans l'app → Doit afficher la page offline.html

📱 Test PWA Installée:
   1. Installer la PWA (icône dans la barre d'adresse)
   2. Ouvrir l'app installée
   3. Désactiver WiFi/Ethernet sur l'ordinateur
   4. Utiliser l'app → Doit fonctionner en mode dégradé

🔐 Test Authentification Offline:
   1. Mode hors ligne activé (DevTools)
   2. Tenter de se connecter
   3. Vérifier message: "Connexion internet requise"

💾 Test Cache Données:
   1. Se connecter et naviguer (mode online)
   2. Passer en mode offline
   3. Recharger la page → Données en cache doivent s'afficher

📸 Test Capture Hors Ligne:
   1. Mode offline
   2. Prendre une photo d'intervention
   3. Vérifier stockage local IndexedDB
   4. Repasser online → Sync automatique
`);
}

// Test 5: Vérification des endpoints PWA
function testPWAEndpoints() {
  console.log('\n🔌 Test 5: Endpoints PWA');
  console.log('   Pour tester les endpoints en mode offline:');
  console.log('   1. npm start (mode online)');
  console.log('   2. Tester: curl http://localhost:5000/api/pwa/test');
  console.log('   3. DevTools → Network → Offline');
  console.log('   4. Tester à nouveau → Doit utiliser le cache');
}

// Exécution des tests
async function runTests() {
  try {
    testOfflinePage();
    testServiceWorker();
    testOfflineStorage();
    testPWAEndpoints();
    showManualTestInstructions();
    
    console.log('\n🎯 Résumé:');
    console.log('   ✅ Tests automatiques terminés');
    console.log('   📋 Suivez les instructions de test manuel ci-dessus');
    console.log('   🔧 Utilisez DevTools pour simuler le mode offline');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

runTests(); 