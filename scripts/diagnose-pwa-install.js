#!/usr/bin/env node

/**
 * 🔧 DIAGNOSTIC PWA INSTALLATION
 * Script spécialisé pour diagnostiquer pourquoi l'icône d'installation PWA n'apparaît pas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LOCALHOST_URL = 'http://localhost:5173'; // Dev server
const PROD_URL = 'http://localhost:5000';      // Production server
let currentURL = LOCALHOST_URL;

// Colors
const c = {
    red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', 
    blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m',
    bold: '\x1b[1m', reset: '\x1b[0m'
};

function log(msg, color = 'white') {
    console.log(`${c[color]}${msg}${c.reset}`);
}

function header(title) {
    console.log('\n' + '='.repeat(60));
    log(`🔧 ${title}`, 'bold');
    console.log('='.repeat(60));
}

function test(name, condition, successMsg, failMsg, fix = '') {
    const icon = condition ? '✅' : '❌';
    const color = condition ? 'green' : 'red';
    const msg = condition ? successMsg : failMsg;
    
    log(`${icon} ${name}: ${msg}`, color);
    if (!condition && fix) {
        log(`   💡 Solution: ${fix}`, 'cyan');
    }
    return condition;
}

// 1. TEST HTTPS CRITIQUE
async function testHTTPS() {
    header('TEST HTTPS (CRITIQUE POUR PWA)');
    
    const isHTTPS = currentURL.startsWith('https://');
    const isLocalhost = currentURL.includes('localhost') || currentURL.includes('127.0.0.1');
    
    if (isHTTPS) {
        test('HTTPS', true, 'Activé - Installation PWA possible', '');
        return true;
    } else if (isLocalhost) {
        test('HTTPS', true, 'Désactivé mais localhost OK', '', 
             'Pour test production: npx ngrok http 5173');
        return true;
    } else {
        test('HTTPS', false, '', 'REQUIS pour PWA en production!',
             'Utilisez: npx ngrok http 5173');
        return false;
    }
}

// 2. TEST FICHIERS PWA ESSENTIELS
async function testPWAFiles() {
    header('TEST FICHIERS PWA');
    
    const files = [
        { path: 'client/public/manifest.json', name: 'Manifest PWA' },
        { path: 'client/public/sw.js', name: 'Service Worker' },
        { path: 'client/public/offline.html', name: 'Page Offline' },
        { path: 'client/index.html', name: 'HTML principal' }
    ];
    
    let allExist = true;
    
    for (const file of files) {
        const fullPath = path.join(__dirname, '..', file.path);
        const exists = fs.existsSync(fullPath);
        test(file.name, exists, 'Trouvé', 'Manquant', 
             `Créer le fichier: ${file.path}`);
        if (!exists) allExist = false;
    }
    
    return allExist;
}

// 3. TEST MANIFEST PWA
async function testManifest() {
    header('TEST MANIFEST PWA (CRITÈRES INSTALLATION)');
    
    const manifestPath = path.join(__dirname, '..', 'client', 'public', 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
        test('Manifest', false, '', 'Fichier manifest.json manquant');
        return false;
    }
    
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        const hasName = manifest.name && manifest.name.length > 0;
        const hasShortName = manifest.short_name && manifest.short_name.length > 0;
        const hasStartUrl = manifest.start_url;
        const hasDisplay = manifest.display === 'standalone';
        const hasIcons = manifest.icons && manifest.icons.length > 0;
        const has192Icon = manifest.icons?.some(icon => icon.sizes.includes('192'));
        const has512Icon = manifest.icons?.some(icon => icon.sizes.includes('512'));
        const hasThemeColor = manifest.theme_color;
        
        test('Nom application', hasName, manifest.name, 'Nom manquant');
        test('Nom court', hasShortName, manifest.short_name, 'Nom court manquant');
        test('URL de démarrage', hasStartUrl, manifest.start_url, 'start_url manquant');
        test('Mode standalone', hasDisplay, 'standalone', `Mode: ${manifest.display}`,
             'Changer display en "standalone"');
        test('Icônes définies', hasIcons, `${manifest.icons?.length} icônes`, 'Aucune icône');
        test('Icône 192px', has192Icon, 'Présente', 'Manquante', 'Requis pour installation');
        test('Icône 512px', has512Icon, 'Présente', 'Manquante', 'Requis pour installation');
        test('Couleur thème', hasThemeColor, manifest.theme_color, 'Couleur manquante');
        
        return hasName && hasStartUrl && hasDisplay && has192Icon && has512Icon;
        
    } catch (error) {
        test('Manifest valide', false, '', `Erreur JSON: ${error.message}`,
             'Vérifier la syntaxe JSON');
        return false;
    }
}

// 4. TEST ICÔNES PWA
async function testIcons() {
    header('TEST ICÔNES PWA');
    
    const iconSizes = ['72', '96', '128', '144', '152', '192', '384', '512'];
    const iconsDir = path.join(__dirname, '..', 'client', 'public', 'icons');
    
    if (!fs.existsSync(iconsDir)) {
        test('Dossier icônes', false, '', 'Dossier /icons manquant',
             'Créer: npm run pwa:create-icons');
        return false;
    }
    
    let existingIcons = 0;
    const criticalSizes = ['192', '512']; // Requis pour PWA
    let criticalOK = 0;
    
    for (const size of iconSizes) {
        const iconPath = path.join(iconsDir, `icon-${size}.png`);
        const exists = fs.existsSync(iconPath);
        const isCritical = criticalSizes.includes(size);
        
        test(`Icône ${size}px${isCritical ? ' (REQUIS)' : ''}`, exists, 
             'Présente', 'Manquante', 
             isCritical ? 'CRITIQUE pour installation PWA' : '');
        
        if (exists) {
            existingIcons++;
            if (isCritical) criticalOK++;
        }
    }
    
    log(`\n📊 Bilan icônes: ${existingIcons}/${iconSizes.length} présentes`, 
        existingIcons >= 6 ? 'green' : 'yellow');
    log(`📊 Icônes critiques: ${criticalOK}/2 (192px + 512px requis)`, 
        criticalOK === 2 ? 'green' : 'red');
    
    return criticalOK === 2; // Les 2 icônes critiques doivent être présentes
}

// 5. TEST SERVICE WORKER
async function testServiceWorker() {
    header('TEST SERVICE WORKER');
    
    const swPath = path.join(__dirname, '..', 'client', 'public', 'sw.js');
    
    if (!fs.existsSync(swPath)) {
        test('Service Worker', false, '', 'Fichier sw.js manquant');
        return false;
    }
    
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    const hasInstall = swContent.includes('install');
    const hasActivate = swContent.includes('activate');
    const hasFetch = swContent.includes('fetch');
    const hasCache = swContent.includes('cache');
    const hasAuthExclusion = swContent.includes('AUTH_URLS');
    
    test('Événement install', hasInstall, 'Trouvé', 'Manquant');
    test('Événement activate', hasActivate, 'Trouvé', 'Manquant');
    test('Événement fetch', hasFetch, 'Trouvé', 'Manquant');
    test('Gestion cache', hasCache, 'Trouvé', 'Manquant');
    test('Exclusion auth', hasAuthExclusion, 'Authentification exclue du cache', 
         'Auth peut être mise en cache', 'Important pour éviter problèmes de connexion');
    
    return hasInstall && hasActivate && hasFetch;
}

// 6. TEST HTML PWA
async function testHTML() {
    header('TEST HTML PWA');
    
    const htmlPath = path.join(__dirname, '..', 'client', 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
        test('HTML principal', false, '', 'index.html manquant');
        return false;
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    const hasManifestLink = htmlContent.includes('manifest.json');
    const hasViewport = htmlContent.includes('viewport');
    const hasThemeColor = htmlContent.includes('theme-color');
    const hasAppleMeta = htmlContent.includes('apple-mobile-web-app');
    
    test('Lien manifest', hasManifestLink, 'Trouvé', 'Manquant',
         'Ajouter: <link rel="manifest" href="/manifest.json">');
    test('Meta viewport', hasViewport, 'Trouvé', 'Manquant');
    test('Meta theme-color', hasThemeColor, 'Trouvé', 'Manquant');
    test('Meta Apple PWA', hasAppleMeta, 'Trouvé', 'Manquant (optionnel pour iOS)');
    
    return hasManifestLink && hasViewport && hasThemeColor;
}

// 7. RÉSUMÉ ET DIAGNOSTIC
async function generateDiagnosis() {
    header('DIAGNOSTIC FINAL');
    
    log('🎯 PROBLÈME: Icône d\'installation PWA invisible', 'yellow');
    log('\n📋 SOLUTIONS PAR ORDRE DE PRIORITÉ:', 'bold');
    
    // Solutions basées sur les tests
    const solutions = [
        {
            condition: !currentURL.startsWith('https://') && !currentURL.includes('localhost'),
            priority: '🚨 CRITIQUE',
            action: 'ACTIVER HTTPS',
            command: 'npx ngrok http 5173',
            explanation: 'PWA nécessite HTTPS en production'
        },
        {
            condition: true, // Toujours proposer
            priority: '⚡ RAPIDE',
            action: 'TEST RAPIDE NGROK',
            command: '1. npm run dev\n   2. npx ngrok http 5173\n   3. Ouvrir URL https://xxx.ngrok.io',
            explanation: 'Test immédiat avec HTTPS'
        },
        {
            condition: true,
            priority: '🔧 MAINTENANCE',
            action: 'VIDER CACHE NAVIGATEUR',
            command: 'Chrome: F12 → Application → Clear storage',
            explanation: 'Cache peut empêcher détection PWA'
        },
        {
            condition: true,
            priority: '🧪 VALIDATION',
            action: 'AUDIT LIGHTHOUSE',
            command: 'F12 → Lighthouse → Progressive Web App',
            explanation: 'Diagnostic détaillé des critères PWA'
        }
    ];
    
    solutions.forEach((solution, index) => {
        if (solution.condition) {
            log(`\n${index + 1}. ${solution.priority} ${solution.action}`, 'cyan');
            log(`   💻 ${solution.command}`, 'white');
            log(`   📝 ${solution.explanation}`, 'blue');
        }
    });
    
    log('\n🔍 CHECKLIST NAVIGATEUR:', 'bold');
    log('✓ Chrome/Edge: Icône ⊕ barre d\'adresse ou Menu → "Installer"', 'green');
    log('✓ Firefox: Menu → "Installer cette application"', 'green');
    log('✓ Safari iOS: Partager → "Sur l\'écran d\'accueil"', 'green');
    
    log('\n📚 RESSOURCES:', 'bold');
    log('• Guide complet: DIAGNOSTIC-PWA-INSTALLATION.md', 'blue');
    log('• Tests PWA: npm run pwa:test', 'blue');
    log('• DevTools: F12 → Application → Manifest', 'blue');
}

// MAIN FUNCTION
async function main() {
    console.clear();
    log('🚀 DIAGNOSTIC PWA INSTALLATION - Fleet Wise Operations', 'bold');
    log(`📱 URL testée: ${currentURL}`, 'blue');
    
    const results = {
        https: await testHTTPS(),
        files: await testPWAFiles(),
        manifest: await testManifest(),
        icons: await testIcons(),
        serviceWorker: await testServiceWorker(),
        html: await testHTML()
    };
    
    const criticalTests = [results.https, results.manifest, results.icons, results.serviceWorker];
    const criticalPassed = criticalTests.filter(Boolean).length;
    const allPassed = Object.values(results).filter(Boolean).length;
    
    console.log('\n' + '='.repeat(60));
    log(`📊 RÉSULTAT: ${allPassed}/6 tests réussis`, allPassed === 6 ? 'green' : 'yellow');
    log(`🔑 CRITIQUES PWA: ${criticalPassed}/4 réussis`, criticalPassed === 4 ? 'green' : 'red');
    
    if (criticalPassed === 4) {
        log('\n🎉 PWA TECHNIQUEMENT PRÊTE!', 'green');
        log('   Si l\'icône n\'apparaît pas → Problème HTTPS probable', 'yellow');
    } else {
        log('\n⚠️  PWA NON INSTALLABLE', 'red');
        log('   Résoudre les problèmes critiques ci-dessus', 'yellow');
    }
    
    await generateDiagnosis();
    
    // Sauvegarder rapport
    const report = {
        timestamp: new Date().toISOString(),
        url: currentURL,
        results,
        summary: { total: 6, passed: allPassed, critical: criticalPassed },
        pwaInstallable: criticalPassed === 4
    };
    
    const reportPath = path.join(__dirname, '..', 'pwa-install-diagnosis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n💾 Rapport détaillé: pwa-install-diagnosis.json`, 'blue');
}

// Détecter l'environnement et lancer
if (process.argv.includes('--prod')) {
    currentURL = PROD_URL;
}

main().catch(console.error); 