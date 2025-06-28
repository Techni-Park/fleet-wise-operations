// Service de stockage offline avec IndexedDB pour PWA
export interface OfflineIntervention {
  id: number;
  data: any;
  lastModified: number;
  status: 'offline' | 'syncing' | 'synced' | 'error';
  created_at: number;
}

export interface OfflineMedia {
  id: string;
  interventionId: number;
  file: File;
  type: 'photo' | 'signature' | 'document';
  description?: string;
  gps?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
}

export interface SyncStatus {
  lastSync: number;
  pending: number;
  syncing: boolean;
}

class OfflineStorageService {
  private db: IDBDatabase | null = null;
  private dbName = 'FleetTechPWA';
  private dbVersion = 1;

  // Initialiser la base de données IndexedDB
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('[OfflineStorage] Erreur ouverture IndexedDB:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineStorage] IndexedDB initialisé');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('[OfflineStorage] Mise à jour structure IndexedDB');
        
        // Store pour les interventions offline
        if (!db.objectStoreNames.contains('interventions')) {
          const interventionStore = db.createObjectStore('interventions', { keyPath: 'id' });
          interventionStore.createIndex('status', 'status', { unique: false });
          interventionStore.createIndex('lastModified', 'lastModified', { unique: false });
        }
        
        // Store pour les médias (photos, signatures)
        if (!db.objectStoreNames.contains('media')) {
          const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
          mediaStore.createIndex('interventionId', 'interventionId', { unique: false });
          mediaStore.createIndex('status', 'status', { unique: false });
          mediaStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store pour les paramètres et cache
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expires', 'expires', { unique: false });
        }
        
        // Store pour les logs de synchronisation
        if (!db.objectStoreNames.contains('syncLogs')) {
          const syncStore = db.createObjectStore('syncLogs', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('entity', 'entity', { unique: false });
        }
      };
    });
  }

  // ============================================
  // GESTION DES INTERVENTIONS OFFLINE  
  // ============================================

  async saveOfflineIntervention(intervention: any): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const offlineIntervention: OfflineIntervention = {
      id: intervention.IDINTERVENTION || Date.now(),
      data: intervention,
      lastModified: Date.now(),
      status: 'offline',
      created_at: Date.now()
    };
    
    const transaction = this.db.transaction(['interventions'], 'readwrite');
    const store = transaction.objectStore('interventions');
    
    return new Promise((resolve, reject) => {
      const request = store.put(offlineIntervention);
      request.onsuccess = () => {
        console.log('[OfflineStorage] Intervention sauvegardée offline:', intervention.IDINTERVENTION);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineInterventions(): Promise<OfflineIntervention[]> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['interventions'], 'readonly');
    const store = transaction.objectStore('interventions');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingInterventions(): Promise<OfflineIntervention[]> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['interventions'], 'readonly');
    const store = transaction.objectStore('interventions');
    const index = store.index('status');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll('offline');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateInterventionStatus(id: number, status: OfflineIntervention['status']): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['interventions'], 'readwrite');
    const store = transaction.objectStore('interventions');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const intervention = getRequest.result;
        if (intervention) {
          intervention.status = status;
          intervention.lastModified = Date.now();
          
          const putRequest = store.put(intervention);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Intervention non trouvée'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteOfflineIntervention(id: number): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['interventions'], 'readwrite');
    const store = transaction.objectStore('interventions');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => {
        console.log('[OfflineStorage] Intervention supprimée:', id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================
  // GESTION DES MÉDIAS OFFLINE
  // ============================================

  async saveOfflineMedia(media: Omit<OfflineMedia, 'id' | 'timestamp' | 'status'>): Promise<string> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offlineMedia: OfflineMedia = {
      ...media,
      id: mediaId,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    const transaction = this.db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      const request = store.put(offlineMedia);
      request.onsuccess = () => {
        console.log('[OfflineStorage] Média sauvegardé offline:', mediaId);
        resolve(mediaId);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineMedia(interventionId?: number): Promise<OfflineMedia[]> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['media'], 'readonly');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      
      if (interventionId) {
        const index = store.index('interventionId');
        request = index.getAll(interventionId);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingMedia(): Promise<OfflineMedia[]> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['media'], 'readonly');
    const store = transaction.objectStore('media');
    const index = store.index('status');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll('pending');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateMediaStatus(id: string, status: OfflineMedia['status']): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const media = getRequest.result;
        if (media) {
          media.status = status;
          media.timestamp = Date.now();
          
          const putRequest = store.put(media);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Média non trouvé'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteOfflineMedia(id: string): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => {
        console.log('[OfflineStorage] Média supprimé:', id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================
  // GESTION DU CACHE
  // ============================================

  async setCache(key: string, data: any, expiresIn: number = 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const cacheItem = {
      key,
      data,
      expires: Date.now() + expiresIn,
      created: Date.now()
    };
    
    const transaction = this.db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    
    return new Promise((resolve, reject) => {
      const request = store.put(cacheItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCache(key: string): Promise<any> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['cache'], 'readonly');
    const store = transaction.objectStore('cache');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expires > Date.now()) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const transaction = this.db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    const index = store.index('expires');
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================
  // STATISTIQUES ET MONITORING
  // ============================================

  async getSyncStatus(): Promise<SyncStatus> {
    const [pendingInterventions, pendingMedia] = await Promise.all([
      this.getPendingInterventions(),
      this.getPendingMedia()
    ]);
    
    return {
      lastSync: 0, // À implémenter avec les logs
      pending: pendingInterventions.length + pendingMedia.length,
      syncing: false // À implémenter avec le statut global
    };
  }

  async getStorageSize(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    return { used: 0, quota: 0 };
  }

  // ============================================
  // NETTOYAGE ET MAINTENANCE
  // ============================================

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('IndexedDB non initialisé');
    
    const storeNames = ['interventions', 'media', 'cache', 'syncLogs'];
    const transaction = this.db.transaction(storeNames, 'readwrite');
    
    const promises = storeNames.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    
    await Promise.all(promises);
    console.log('[OfflineStorage] Toutes les données offline supprimées');
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('[OfflineStorage] Connexion IndexedDB fermée');
    }
  }
}

// Instance singleton
export const offlineStorage = new OfflineStorageService();

// Initialiser automatiquement
offlineStorage.init().catch(console.error); 