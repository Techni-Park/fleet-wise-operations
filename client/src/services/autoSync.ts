// Service de synchronisation automatique pour PWA
import { offlineStorage } from './offlineStorage';

export interface PreloadConfig {
  enabled: boolean;
  vehicles: boolean;
  contacts: boolean;
  anomalies: boolean;
  machines: boolean;
  recentInterventions: boolean;
  maxVehicles: number;
  maxContacts: number;
  syncInterval: number; // en minutes
}

export interface TravelModeConfig {
  enabled: boolean;
  vehicleIds: number[];
  contactIds: number[];
  gpsRadius: number; // en km
  centerLat?: number;
  centerLng?: number;
  expiryHours: number;
}

export interface SyncResult {
  success: boolean;
  entity: string;
  count: number;
  error?: string;
  timestamp: number;
}

class AutoSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isPreloading: boolean = false;
  private isTravelMode: boolean = false;
  
  // Configuration par défaut
  private defaultConfig: PreloadConfig = {
    enabled: true,
    vehicles: true,
    contacts: true,
    anomalies: true,
    machines: true,
    recentInterventions: true,
    maxVehicles: 100,
    maxContacts: 50,
    syncInterval: 120 // 2 heures
  };

  private defaultTravelConfig: TravelModeConfig = {
    enabled: false,
    vehicleIds: [],
    contactIds: [],
    gpsRadius: 50, // 50km
    expiryHours: 48
  };

  constructor() {
    this.init();
  }

  private async init() {
    try {
      await offlineStorage.init();
      await this.loadConfigurations();
      this.setupBackgroundSync();
      console.log('[AutoSync] Service de synchronisation automatique initialisé');
    } catch (error) {
      console.error('[AutoSync] Erreur initialisation:', error);
    }
  }

  // ============================================
  // PRÉ-CHARGEMENT AU LOGIN
  // ============================================

  async preloadEssentialData(userId: string): Promise<SyncResult[]> {
    if (this.isPreloading) {
      console.log('[AutoSync] Pré-chargement déjà en cours...');
      return [];
    }

    this.isPreloading = true;
    const results: SyncResult[] = [];
    
    try {
      console.log('[AutoSync] Début du pré-chargement pour utilisateur:', userId);
      const config = await this.getPreloadConfig();
      
      if (!config.enabled) {
        console.log('[AutoSync] Pré-chargement désactivé');
        return [];
      }

      // Pré-charger les données en parallèle
      const preloadPromises = [];

      if (config.vehicles) {
        preloadPromises.push(
          this.preloadVehicles(config.maxVehicles)
            .then(result => results.push(result))
        );
      }

      if (config.contacts) {
        preloadPromises.push(
          this.preloadContacts(config.maxContacts)
            .then(result => results.push(result))
        );
      }

      if (config.anomalies) {
        preloadPromises.push(
          this.preloadAnomalies()
            .then(result => results.push(result))
        );
      }

      if (config.machines) {
        preloadPromises.push(
          this.preloadMachines()
            .then(result => results.push(result))
        );
      }

      if (config.recentInterventions) {
        preloadPromises.push(
          this.preloadRecentInterventions(userId)
            .then(result => results.push(result))
        );
      }

      await Promise.all(preloadPromises);

      // Enregistrer l'horodatage du dernier sync
      await this.setLastSyncTime();
      
      console.log('[AutoSync] Pré-chargement terminé:', results);
      return results;

    } catch (error) {
      console.error('[AutoSync] Erreur pré-chargement:', error);
      results.push({
        success: false,
        entity: 'preload',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      });
      return results;
    } finally {
      this.isPreloading = false;
    }
  }

  private async preloadVehicles(maxCount: number): Promise<SyncResult> {
    try {
      const response = await fetch(`/api/pwa/cache/vehicles?limit=${maxCount}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      await offlineStorage.setCache('vehicles', result.data, 24 * 60 * 60 * 1000); // 24h
      
      console.log('[AutoSync] Véhicules pré-chargés:', result.count);
      return {
        success: true,
        entity: 'vehicles',
        count: result.count,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('[AutoSync] Erreur pré-chargement véhicules:', error);
      return {
        success: false,
        entity: 'vehicles',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async preloadContacts(maxCount: number): Promise<SyncResult> {
    try {
      const response = await fetch(`/api/pwa/cache/contacts?limit=${maxCount}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      await offlineStorage.setCache('contacts', result.data, 24 * 60 * 60 * 1000); // 24h
      
      console.log('[AutoSync] Contacts pré-chargés:', result.count);
      return {
        success: true,
        entity: 'contacts',
        count: result.count,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('[AutoSync] Erreur pré-chargement contacts:', error);
      return {
        success: false,
        entity: 'contacts',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async preloadAnomalies(): Promise<SyncResult> {
    try {
      const response = await fetch('/api/pwa/cache/anomalies', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      await offlineStorage.setCache('anomalies', result.data, 24 * 60 * 60 * 1000); // 24h
      
      console.log('[AutoSync] Anomalies pré-chargées:', result.count);
      return {
        success: true,
        entity: 'anomalies',
        count: result.count,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('[AutoSync] Erreur pré-chargement anomalies:', error);
      return {
        success: false,
        entity: 'anomalies',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async preloadMachines(): Promise<SyncResult> {
    try {
      const response = await fetch('/api/pwa/cache/machines', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      await offlineStorage.setCache('machines', result.data, 24 * 60 * 60 * 1000); // 24h
      
      console.log('[AutoSync] Machines pré-chargées:', result.count);
      return {
        success: true,
        entity: 'machines',
        count: result.count,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('[AutoSync] Erreur pré-chargement machines:', error);
      return {
        success: false,
        entity: 'machines',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async preloadRecentInterventions(userId: string): Promise<SyncResult> {
    try {
      const response = await fetch('/api/pwa/cache/interventions?limit=20&recent=true', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      await offlineStorage.setCache('recent_interventions', result.data, 2 * 60 * 60 * 1000); // 2h
      
      console.log('[AutoSync] Interventions récentes pré-chargées:', result.count);
      return {
        success: true,
        entity: 'recent_interventions',
        count: result.count,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('[AutoSync] Erreur pré-chargement interventions:', error);
      return {
        success: false,
        entity: 'recent_interventions',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  // ============================================
  // SYNCHRONISATION EN ARRIÈRE-PLAN
  // ============================================

  private setupBackgroundSync() {
    this.stopBackgroundSync(); // Arrêter toute sync en cours
    
    const config = this.getPreloadConfig();
    const intervalMs = config.then(c => c.syncInterval * 60 * 1000); // Convertir en millisecondes
    
    intervalMs.then(interval => {
      this.syncInterval = setInterval(() => {
        this.performBackgroundSync();
      }, interval);
      
      console.log('[AutoSync] Synchronisation en arrière-plan programmée toutes les', interval / (60 * 1000), 'minutes');
    });
  }

  private async performBackgroundSync() {
    // Vérifier si en ligne
    if (!navigator.onLine) {
      console.log('[AutoSync] Hors ligne - synchronisation reportée');
      return;
    }

    try {
      console.log('[AutoSync] Synchronisation automatique en cours...');
      
      // Nettoyer le cache expiré
      await offlineStorage.clearExpiredCache();
      
      // Mettre à jour les données cachées
      const config = await this.getPreloadConfig();
      if (config.enabled) {
        await this.refreshCachedData();
      }
      
      // Synchroniser les données pending
      await this.syncPendingData();
      
    } catch (error) {
      console.error('[AutoSync] Erreur synchronisation automatique:', error);
    }
  }

  private async refreshCachedData() {
    const entities = ['vehicles', 'contacts', 'anomalies', 'machines'];
    
    for (const entity of entities) {
      try {
        const response = await fetch(`/api/pwa/cache/${entity}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const result = await response.json();
          await offlineStorage.setCache(entity, result.data, result.cacheExpiry);
          console.log(`[AutoSync] ${entity} mis à jour:`, result.count, 'éléments');
        }
      } catch (error) {
        console.error(`[AutoSync] Erreur mise à jour ${entity}:`, error);
      }
    }
  }

  private async syncPendingData() {
    try {
      // Synchroniser les interventions pending
      const pendingInterventions = await offlineStorage.getPendingInterventions();
      if (pendingInterventions.length > 0) {
        const response = await fetch('/api/pwa/sync/interventions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            interventions: pendingInterventions,
            lastSync: await this.getLastSyncTime()
          })
        });
        
        if (response.ok) {
          console.log('[AutoSync] Interventions synchronisées:', pendingInterventions.length);
        }
      }

      // Synchroniser les médias pending
      const pendingMedia = await offlineStorage.getPendingMedia();
      for (const media of pendingMedia) {
        try {
          await this.uploadMedia(media);
        } catch (error) {
          console.error('[AutoSync] Erreur upload média:', error);
        }
      }
      
    } catch (error) {
      console.error('[AutoSync] Erreur synchronisation données pending:', error);
    }
  }

  private async uploadMedia(media: any) {
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
      await offlineStorage.updateMediaStatus(media.id, 'uploaded');
      console.log('[AutoSync] Média uploadé:', media.id);
    }
  }

  // ============================================
  // MODE VOYAGE
  // ============================================

  async enableTravelMode(config: Partial<TravelModeConfig>): Promise<SyncResult[]> {
    const travelConfig = { ...this.defaultTravelConfig, ...config, enabled: true };
    await this.setTravelConfig(travelConfig);
    
    this.isTravelMode = true;
    const results: SyncResult[] = [];
    
    try {
      console.log('[AutoSync] Activation mode voyage:', travelConfig);
      
      // Pré-charger les véhicules spécifiques
      if (travelConfig.vehicleIds.length > 0) {
        for (const vehicleId of travelConfig.vehicleIds) {
          const result = await this.preloadVehicleDetails(vehicleId);
          results.push(result);
        }
      }
      
      // Pré-charger les contacts spécifiques
      if (travelConfig.contactIds.length > 0) {
        for (const contactId of travelConfig.contactIds) {
          const result = await this.preloadContactDetails(contactId);
          results.push(result);
        }
      }
      
      // Pré-charger par zone géographique si GPS disponible
      if (travelConfig.centerLat && travelConfig.centerLng) {
        const geoResult = await this.preloadByGeography(
          travelConfig.centerLat,
          travelConfig.centerLng,
          travelConfig.gpsRadius
        );
        results.push(geoResult);
      }
      
      console.log('[AutoSync] Mode voyage activé avec succès');
      return results;
      
    } catch (error) {
      console.error('[AutoSync] Erreur activation mode voyage:', error);
      results.push({
        success: false,
        entity: 'travel_mode',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      });
      return results;
    }
  }

  async disableTravelMode(): Promise<void> {
    this.isTravelMode = false;
    const config = { ...this.defaultTravelConfig, enabled: false };
    await this.setTravelConfig(config);
    console.log('[AutoSync] Mode voyage désactivé');
  }

  private async preloadVehicleDetails(vehicleId: number): Promise<SyncResult> {
    try {
      // Charger le véhicule et ses interventions
      const [vehicleResponse, interventionsResponse] = await Promise.all([
        fetch(`/api/vehicles/${vehicleId}`, { credentials: 'include' }),
        fetch(`/api/vehicles/${vehicleId}/interventions`, { credentials: 'include' })
      ]);
      
      if (vehicleResponse.ok && interventionsResponse.ok) {
        const vehicle = await vehicleResponse.json();
        const interventions = await interventionsResponse.json();
        
        await offlineStorage.setCache(`vehicle_${vehicleId}`, vehicle, 48 * 60 * 60 * 1000); // 48h
        await offlineStorage.setCache(`vehicle_${vehicleId}_interventions`, interventions, 24 * 60 * 60 * 1000); // 24h
        
        return {
          success: true,
          entity: `vehicle_${vehicleId}`,
          count: 1 + interventions.length,
          timestamp: Date.now()
        };
      }
      
      throw new Error('Erreur chargement véhicule');
    } catch (error) {
      return {
        success: false,
        entity: `vehicle_${vehicleId}`,
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async preloadContactDetails(contactId: number): Promise<SyncResult> {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, { credentials: 'include' });
      
      if (response.ok) {
        const contact = await response.json();
        await offlineStorage.setCache(`contact_${contactId}`, contact, 48 * 60 * 60 * 1000); // 48h
        
        return {
          success: true,
          entity: `contact_${contactId}`,
          count: 1,
          timestamp: Date.now()
        };
      }
      
      throw new Error('Erreur chargement contact');
    } catch (error) {
      return {
        success: false,
        entity: `contact_${contactId}`,
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async preloadByGeography(lat: number, lng: number, radius: number): Promise<SyncResult> {
    try {
      const response = await fetch(`/api/pwa/cache/geography?lat=${lat}&lng=${lng}&radius=${radius}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        await offlineStorage.setCache('geography_data', result.data, 48 * 60 * 60 * 1000); // 48h
        
        return {
          success: true,
          entity: 'geography',
          count: result.count,
          timestamp: Date.now()
        };
      }
      
      throw new Error('Erreur chargement données géographiques');
    } catch (error) {
      return {
        success: false,
        entity: 'geography',
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  // ============================================
  // CONFIGURATION ET UTILS
  // ============================================

  async getPreloadConfig(): Promise<PreloadConfig> {
    const saved = await offlineStorage.getCache('preload_config');
    return saved || this.defaultConfig;
  }

  async setPreloadConfig(config: Partial<PreloadConfig>): Promise<void> {
    const currentConfig = await this.getPreloadConfig();
    const newConfig = { ...currentConfig, ...config };
    await offlineStorage.setCache('preload_config', newConfig, 365 * 24 * 60 * 60 * 1000); // 1 an
    
    // Redémarrer la sync si l'interval a changé
    if (config.syncInterval && config.syncInterval !== currentConfig.syncInterval) {
      this.setupBackgroundSync();
    }
  }

  async getTravelConfig(): Promise<TravelModeConfig> {
    const saved = await offlineStorage.getCache('travel_config');
    return saved || this.defaultTravelConfig;
  }

  async setTravelConfig(config: TravelModeConfig): Promise<void> {
    await offlineStorage.setCache('travel_config', config, 365 * 24 * 60 * 60 * 1000); // 1 an
  }

  private async loadConfigurations() {
    const [preloadConfig, travelConfig] = await Promise.all([
      this.getPreloadConfig(),
      this.getTravelConfig()
    ]);
    
    this.isTravelMode = travelConfig.enabled;
    console.log('[AutoSync] Configurations chargées:', { preloadConfig, travelConfig });
  }

  private async setLastSyncTime(): Promise<void> {
    await offlineStorage.setCache('last_sync_time', Date.now(), 365 * 24 * 60 * 60 * 1000); // 1 an
  }

  private async getLastSyncTime(): Promise<number> {
    const lastSync = await offlineStorage.getCache('last_sync_time');
    return lastSync || 0;
  }

  stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[AutoSync] Synchronisation en arrière-plan arrêtée');
    }
  }

  async getStatus() {
    const [preloadConfig, travelConfig, lastSync, storageSize] = await Promise.all([
      this.getPreloadConfig(),
      this.getTravelConfig(),
      this.getLastSyncTime(),
      offlineStorage.getStorageSize()
    ]);

    return {
      preloading: this.isPreloading,
      travelMode: this.isTravelMode,
      backgroundSyncActive: this.syncInterval !== null,
      lastSync: new Date(lastSync).toISOString(),
      config: preloadConfig,
      travelConfig,
      storage: storageSize,
      online: navigator.onLine
    };
  }
}

// Instance singleton
export const autoSync = new AutoSyncService(); 