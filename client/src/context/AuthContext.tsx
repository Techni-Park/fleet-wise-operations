import { createContext, useContext, ReactNode } from 'react';

interface User {
  // Données de la table USER
  IDUSER: number;
  EMAILP: string;
  NOMFAMILLE: string;
  PRENOM: string;
  CDUSER: string;
  IADMIN: number;
  IAUTORISE: number;
  FONCTION_PRO?: string;
  TELBUR?: string;
  PASSWORD?: string; // Présent mais ne sera jamais exposé côté client
}

interface AuthContextType {
  user: User | null;
}

// Contexte minimal
const AuthContext = createContext<AuthContextType>({ user: null });

// Provider très simple - juste pour éviter les erreurs de contexte
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: null }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook simple qui ne fait que retourner la valeur du contexte
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

// ===== FONCTIONS UTILITAIRES SIMPLES =====

// Vérifier si l'utilisateur est connecté (simple check API)
export const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
  try {
    const response = await fetch('/api/current-user', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      const userData = await response.json();
      return { isAuthenticated: true, user: userData };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('Erreur lors de la vérification d\'authentification:', error);
    return { isAuthenticated: false };
  }
};

// Login avec email et password de la table USER
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      return { success: true, user: userData };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || 'Email ou mot de passe incorrect' };
    }
  } catch (error) {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
};

// Logout simple
export const logoutUser = async (): Promise<void> => {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
