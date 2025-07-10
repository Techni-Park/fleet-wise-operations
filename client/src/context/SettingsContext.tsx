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
  const [settings, setSettings] = useState<Partial<ParamAppli> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const fetchSettings = useCallback(async () => {
    // Ne rien faire si l'utilisateur n'est pas connecté
    if (!auth.user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/paramappli');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Impossible de charger les paramètres de l'application.");
        setSettings({}); // Init with empty object on error to avoid null issues
      }
    } catch (err) {
      setError("Une erreur réseau est survenue.");
      setSettings({}); // Init with empty object on error
    } finally {
      setLoading(false);
    }
  }, [auth.user]); // Dépend de l'utilisateur

  useEffect(() => {
    // Lancer le fetch uniquement si l'état d'auth n'est plus en chargement
    if (!auth.loading) {
      fetchSettings();
    }
  }, [auth.loading, fetchSettings]);

  const reloadSettings = async () => {
    await fetchSettings();
  };

  const value = { settings, loading, error, reloadSettings };

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
  return context;
}; 