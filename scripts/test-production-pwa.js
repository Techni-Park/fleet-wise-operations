#!/usr/bin/env node

/**
 * 🌐 TEST PWA EN PRODUCTION
 * Script pour tester https://fleet.voluntis.space/
 */

import https from 'https';
import fs from 'fs';

const PROD_URL = 'https://fleet.voluntis.space';

// Colors
const c = {
    red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', 
    blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m',
    bold: '\x1b[1m', reset: '\x1b[0m'
};

function log(msg, color = 'white') {
    console.log(`${c[color]}${msg}${c.reset}`);
}

function test(name, condition, successMsg, failMsg, fix = '') {
    const icon = condition ? '✅' : '❌';
    const color = condition ? 'green' : 'red';
    const msg = condition ? successMsg : failMsg;
    
    log(`${icon} ${name}: ${msg}`, color);
    if (!condition && fix) {
        log(`   💡 ${fix}`, 'cyan');
    }
    return condition;
}

// Fonction pour faire une requête HTTPS
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ 
                statusCode: res.statusCode, 
                headers: res.headers, 
                data 
            }));
        }).on('error', reject);
    });
}

// Test 1: Site accessible
async function testSiteAccess() {
    log('\n🌐 TEST ACCÈS SITE HTTPS', 'bold');
    
    try {
        const response = await makeRequest(PROD_URL);
        const accessible = response.statusCode === 200;
        
        test('Site accessible', accessible, 
             `Code ${response.statusCode}`, 
             `Erreur ${response.statusCode}`,
             'Vérifier le serveur et la configuration'
        );
        
        const hasHTML = response.data.includes('<!DOCTYPE html>');
        test('Contenu HTML', hasHTML, 'HTML détecté', 'Pas de HTML valide');
        
        return accessible && hasHTML;
    } catch (error) {
        test('Site accessible', false, '', `Erreur connexion: ${error.message}`);
        return false;
    }
}

// Test 2: Manifest PWA
async function testManifest() {
    log('\n📱 TEST MANIFEST PWA', 'bold');
    
    try {
        const response = await makeRequest(`${PROD_URL}/manifest.json`);
        const accessible = response.statusCode === 200;
        
        test('Manifest accessible', accessible, 
             'Trouvé via /manifest.json', 
             `Erreur ${response.statusCode}`,
             'Le manifest.json doit être accessible publiquement'
        );
        
        if (accessible) {
            try {
                const manifest = JSON.parse(response.data);
                
                const hasName = manifest.name && manifest.name.length > 0;
                const hasStartUrl = manifest.start_url;
                const hasDisplay = manifest.display === 'standalone';
                const hasIcons = manifest.icons && manifest.icons.length > 0;
                const has192Icon = manifest.icons?.some(icon => icon.sizes?.includes('192'));
                const has512Icon = manifest.icons?.some(icon => icon.sizes?.includes('512'));
                
                test('Nom app', hasName, manifest.name, 'Nom manquant');
                test('Start URL', hasStartUrl, manifest.start_url, 'start_url manquant');
                test('Mode standalone', hasDisplay, 'standalone', `Mode: ${manifest.display}`);
                test('Icônes définies', hasIcons, `${manifest.icons?.length} icônes`, 'Pas d\'icônes');
                test('Icône 192px', has192Icon, 'Présente', 'MANQUANTE - Requis PWA');
                test('Icône 512px', has512Icon, 'Présente', 'MANQUANTE - Requis PWA');
                
                return hasName && hasStartUrl && hasDisplay && has192Icon && has512Icon;
            } catch (error) {
                test('Manifest valide', false, '', `JSON invalide: ${error.message}`);
                return false;
            }
        }
        return false;
    } catch (error) {
        test('Manifest accessible', false, '', `Erreur: ${error.message}`);
        return false;
    }
}

// Test 3: Service Worker
async function testServiceWorker() {
    log('\n⚙️ TEST SERVICE WORKER', 'bold');
    
    try {
        const response = await makeRequest(`${PROD_URL}/sw.js`);
        const accessible = response.statusCode === 200;
        
        test('Service Worker accessible', accessible, 
             'Trouvé via /sw.js', 
             `Erreur ${response.statusCode}`,
             'Le sw.js doit être accessible à la racine'
        );
        
        if (accessible) {
            const hasInstall = response.data.includes('install');
            const hasActivate = response.data.includes('activate');
            const hasFetch = response.data.includes('fetch');
            
            test('Event install', hasInstall, 'Trouvé', 'Manquant');
            test('Event activate', hasActivate, 'Trouvé', 'Manquant');  
            test('Event fetch', hasFetch, 'Trouvé', 'Manquant');
            
            return hasInstall && hasActivate && hasFetch;
        }
        return false;
    } catch (error) {
        test('Service Worker accessible', false, '', `Erreur: ${error.message}`);
        return false;
    }
}

