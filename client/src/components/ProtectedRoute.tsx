import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Composant ProtectedRoute avec gestion sécurisée du contexte d'authentification
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  try {
    const { user, loading } = useAuth();

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
    
  } catch (error) {
    // Si le contexte AuthProvider n'est pas disponible
    console.error('[ProtectedRoute] Erreur contexte AuthProvider:', error);
    return <Navigate to="/login" state={{ from: location, error: 'Auth context not available' }} replace />;
  }
};

export default ProtectedRoute;
