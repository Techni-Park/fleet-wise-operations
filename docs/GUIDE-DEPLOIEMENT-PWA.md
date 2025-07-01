# 🚀 Guide de Déploiement - PWA Fleet Wise Operations

## 📋 **Prérequis de déploiement**

### Vérifications avant déploiement
- ✅ Tous les tests de développement passés
- ✅ Base de données PWA créée (`create_pwa_tables.sql`)
- ✅ Configuration HTTPS activée (obligatoire pour PWA)
- ✅ Certificats SSL valides
- ✅ Domaine configuré

## 🔧 **Étape 1 : Configuration de production**

### Variables d'environnement
```bash
# .env.production
NODE_ENV=production
VITE_API_URL=https://votre-domaine.com
PWA_CACHE_VERSION=v1.0.0
PWA_AUTO_SYNC_ENABLED=true
PWA_DEFAULT_SYNC_INTERVAL=120
```

### Configuration base de données
```sql
-- Exécuter create_pwa_tables.sql en production
mysql -u username -p database_name < create_pwa_tables.sql

-- Vérifier les tables créées
SHOW TABLES LIKE 'PWA_%';
```

### Configuration Service Worker
```javascript
// client/public/sw.js - Version de production
const CACHE_NAME = 'fleet-tech-pwa-v1.0.0'; // Version unique
const API_CACHE_NAME = 'fleet-tech-api-v1.0.0';
```

## 📦 **Étape 2 : Build de production**

### Build complet
```bash
# Nettoyer les builds précédents
rm -rf dist/

# Build optimisé pour production
npm run build

# Vérifier la taille des bundles
npm run build-analyze
```

### Optimisations PWA
```json
// vite.config.ts - Configuration PWA production
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24h
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pwa-core': ['./src/services/autoSync.ts', './src/services/offlineStorage.ts'],
          'pwa-components': ['./src/components/PWA/TravelMode.tsx', './src/hooks/usePWASync.ts']
        }
      }
    }
  }
})
```

## 🌐 **Étape 3 : Déploiement serveur**

### Configuration NGINX
```nginx
# /etc/nginx/sites-available/fleet-tech-pwa
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Service Worker - Cache spécial
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri =404;
    }

    # Manifest PWA
    location /manifest.json {
        add_header Cache-Control "public, max-age=86400";
        add_header Access-Control-Allow-Origin "*";
        try_files $uri =404;
    }

    # Assets statiques - Cache long
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API - Pas de cache
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Headers PWA
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    }

    # Application SPA
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        
        # Headers sécurité PWA
        add_header X-Frame-Options "DENY";
        add_header X-Content-Type-Options "nosniff";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
    }
}

# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}
```

### Script de déploiement
```bash
#!/bin/bash
# deploy-pwa.sh

set -e

echo "🚀 Déploiement PWA Fleet Tech Operations"

# 1. Backup base de données
echo "💾 Sauvegarde base de données..."
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Mise à jour code
echo "📦 Mise à jour du code..."
git pull origin main

# 3. Installation dépendances
echo "📚 Installation dépendances..."
npm ci --production

# 4. Build production
echo "🔨 Build production..."
npm run build

# 5. Mise à jour base de données
echo "🗄️ Mise à jour schéma base..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < create_pwa_tables.sql || echo "Tables déjà existantes"

# 6. Déploiement fichiers
echo "📤 Déploiement fichiers..."
rsync -av --delete dist/ /var/www/fleet-tech-pwa/
rsync -av server/ /var/www/fleet-tech-pwa-api/

# 7. Redémarrage services
echo "🔄 Redémarrage services..."
sudo systemctl reload nginx
pm2 restart fleet-tech-api

# 8. Test santé
echo "🏥 Test de santé..."
sleep 5
curl -f https://votre-domaine.com/api/pwa/test || echo "⚠️ Warning: API test failed"

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Application accessible: https://votre-domaine.com"
```

## 📊 **Étape 4 : Tests de production**

### Test d'installation PWA
```bash
# Lighthouse CLI pour audit PWA
npm install -g lighthouse
lighthouse https://votre-domaine.com --only-categories=pwa --output=html --output-path=./pwa-audit.html
```

### Tests automatisés production
```javascript
// scripts/test-production-pwa.js
const puppeteer = require('puppeteer');

async function testPWAProduction() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log('🔍 Test PWA Production...');
  
  try {
    // Test chargement initial
    await page.goto('https://votre-domaine.com');
    await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 10000 });
    
    // Test pré-chargement
    await page.click('[data-testid="login-button"]');
    await page.waitForSelector('[data-testid="preload-indicator"]', { timeout: 5000 });
    
    // Test mode offline
    await page.setOfflineMode(true);
    await page.reload();
    await page.waitForSelector('[data-testid="offline-indicator"]');
    
    console.log('✅ Tests PWA production réussis');
  } catch (error) {
    console.error('❌ Erreur tests PWA:', error);
  } finally {
    await browser.close();
  }
}

testPWAProduction();
```

