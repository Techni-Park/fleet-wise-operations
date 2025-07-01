import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Hook sécurisé pour utiliser le contexte d'auth
const useSafeAuth = () => {
  try {
    // Import dynamique du hook pour éviter les erreurs de timing
    const { useAuth } = require('../context/AuthContext');
    return useAuth();
  } catch (error) {
    console.error('[ProtectedRoute] Erreur import/utilisation AuthContext:', error);
    return null;
  }
};

/**
 * Composant ProtectedRoute avec gestion ultra-sécurisée du contexte
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Utilisation du hook sécurisé
  const auth = useSafeAuth();
  
  // Si le contexte n'est pas disponible du tout
  if (!auth) {
    console.warn('[ProtectedRoute] Contexte AuthProvider non disponible - redirection vers login');
    return <Navigate to="/login" state={{ from: location, error: 'Auth context not available' }} replace />;
  }
  
  const { user, loading } = auth;

  // Affichage du loading pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si authentifié, afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute;
