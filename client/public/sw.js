// Service Worker pour Fleet Wise Operations PWA
const CACHE_NAME = 'fleet-wise-v1.2.1';
const ASSETS_CACHE = 'fleet-assets-v1.2.1';
const API_CACHE = 'fleet-api-v1.2.1';

// Détecter mode développement
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// Assets à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// URLs à exclure du cache
const EXCLUDED_URLS = [
  /^\/@fs\//,                     // Fichiers Vite en développement
  /^\/@vite\//,                   // HMR et fichiers Vite
  /^\/node_modules\//,            // Node modules en dev
  /^\/src\//,                     // Fichiers source en dev
  /\.hot-update\./,               // Hot reload
  /^\/api\/auth\//,               // URLs d'authentification
  /^\/api\/login/,                // Login
  /^\/api\/logout/,               // Logout
  /^\/api\/current-user/          // Vérification utilisateur
];

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache ouvert');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.error('[SW] Erreur cache assets:', error);
        // Ne pas échouer l'installation si certains assets ne peuvent pas être mis en cache
        return Promise.resolve();
      });
    })
  );
  
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ASSETS_CACHE && cacheName !== API_CACHE) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fonction pour vérifier si une URL doit être exclue du cache
function shouldIgnoreRequest(url) {
  return EXCLUDED_URLS.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    return url.includes(pattern);
  });
}

// Gestion spéciale des requêtes d'authentification
function handleAuthRequest(request) {
  console.log('[SW] Requête auth - bypass cache:', request.url);
  
  return fetch(request, {
    credentials: 'include',
    mode: 'same-origin',
    headers: {
      ...request.headers,
      'Cache-Control': 'no-cache'
    }
  });
}

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDevServer = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  // Ignorer les fichiers de développement Vite
  if (shouldIgnoreRequest(url.pathname)) {
    console.log('[SW] Ignoring request:', url.pathname);
    return;
  }
  
  // Gestion spéciale des requêtes d'authentification
  if (url.pathname.includes('/api/login') || 
      url.pathname.includes('/api/logout') || 
      url.pathname.includes('/api/current-user') ||
      url.pathname.includes('/api/auth/')) {
    event.respondWith(handleAuthRequest(event.request));
    return;
  }
  
  // Stratégie de cache pour les différents types de requêtes
  if (event.request.method === 'GET') {
    // Assets statiques
    if (url.pathname.includes('/icons/') || 
        url.pathname.includes('/assets/') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.svg')) {
      
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(ASSETS_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          }).catch(() => {
            // Fallback pour les assets en mode offline
            if (url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg')) {
              return caches.match('/placeholder.svg');
            }
            return new Response('Asset non disponible offline', { status: 404 });
          });
        })
      );
      return;
    }
    
    // Pages HTML - Network First avec cache fallback
    if (event.request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(
        fetch(event.request, {
          credentials: 'include'
        }).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Fallback vers cache puis page offline
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline.html');
          });
        })
      );
      return;
    }
    
    // API - Cache avec network fallback pour données non critiques
    if (url.pathname.startsWith('/api/') && 
        !url.pathname.includes('/auth/') &&
        !url.pathname.includes('/login') &&
        !url.pathname.includes('/logout')) {
      
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request, {
            credentials: 'include'
          }).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(API_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
          
          // Retourner le cache immédiatement si disponible, sinon attendre le réseau
          return cachedResponse || fetchPromise;
        })
      );
      return;
    }
  }
  
  // Pour toutes les autres requêtes, laisser passer normalement
  event.respondWith(fetch(event.request));
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('[SW] Erreur:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Promise rejetée:', event.reason);
});

console.log('[SW] Service Worker Fleet Wise chargé - Version:', CACHE_NAME); 