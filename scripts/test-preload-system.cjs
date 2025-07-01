#!/usr/bin/env node

// Script de test pour le système de pré-chargement PWA
const fs = require('fs');
const path = require('path');

// Couleurs pour l'affichage console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}🧪 Test du Système de Pré-chargement PWA${colors.reset}\n`);

const tests = [
  // Services
  { name: 'Service AutoSync', path: 'client/src/services/autoSync.ts' },
  { name: 'Service OfflineStorage', path: 'client/src/services/offlineStorage.ts' },
  
  // Hooks
  { name: 'Hook usePWASync', path: 'client/src/hooks/usePWASync.ts' },
  
  // Composants PWA
  { name: 'Composant TravelMode', path: 'client/src/components/PWA/TravelMode.tsx' },
  { name: 'Composant PWAStatusIndicator', path: 'client/src/components/PWA/PWAStatusIndicator.tsx' },
  { name: 'Composant CameraCapture', path: 'client/src/components/PWA/CameraCapture.tsx' },
  
  // Pages
  { name: 'Page PWASettings', path: 'client/src/pages/PWASettings.tsx' },
  
  // Backend
  { name: 'Endpoints PWA (routes.ts)', path: 'server/routes.ts', content: ['/api/pwa/cache', '/api/pwa/sync', '/api/pwa/test'] },
  
  // Service Worker
  { name: 'Service Worker PWA', path: 'client/public/sw.js', content: ['syncOfflineData', 'IndexedDB', 'handleAuthRequest'] },
  
  // Configuration
  { name: 'AuthContext amélioré', path: 'client/src/context/AuthContext.tsx', content: ['preloadResults', 'performPreload'] },
  
  // SQL PWA
  { name: 'Tables PWA SQL', path: 'create_pwa_tables.sql', content: ['PWA_OFFLINE_CACHE', 'INTERVENTION_SYNC'] }
];

let passed = 0;
let failed = 0;

function testFile(test) {
  try {
    if (!fs.existsSync(test.path)) {
      console.log(`${colors.red}❌ ${test.name}${colors.reset} - Fichier manquant: ${test.path}`);
      failed++;
      return false;
    }
    
    if (test.content) {
      const content = fs.readFileSync(test.path, 'utf8');
      const missingItems = test.content.filter(item => !content.includes(item));
      
      if (missingItems.length > 0) {
        console.log(`${colors.yellow}⚠️  ${test.name}${colors.reset} - Contenu manquant: ${missingItems.join(', ')}`);
        failed++;
        return false;
      }
    }
    
    console.log(`${colors.green}✅ ${test.name}${colors.reset}`);
    passed++;
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ ${test.name}${colors.reset} - Erreur: ${error.message}`);
    failed++;
    return false;
  }
}

// Exécution des tests
tests.forEach(test => testFile(test));

// Tests spéciaux pour la navigation et le routeur
console.log('\n' + colors.bold + '🔍 Tests d\'intégration:' + colors.reset);

// Test navigation
  try {
  const navContent = fs.readFileSync('client/src/components/Layout/Navigation.tsx', 'utf8');
  if (navContent.includes('PWA Settings') && navContent.includes('/pwa-settings')) {
    console.log(`${colors.green}✅ Navigation PWA Settings${colors.reset}`);
    passed++;
  } else {
    console.log(`${colors.red}❌ Navigation PWA Settings${colors.reset} - Lien manquant`);
    failed++;
  }
  } catch (error) {
  console.log(`${colors.red}❌ Navigation PWA Settings${colors.reset} - Erreur: ${error.message}`);
  failed++;
}

// Test en-tête
try {
  const headerContent = fs.readFileSync('client/src/components/Layout/Header.tsx', 'utf8');
  if (headerContent.includes('PWAStatusIndicator')) {
    console.log(`${colors.green}✅ Header PWA Indicator${colors.reset}`);
    passed++;
  } else {
    console.log(`${colors.red}❌ Header PWA Indicator${colors.reset} - Indicateur manquant`);
    failed++;
  }
} catch (error) {
  console.log(`${colors.red}❌ Header PWA Indicator${colors.reset} - Erreur: ${error.message}`);
  failed++;
}

// Test routeur
try {
  const appContent = fs.readFileSync('client/src/App.tsx', 'utf8');
  if (appContent.includes('PWASettings') && appContent.includes('/pwa-settings')) {
    console.log(`${colors.green}✅ Route PWA Settings${colors.reset}`);
    passed++;
  } else {
    console.log(`${colors.red}❌ Route PWA Settings${colors.reset} - Route manquante`);
    failed++;
  }
} catch (error) {
  console.log(`${colors.red}❌ Route PWA Settings${colors.reset} - Erreur: ${error.message}`);
  failed++;
}

// Résultats finaux
const total = passed + failed;
const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

console.log('\n' + colors.bold + '📊 Résultats des tests:' + colors.reset);
console.log(`Total: ${total} tests`);
console.log(`${colors.green}Réussis: ${passed}${colors.reset}`);
console.log(`${colors.red}Échoués: ${failed}${colors.reset}`);
console.log(`Pourcentage: ${percentage}%`);

if (passed === total) {
  console.log(`\n${colors.green}${colors.bold}🎉 Tous les tests sont passés ! Votre système de pré-chargement PWA est prêt !${colors.reset}`);
  console.log(`\n${colors.blue}Prochaines étapes:${colors.reset}`);
  console.log(`1. ${colors.yellow}npm run dev${colors.reset} - Démarrer l'application`);
  console.log(`2. Se connecter et observer le pré-chargement automatique`);
  console.log(`3. Tester le mode voyage dans PWA Settings`);
  console.log(`4. Valider le fonctionnement hors ligne`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}${colors.bold}❌ ${failed} test(s) échoué(s). Veuillez corriger les problèmes avant de continuer.${colors.reset}`);
  process.exit(1);
}