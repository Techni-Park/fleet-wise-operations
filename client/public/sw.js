// Service Worker pour Fleet Wise Operations PWA
const CACHE_NAME = 'fleet-tech-pwa-v1';
const API_CACHE_NAME = 'fleet-tech-api-v1';

// Détecter mode développement
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

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
  
  // Ignorer les requêtes qui ne doivent pas être interceptées
  if (url.protocol === 'chrome-extension:' ||
      url.protocol === 'moz-extension:' ||
      url.protocol === 'devtools:' ||
      (isDevelopment && (
        url.pathname.startsWith('/@fs/') ||
        url.pathname.startsWith('/@vite/') ||
        url.pathname.startsWith('/node_modules/') ||
        url.pathname.includes('/__vite') ||
        request.url.includes('?v=') && request.url.includes('@fs')
      ))) {
    // Laisser passer ces requêtes sans interception
    console.log('[SW] Ignoring request:', url.pathname);
    return;
  }
  
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
  const url = new URL(request.url);
  
  // Ne traiter que les requêtes HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    console.log('[SW] Ignoring non-HTTP request:', url.protocol);
    return fetch(request);
  }
  
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      // Seulement mettre en cache les réponses réussies
      try {
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('[SW] Cache put failed:', cacheError.message);
      }
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for:', request.url);
    // Page offline pour les requêtes de navigation
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      return offlinePage || new Response('Offline', { status: 503 });
    }
    return new Response('Offline', { status: 503 });
  }
}

// Synchronisation background
self.addEventListener('sync', (event) => {
  console.log('[SW] Event sync reçu:', event.tag);
  
  if (event.tag === 'sync-interventions') {
    event.waitUntil(syncOfflineData());
  } else if (event.tag === 'sync-media') {
    event.waitUntil(syncOfflineMedia());
  } else if (event.tag === 'refresh-cache') {
    event.waitUntil(refreshCachedData());
  }
});

async function syncOfflineData() {
  console.log('[SW] Synchronisation des interventions offline');
  
  try {
    // Ouvrir IndexedDB
    const db = await openOfflineDB();
    const transaction = db.transaction(['interventions'], 'readonly');
    const store = transaction.objectStore('interventions');
    const index = store.index('status');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll('offline');
      request.onsuccess = async () => {
        const pendingInterventions = request.result;
        console.log('[SW] Interventions à synchroniser:', pendingInterventions.length);
        
        if (pendingInterventions.length > 0) {
          try {
            const response = await fetch('/api/pwa/sync/interventions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                interventions: pendingInterventions,
                source: 'background-sync'
              })
            });
            
            if (response.ok) {
              console.log('[SW] Synchronisation réussie');
              // Notifier l'utilisateur si possible
              self.registration.showNotification('Fleet Tech PWA', {
                body: `${pendingInterventions.length} intervention(s) synchronisée(s)`,
                icon: '/icons/icon-192.png',
                badge: '/icons/icon-96.png',
                tag: 'sync-success'
              });
            }
          } catch (error) {
            console.error('[SW] Erreur synchronisation:', error);
          }
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erreur sync offline data:', error);
  }
}

async function syncOfflineMedia() {
  console.log('[SW] Synchronisation des médias offline');
  
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['media'], 'readonly');
    const store = transaction.objectStore('media');
    const index = store.index('status');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll('pending');
      request.onsuccess = async () => {
        const pendingMedia = request.result;
        console.log('[SW] Médias à synchroniser:', pendingMedia.length);
        
        for (const media of pendingMedia) {
          try {
            await uploadMedia(media);
          } catch (error) {
            console.error('[SW] Erreur upload média:', error);
          }
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erreur sync media:', error);
  }
}

async function uploadMedia(media) {
  const formData = new FormData();
  formData.append('file', media.file);
  formData.append('type', media.type);
  formData.append('description', media.description || '');
  
  if (media.gps) {
    formData.append('latitude', media.gps.latitude.toString());
    formData.append('longitude', media.gps.longitude.toString());
  }

  const response = await fetch(`/api/pwa/interventions/${media.interventionId}/media`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (response.ok) {
    // Mettre à jour le statut dans IndexedDB
    await updateMediaStatus(media.id, 'uploaded');
  }
}

async function refreshCachedData() {
  console.log('[SW] Actualisation du cache en arrière-plan');
  
  const entities = ['vehicles', 'contacts', 'anomalies'];
  
  for (const entity of entities) {
    try {
      const response = await fetch(`/api/pwa/cache/${entity}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        // Mettre à jour le cache API
        const cache = await caches.open(API_CACHE_NAME);
        cache.put(`/api/pwa/cache/${entity}`, response.clone());
        console.log(`[SW] Cache ${entity} actualisé`);
      }
    } catch (error) {
      console.error(`[SW] Erreur actualisation cache ${entity}:`, error);
    }
  }
}

async function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FleetTechPWA', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function updateMediaStatus(mediaId, status) {
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(mediaId);
      getRequest.onsuccess = () => {
        const media = getRequest.result;
        if (media) {
          media.status = status;
          media.timestamp = Date.now();
          
          const putRequest = store.put(media);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(); // Média non trouvé, pas d'erreur
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error('[SW] Erreur update media status:', error);
  }
}

console.log('[SW] Service Worker chargé - Auth URLs exclus du cache'); 