// Test 4: Icônes PWA
async function testIcons() {
    log('\n🎨 TEST ICÔNES PWA', 'bold');
    
    const criticalSizes = ['192', '512'];
    let criticalFound = 0;
    
    for (const size of criticalSizes) {
        try {
            const response = await makeRequest(`${PROD_URL}/icons/icon-${size}.png`);
            const found = response.statusCode === 200;
            
            test(`Icône ${size}px`, found, 
                 'Accessible', 
                 `Erreur ${response.statusCode}`,
                 'CRITIQUE pour installation PWA'
            );
            
            if (found) criticalFound++;
        } catch (error) {
            test(`Icône ${size}px`, false, '', `Erreur: ${error.message}`);
        }
    }
    
    log(`\n📊 Icônes critiques: ${criticalFound}/2`, criticalFound === 2 ? 'green' : 'red');
    return criticalFound === 2;
}

// Test 5: HTML PWA
async function testHTMLPWA() {
    log('\n📄 TEST HTML PWA', 'bold');
    
    try {
        const response = await makeRequest(PROD_URL);
        
        if (response.statusCode === 200) {
            const html = response.data;
            
            const hasManifestLink = html.includes('manifest.json');
            const hasViewport = html.includes('viewport');
            const hasThemeColor = html.includes('theme-color');
            const hasSWRegistration = html.includes('serviceWorker') || html.includes('sw.js');
            
            test('Lien manifest', hasManifestLink, 'Trouvé dans HTML', 'MANQUANT dans HTML');
            test('Meta viewport', hasViewport, 'Trouvé', 'Manquant');
            test('Meta theme-color', hasThemeColor, 'Trouvé', 'Manquant');
            test('Enregistrement SW', hasSWRegistration, 'Code détecté', 'Pas d\'enregistrement SW');
            
            return hasManifestLink && hasViewport && hasSWRegistration;
        }
        return false;
    } catch (error) {
        test('HTML PWA', false, '', `Erreur: ${error.message}`);
        return false;
    }
}

// Diagnostic final
async function generateDiagnosis(results) {
    log('\n' + '='.repeat(60), 'bold');
    log('🔧 DIAGNOSTIC INSTALLATION PWA', 'bold');
    log('='.repeat(60));
    
    const criticalTests = [results.manifest, results.icons, results.serviceWorker, results.html];
    const criticalPassed = criticalTests.filter(Boolean).length;
    const totalPassed = Object.values(results).filter(Boolean).length;
    
    log(`\n📊 Tests réussis: ${totalPassed}/5`, totalPassed === 5 ? 'green' : 'yellow');
    log(`🔑 Tests critiques PWA: ${criticalPassed}/4`, criticalPassed === 4 ? 'green' : 'red');
    
    if (criticalPassed === 4) {
        log('\n🎉 PWA READY FOR INSTALL!', 'green');
        log('✅ Tous les critères PWA sont remplis', 'green');
        log('\n🔍 SI L\'ICÔNE N\'APPARAÎT PAS:', 'yellow');
        log('1. Vider cache navigateur (Ctrl+Shift+R)', 'cyan');
        log('2. Mode incognito pour test propre', 'cyan'); 
        log('3. F12 → Application → Manifest (vérifier erreurs)', 'cyan');
        log('4. Lighthouse PWA audit (F12 → Lighthouse)', 'cyan');
    } else {
        log('\n❌ PWA NON INSTALLABLE', 'red');
        log('🔧 Problèmes à résoudre:', 'yellow');
        
        if (!results.manifest) {
            log('• MANIFEST: Inaccessible ou invalide', 'red');
            log('  → Vérifier /manifest.json accessible publiquement', 'cyan');
        }
        if (!results.icons) {
            log('• ICÔNES: 192px et/ou 512px manquantes', 'red');
            log('  → Vérifier /icons/icon-192.png et /icons/icon-512.png', 'cyan');
        }
        if (!results.serviceWorker) {
            log('• SERVICE WORKER: Inaccessible ou invalide', 'red');
            log('  → Vérifier /sw.js accessible publiquement', 'cyan');
        }
        if (!results.html) {
            log('• HTML: Liens PWA manquants', 'red');
            log('  → Vérifier <link rel="manifest"> dans HTML', 'cyan');
        }
    }
    
    log('\n🌐 URL testée: https://fleet.voluntis.space/', 'blue');
}

// Main
async function main() {
    console.clear();
    log('🚀 TEST PWA PRODUCTION - Fleet Wise Operations', 'bold');
    log(`🌐 URL: ${PROD_URL}`, 'blue');
    
    const results = {
        site: await testSiteAccess(),
        manifest: await testManifest(),
        serviceWorker: await testServiceWorker(), 
        icons: await testIcons(),
        html: await testHTMLPWA()
    };
    
    await generateDiagnosis(results);
    
    // Sauvegarder rapport
    const report = {
        timestamp: new Date().toISOString(),
        url: PROD_URL,
        results,
        summary: {
            total: 5,
            passed: Object.values(results).filter(Boolean).length,
            critical: [results.manifest, results.icons, results.serviceWorker, results.html].filter(Boolean).length
        }
    };
    
    fs.writeFileSync('production-pwa-test.json', JSON.stringify(report, null, 2));
    log('\n💾 Rapport: production-pwa-test.json', 'blue');
}

main().catch(console.error); 