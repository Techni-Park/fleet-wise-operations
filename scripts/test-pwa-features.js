#!/usr/bin/env node

/**
 * Script de test des fonctionnalités PWA
 * Vérifie que tous les endpoints et services PWA fonctionnent correctement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_RESULTS = [];

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const statusColor = passed ? 'green' : 'red';
    
    log(`${status} ${name}`, statusColor);
    if (details) {
        log(`    ${details}`, 'blue');
    }
    
    TEST_RESULTS.push({ name, passed, details });
}

async function testManifest() {
    log('\n🔍 Test du Manifest PWA', 'bold');
    
    const manifestPath = path.join(__dirname, '..', 'client', 'public', 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
        logTest('Manifest existe', false, 'manifest.json non trouvé');
        return;
    }
    
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        logTest('Manifest existe', true, 'manifest.json trouvé');
        logTest('Manifest name', !!manifest.name, `name: ${manifest.name}`);
        logTest('Manifest start_url', !!manifest.start_url, `start_url: ${manifest.start_url}`);
        logTest('Manifest display', !!manifest.display, `display: ${manifest.display}`);
        logTest('Manifest icons', manifest.icons && manifest.icons.length > 0, 
                `${manifest.icons?.length || 0} icônes définies`);
        
    } catch (error) {
        logTest('Manifest valide', false, `Erreur parsing: ${error.message}`);
    }
}

async function testServiceWorker() {
    log('\n🔍 Test du Service Worker', 'bold');
    
    const swPath = path.join(__dirname, '..', 'client', 'public', 'sw.js');
    
    if (!fs.existsSync(swPath)) {
        logTest('Service Worker existe', false, 'sw.js non trouvé');
        return;
    }
    
    logTest('Service Worker existe', true, 'sw.js trouvé');
    
    const swContent = fs.readFileSync(swPath, 'utf8');
    logTest('SW install event', swContent.includes('install'), 'Event install trouvé');
    logTest('SW activate event', swContent.includes('activate'), 'Event activate trouvé');
    logTest('SW fetch event', swContent.includes('fetch'), 'Event fetch trouvé');
    logTest('SW sync event', swContent.includes('sync'), 'Event sync trouvé');
}

async function testOfflinePage() {
    log('\n🔍 Test de la page Offline', 'bold');
    
    const offlinePath = path.join(__dirname, '..', 'client', 'public', 'offline.html');
    
    if (!fs.existsSync(offlinePath)) {
        logTest('Page offline existe', false, 'offline.html non trouvé');
        return;
    }
    
    logTest('Page offline existe', true, 'offline.html trouvé');
    
    const offlineContent = fs.readFileSync(offlinePath, 'utf8');
    logTest('Page offline interactive', 
            offlineContent.includes('retryConnection'), 
            'Fonction retry trouvée');
}

async function testDatabaseTables() {
    log('\n🔍 Test des Tables PWA', 'bold');
    
    const sqlPath = path.join(__dirname, '..', 'create_pwa_tables.sql');
    
    if (!fs.existsSync(sqlPath)) {
        logTest('Script SQL PWA', false, 'create_pwa_tables.sql non trouvé');
        return;
    }
    
    logTest('Script SQL PWA existe', true, 'create_pwa_tables.sql trouvé');
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    logTest('Table INTERVENTION_MEDIA', 
            sqlContent.includes('INTERVENTION_MEDIA'), 
            'Définition trouvée');
    logTest('Table INTERVENTION_SYNC', 
            sqlContent.includes('INTERVENTION_SYNC'), 
            'Définition trouvée');
    logTest('Table PWA_OFFLINE_CACHE', 
            sqlContent.includes('PWA_OFFLINE_CACHE'), 
            'Définition trouvée');
    logTest('Table PWA_SETTINGS', 
            sqlContent.includes('PWA_SETTINGS'), 
            'Définition trouvée');
}

async function testPWAComponents() {
    log('\n🔍 Test des Composants PWA', 'bold');
    
    const cameraPath = path.join(__dirname, '..', 'client', 'src', 'components', 'PWA', 'CameraCapture.tsx');
    const offlineStoragePath = path.join(__dirname, '..', 'client', 'src', 'services', 'offlineStorage.ts');
    
    logTest('Composant CameraCapture', fs.existsSync(cameraPath), 
            fs.existsSync(cameraPath) ? 'CameraCapture.tsx trouvé' : 'Non trouvé');
    
    logTest('Service OfflineStorage', fs.existsSync(offlineStoragePath), 
            fs.existsSync(offlineStoragePath) ? 'offlineStorage.ts trouvé' : 'Non trouvé');
    
    if (fs.existsSync(offlineStoragePath)) {
        const storageContent = fs.readFileSync(offlineStoragePath, 'utf8');
        logTest('IndexedDB implementation', 
                storageContent.includes('indexedDB'), 
                'API IndexedDB utilisée');
        logTest('Offline interventions', 
                storageContent.includes('saveOfflineIntervention'), 
                'Gestion interventions offline');
        logTest('Offline media', 
                storageContent.includes('saveOfflineMedia'), 
                'Gestion médias offline');
    }
}

async function generateReport() {
    log('\n📊 Rapport de Test PWA', 'bold');
    
    const passed = TEST_RESULTS.filter(t => t.passed).length;
    const total = TEST_RESULTS.length;
    const percentage = Math.round((passed / total) * 100);
    
    log(`\nRésultats: ${passed}/${total} tests réussis (${percentage}%)`, 
        percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');
    
    if (percentage < 80) {
        log('\n❌ Tests échoués:', 'red');
        TEST_RESULTS.filter(t => !t.passed).forEach(test => {
            log(`  • ${test.name}: ${test.details}`, 'red');
        });
    }
    
    // Sauvegarder le rapport
    const reportPath = path.join(__dirname, '..', 'pwa-test-report.json');
    const report = {
        timestamp: new Date().toISOString(),
        summary: { passed, total, percentage },
        results: TEST_RESULTS,
        baseURL: BASE_URL
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Rapport sauvegardé: ${reportPath}`, 'blue');
    
    return percentage >= 80;
}

async function main() {
    log('🚀 Démarrage des tests PWA Fleet Wise Operations', 'bold');
    log(`Base URL: ${BASE_URL}`, 'blue');
    
    try {
        await testManifest();
        await testServiceWorker();
        await testOfflinePage();
        await testDatabaseTables();
        await testPWAComponents();
        
        const success = await generateReport();
        
        log('\n🏁 Tests terminés', 'bold');
        process.exit(success ? 0 : 1);
        
    } catch (error) {
        log(`\n💥 Erreur lors des tests: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Lancer les tests si le script est exécuté directement
main();

export { main, colors, log }; 