### Monitoring des métriques
```javascript
// Monitoring performance PWA
const metrics = {
  preloadTime: performance.getEntriesByName('preload-duration')[0]?.duration,
  cacheHitRatio: localStorage.getItem('pwa-cache-stats'),
  syncQueueSize: await offlineStorage.getPendingInterventions().length,
  storageUsage: await navigator.storage.estimate()
};

// Envoi métriques vers monitoring
fetch('/api/pwa/metrics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(metrics)
});
```

## 🔐 **Étape 5 : Sécurité et optimisation**

### Content Security Policy (CSP)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.votre-domaine.com;
  manifest-src 'self';
  worker-src 'self';
">
```

### Compression et optimisation
```nginx
# Compression gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Brotli (si disponible)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

## 📈 **Étape 6 : Monitoring et maintenance**

### Dashboard de monitoring
```sql
-- Requêtes de monitoring PWA
SELECT 
  COUNT(*) as total_interventions_offline,
  AVG(TIMESTAMPDIFF(MINUTE, CREATED_AT, SYNCED_AT)) as avg_sync_delay_minutes
FROM INTERVENTION_SYNC 
WHERE STATUS = 'synced' 
  AND DATE(CREATED_AT) = CURDATE();

SELECT 
  ENTITY_TYPE,
  COUNT(*) as cache_requests,
  AVG(RESPONSE_TIME) as avg_response_time
FROM PWA_OFFLINE_CACHE 
WHERE DATE(CREATED_AT) = CURDATE()
GROUP BY ENTITY_TYPE;
```

### Alertes automatiques
```javascript
// Monitoring automatique
setInterval(async () => {
  const stats = await fetch('/api/pwa/health').then(r => r.json());
  
  if (stats.pendingSync > 100) {
    alert('⚠️ File de synchronisation importante: ' + stats.pendingSync);
  }
  
  if (stats.storageUsage > 0.9) {
    alert('💾 Stockage presque plein: ' + (stats.storageUsage * 100).toFixed(1) + '%');
  }
}, 300000); // Toutes les 5 minutes
```

### Maintenance périodique
```bash
#!/bin/bash
# maintenance-pwa.sh - À exécuter via cron

# Nettoyage des données expirées
mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
DELETE FROM PWA_OFFLINE_CACHE 
WHERE EXPIRES_AT < NOW() - INTERVAL 7 DAY;

DELETE FROM INTERVENTION_SYNC 
WHERE STATUS = 'synced' AND CREATED_AT < NOW() - INTERVAL 30 DAY;
"

# Optimisation base
mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "OPTIMIZE TABLE PWA_OFFLINE_CACHE, INTERVENTION_SYNC;"

# Backup hebdomadaire
if [ $(date +%u) -eq 1 ]; then
  mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > /backups/weekly-$(date +%Y%m%d).sql
fi
```

## ✅ **Checklist déploiement final**

### Avant déploiement
- [ ] Tests développement validés
- [ ] Build production sans erreurs  
- [ ] Configuration HTTPS active
- [ ] Base de données PWA créée
- [ ] Certificats SSL valides
- [ ] Nginx configuré
- [ ] Scripts de déploiement testés

### Après déploiement
- [ ] PWA installable (bouton d'installation visible)
- [ ] Audit Lighthouse PWA > 90 points
- [ ] Test offline fonctionnel
- [ ] Pré-chargement automatique opérationnel
- [ ] Mode voyage testé
- [ ] Synchronisation en arrière-plan active
- [ ] Monitoring en place
- [ ] Performance acceptable (< 3s chargement initial)
- [ ] Tous les endpoints PWA répondent
- [ ] Logs serveur sans erreurs

## 🎉 **Mise en production réussie !**

Votre PWA Fleet Wise Operations avec pré-chargement intelligent est maintenant déployée et prête pour un usage professionnel intensif ! 

### Support et maintenance
- **Monitoring** : Dashboard temps réel
- **Alertes** : Notifications automatiques
- **Backup** : Sauvegarde quotidienne
- **Mise à jour** : Déploiement automatisé
- **Performance** : Optimisation continue

🚀 **Votre équipe peut maintenant travailler efficacement même hors ligne !** 