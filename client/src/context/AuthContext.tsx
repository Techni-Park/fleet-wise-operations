import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { autoSync, SyncResult } from '../services/autoSync';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  CDUSER: string;
  active: number;
  // Potentiellement d'autres champs de la jointure
  IDUSER?: number;
  NOMFAMILLE?: string;
  PRENOM?: string;
  IADMIN?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPreloading: boolean;
  preloadResults: SyncResult[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getAutoSyncStatus: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadResults, setPreloadResults] = useState<SyncResult[]>([]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log('[Auth] Vérification de l\'état de connexion...');
        
        const response = await fetch('/api/current-user', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          },
          mode: 'same-origin'
        });
        
        console.log('[Auth] Réponse current-user:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('[Auth] Utilisateur connecté:', userData.EMAILP || userData.email);
          setUser(userData);
        } else {
          console.log('[Auth] Utilisateur non connecté');
          setUser(null);
        }
      } catch (error) {
        console.error('[Auth] Erreur vérification connexion:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('[Auth] Tentative de connexion pour:', email);
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        mode: 'same-origin',
        body: JSON.stringify({ email, password }),
      });

      console.log('[Auth] Réponse login:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('[Auth] Connexion réussie pour:', userData.EMAILP || userData.email);
        setUser(userData);
        
        // Déclencher le pré-chargement des données essentielles
        performPreload(userData.CDUSER || userData.email);
        
        setLoading(false);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('[Auth] Erreur login:', errorData);
        setLoading(false);
        
        // Gestion spécifique des erreurs PWA offline
        if (errorData.offline) {
          return { success: false, error: 'Connexion internet requise pour s\'authentifier' };
        }
        
        return { success: false, error: errorData.message || 'Email ou mot de passe incorrect' };
      }
    } catch (error) {
      console.error('[Auth] Erreur réseau login:', error);
      setLoading(false);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const performPreload = async (userId: string) => {
    try {
      setIsPreloading(true);
      console.log('[Auth] Début du pré-chargement pour:', userId);
      
      const results = await autoSync.preloadEssentialData(userId);
      setPreloadResults(results);
      
      console.log('[Auth] Pré-chargement terminé:', results.length, 'entités');
    } catch (error) {
      console.error('[Auth] Erreur pré-chargement:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  const logout = async () => {
    try {
      // Arrêter la synchronisation en arrière-plan
      autoSync.stopBackgroundSync();
      
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setPreloadResults([]);
    }
  };

  const getAutoSyncStatus = async () => {
    return await autoSync.getStatus();
  };

  const value = { user, loading, isPreloading, preloadResults, login, logout, getAutoSyncStatus };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider');
  }
  return context;
};
