import { useState, useEffect, useCallback } from 'react';
import { autoSync, SyncResult } from '../services/autoSync';
import { offlineStorage } from '../services/offlineStorage';

export interface PWASyncStatus {
  isOnline: boolean;
  isPreloading: boolean;
  isTravelMode: boolean;
  lastSync: Date | null;
  pendingInterventions: number;
  pendingMedia: number;
  storageUsed: number;
  storageQuota: number;
}

export function usePWASync() {
  const [status, setStatus] = useState<PWASyncStatus>({
    isOnline: navigator.onLine,
    isPreloading: false,
    isTravelMode: false,
    lastSync: null,
    pendingInterventions: 0,
    pendingMedia: 0,
    storageUsed: 0,
    storageQuota: 0
  });

  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
      setError(null);
      
      const autoSyncStatus = await autoSync.getStatus();
      const [pendingInterventions, pendingMedia, storageInfo] = await Promise.all([
        offlineStorage.getPendingInterventions(),
        offlineStorage.getPendingMedia(),
        offlineStorage.getStorageSize()
      ]);

      setStatus({
        isOnline: navigator.onLine,
        isPreloading: autoSyncStatus.preloading,
        isTravelMode: autoSyncStatus.travelMode,
        lastSync: autoSyncStatus.lastSync ? new Date(autoSyncStatus.lastSync) : null,
        pendingInterventions: pendingInterventions.length,
        pendingMedia: pendingMedia.length,
        storageUsed: storageInfo.used,
        storageQuota: storageInfo.quota
      });
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const startPreload = useCallback(async (): Promise<SyncResult[]> => {
    try {
      setError(null);
      const results = await autoSync.preloadEssentialData('manual');
      setSyncResults(results);
      await refreshStatus();
      return results;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, [refreshStatus]);

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const storagePercentage = status.storageQuota > 0 
    ? Math.round((status.storageUsed / status.storageQuota) * 100)
    : 0;

  const totalPending = status.pendingInterventions + status.pendingMedia;

  return {
    status,
    syncResults,
    error,
    storagePercentage,
    totalPending,
    refreshStatus,
    startPreload
  };
}

// Hook spécialisé pour l'état offline
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setWasOffline(isOffline);
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline]);

  return {
    isOffline,
    wasOffline,
    justCameOnline: wasOffline && !isOffline
  };
}

// Hook pour les notifications PWA
export function usePWANotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-96.png',
          ...options
        });
      });
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    canNotify: permission === 'granted'
  };
} 