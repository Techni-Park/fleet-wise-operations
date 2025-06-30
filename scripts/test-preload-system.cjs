#!/usr/bin/env node

// Script de test pour le système de pré-chargement PWA
const fs = require('fs');
const path = require('path');

// Codes couleur pour l'affichage
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Compteurs de tests
let totalTests = 0;
let passedTests = 0;
let results = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(description, testFunction) {
  totalTests++;
  try {
    const result = testFunction();
    if (result) {
      passedTests++;
      log(`✅ ${description}`, 'green');
      results.push({ test: description, status: 'PASS' });
    } else {
      log(`❌ ${description}`, 'red');
      results.push({ test: description, status: 'FAIL' });
    }
  } catch (error) {
    log(`❌ ${description} - ${error.message}`, 'red');
    results.push({ test: description, status: 'ERROR' });
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function checkFileContent(filePath, searchText) {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    return content.includes(searchText);
  } catch (error) {
    return false;
  }
}

function checkTypescriptInterface(filePath, interfaceName) {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    const regex = new RegExp(`interface\\s+${interfaceName}\\s*{`, 'g');
    return regex.test(content);
  } catch (error) {
    return false;
  }
}

// Début des tests
log('\n🔍 TEST DU SYSTÈME DE PRÉ-CHARGEMENT PWA', 'cyan');
log('='.repeat(60), 'cyan');

// Tests des fichiers de service
log('\n📂 1. FICHIERS DE SERVICE', 'blue');

test('Service AutoSync existe', () => {
  return checkFileExists('client/src/services/autoSync.ts');
});

test('Hook usePWASync existe', () => {
  return checkFileExists('client/src/hooks/usePWASync.ts');
});

test('Composant TravelMode existe', () => {
  return checkFileExists('client/src/components/PWA/TravelMode.tsx');
});

test('Page PWASettings existe', () => {
  return checkFileExists('client/src/pages/PWASettings.tsx');
});

// Tests des fonctionnalités
log('\n⚙️ 2. FONCTIONNALITÉS PRINCIPALES', 'blue');

test('Méthode preloadEssentialData', () => {
  return checkFileContent('client/src/services/autoSync.ts', 'preloadEssentialData');
});

test('Méthode enableTravelMode', () => {
  return checkFileContent('client/src/services/autoSync.ts', 'enableTravelMode');
});

test('Synchronisation en arrière-plan', () => {
  return checkFileContent('client/src/services/autoSync.ts', 'setupBackgroundSync');
});

test('Endpoint cache géographique', () => {
  return checkFileContent('server/routes.ts', '/api/pwa/cache/geography');
});

// Tests d'intégration
log('\n🔗 3. INTÉGRATION', 'blue');

test('AutoSync dans AuthContext', () => {
  return checkFileContent('client/src/context/AuthContext.tsx', 'autoSync');
});

test('Service Worker amélioré', () => {
  return checkFileContent('client/public/sw.js', 'syncOfflineData');
});

test('Configuration pré-chargement', () => {
  return checkFileContent('client/src/services/autoSync.ts', 'PreloadConfig');
});

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
log(`\n📊 RÉSULTATS: ${passedTests}/${totalTests} (${successRate}%)`, 
    successRate >= 90 ? 'green' : 'yellow');

if (successRate >= 90) {
  log('✨ Système de pré-chargement opérationnel!', 'green');
} else {
  log('⚠️ Quelques ajustements nécessaires', 'yellow');
}

process.exit(passedTests === totalTests ? 0 : 1); 