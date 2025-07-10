import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type ParamAppli } from '@shared/schema';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: Partial<ParamAppli> | null;
  loading: boolean;
  error: string | null;
  reloadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🏗️ [SettingsContext] Provider initializing...');
  
  const [settings, setSettings] = useState<Partial<ParamAppli> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  // Debug: Log de l'état d'authentification
  console.log('🔐 [SettingsContext] Auth state:', {
    hasUser: !!auth.user,
    userInfo: auth.user ? { CDUSER: auth.user.CDUSER, NOMFAMILLE: auth.user.NOMFAMILLE } : null,
    authLoading: auth.loading,
    authType: typeof auth.user
  });

  const fetchSettings = useCallback(async () => {
    console.log('📡 [SettingsContext] fetchSettings called');
    console.log('🔍 [SettingsContext] Auth check before fetch:', {
      hasUser: !!auth.user,
      authUser: auth.user
    });

    // Ne rien faire si l'utilisateur n'est pas connecté
    if (!auth.user) {
      console.log('❌ [SettingsContext] No user authenticated, stopping fetch');
      setLoading(false);
      return;
    }

    console.log('🚀 [SettingsContext] Starting settings fetch...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('🌐 [SettingsContext] Making GET request to /api/paramappli');
      
      const response = await fetch('/api/paramappli');
      
      console.log('📨 [SettingsContext] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [SettingsContext] Settings loaded successfully');
        console.log('📊 [SettingsContext] Settings data:', {
          dataType: typeof data,
          dataKeys: data ? Object.keys(data) : 'null',
          dataLength: data ? Object.keys(data).length : 0,
          sampleData: {
            RAISON_SOCIALE: data?.RAISON_SOCIALE,
            EMAIL: data?.EMAIL,
            ADRESSE: data?.ADRESSE,
            VILLE: data?.VILLE,
            CPOSTAL: data?.CPOSTAL
          },
          fullData: data
        });
        setSettings(data);
      } else {
        console.error('❌ [SettingsContext] Settings fetch failed');
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: await response.text() };
        }
        console.error('📋 [SettingsContext] Error details:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        const errorMessage = errorData.error || "Impossible de charger les paramètres de l'application.";
        setError(errorMessage);
        setSettings({}); // Init with empty object on error to avoid null issues
        console.log('🔧 [SettingsContext] Set settings to empty object due to error');
      }
    } catch (err) {
      console.error('💥 [SettingsContext] Network error during fetch:', err);
      setError("Une erreur réseau est survenue.");
      setSettings({}); // Init with empty object on error
      console.log('🔧 [SettingsContext] Set settings to empty object due to network error');
    } finally {
      setLoading(false);
      console.log('🏁 [SettingsContext] Fetch completed, loading set to false');
    }
  }, [auth.user]); // Dépend de l'utilisateur

  useEffect(() => {
    console.log('🔄 [SettingsContext] useEffect triggered');
    console.log('🔍 [SettingsContext] useEffect conditions:', {
      authLoading: auth.loading,
      hasUser: !!auth.user,
      shouldFetch: !auth.loading && !!auth.user,
      shouldClear: !auth.loading && !auth.user
    });

    // Lancer le fetch si l'état d'auth n'est plus en chargement et qu'un utilisateur est bien présent
    if (!auth.loading && auth.user) {
      console.log('✅ [SettingsContext] Conditions met, calling fetchSettings');
      fetchSettings();
    } else if (!auth.loading && !auth.user) {
      console.log('🧹 [SettingsContext] User disconnected, clearing settings');
      // Si l'utilisateur se déconnecte, on vide les paramètres
      setSettings({});
      setLoading(false);
    } else {
      console.log('⏳ [SettingsContext] Waiting for auth to complete...');
    }
  }, [auth.loading, auth.user, fetchSettings]);

  // Debug: Log des changements d'état
  useEffect(() => {
    console.log('🔄 [SettingsContext] State updated:', {
      hasSettings: !!settings,
      settingsType: typeof settings,
      settingsKeys: settings ? Object.keys(settings) : 'null',
      loading,
      error,
      settingsContent: settings
    });
  }, [settings, loading, error]);

  const reloadSettings = async () => {
    console.log('🔄 [SettingsContext] Manual reload requested');
    await fetchSettings();
  };

  const value = { settings, loading, error, reloadSettings };

  console.log('📦 [SettingsContext] Providing context value:', value);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  console.log('🎣 [SettingsContext] useSettings hook called, returning:', context);
  return context;
}; 