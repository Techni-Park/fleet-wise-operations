// Service Worker pour Fleet Wise Operations PWA
const CACHE_NAME = 'fleet-tech-pwa-v1';
const API_CACHE_NAME = 'fleet-tech-api-v1';

const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// URLs d'authentification à ne JAMAIS mettre en cache
const AUTH_URLS = [
  '/api/login',
  '/api/logout', 
  '/api/current-user',
  '/api/forgot-password',
  '/api/test-login',
  '/api/test-user-auth'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Vérifier si c'est une requête d'authentification
  const isAuthRequest = AUTH_URLS.some(authUrl => url.pathname === authUrl);
  
  if (url.pathname.startsWith('/api/')) {
    if (isAuthRequest) {
      // Requêtes d'auth : passer directement au réseau, ne pas mettre en cache
      event.respondWith(handleAuthRequest(request));
    } else {
      // Autres requêtes API : utiliser la stratégie de cache
      event.respondWith(handleApiRequest(request));
    }
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Gestion spéciale des requêtes d'authentification
async function handleAuthRequest(request) {
  console.log('[SW] Requête auth détectée:', request.url);
  
  try {
    // Passer directement au réseau avec les credentials
    const response = await fetch(request, {
      credentials: 'include',
      mode: 'same-origin'
    });
    
    console.log('[SW] Réponse auth:', response.status);
    return response;
  } catch (error) {
    console.error('[SW] Erreur requête auth:', error);
    
    // En cas d'erreur offline pour l'auth, retourner une erreur explicite
    return new Response(JSON.stringify({ 
      error: 'Connexion requise', 
      message: 'Authentification impossible hors ligne',
      offline: true
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Toujours inclure les credentials pour les requêtes API
    const networkResponse = await fetch(request, {
      credentials: 'include'
    });
    
    if (networkResponse.ok && request.method === 'GET') {
      // Ne mettre en cache que les GET réussis
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Requête API échouée, tentative cache:', request.url);
    
    // Seulement pour les requêtes GET, essayer le cache
    if (request.method === 'GET') {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('[SW] Données trouvées en cache pour:', request.url);
        return cachedResponse;
      }
    }
    
    return new Response(JSON.stringify({ 
      error: 'Offline',
      message: 'Données non disponibles hors ligne'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Page offline pour les requêtes de navigation
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

// Synchronisation background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-interventions') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  console.log('[SW] Synchronisation des données offline');
  // À implémenter avec IndexedDB
}

console.log('[SW] Service Worker chargé - Auth URLs exclus du cache'); 