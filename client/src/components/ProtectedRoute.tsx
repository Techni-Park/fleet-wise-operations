import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuthStatus } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Composant ProtectedRoute simple et efficace
 * Vérifie l'authentification directement via API
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated } = await checkAuthStatus();
      setIsAuthenticated(isAuthenticated);
    };

    verifyAuth();
  }, []);

  // Affichage du loading pendant la vérification
  if (isAuthenticated === null) {
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
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si authentifié, afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute;
