import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from "react-error-boundary";
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'

// Composant d'erreur pour ErrorBoundary principal
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
      <h2 className="text-xl font-semibold text-red-600">Erreur critique de l'application</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {error.message || 'Une erreur inattendue s\'est produite'}
      </p>
      <details className="text-xs text-gray-500 cursor-pointer">
        <summary>Détails techniques</summary>
        <pre className="mt-2 text-left overflow-auto max-h-32">
          {error.stack}
        </pre>
      </details>
      <div className="space-y-2">
        <button 
          onClick={resetErrorBoundary}
          className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Recharger la page
        </button>
      </div>
    </div>
  </div>
);

// Fonction d'enregistrement du Service Worker
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker non supporté');
    return;
  }

  // En développement, désactiver le SW si problèmes
  const isDev = import.meta.env.DEV;
  if (isDev && window.location.search.includes('no-sw')) {
    console.log('[PWA] Service Worker désactivé en mode dev');
    return;
  }

  try {
    console.log('[PWA] Enregistrement du Service Worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('[PWA] Service Worker enregistré:', registration.scope);
    
    // Gestion des mises à jour du Service Worker
    registration.addEventListener('updatefound', () => {
      console.log('[PWA] Nouvelle version du Service Worker détectée');
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] Nouvelle version prête - rechargement recommandé');
            
            // Optionnel : notifier l'utilisateur qu'une mise à jour est disponible
            if (confirm('Une nouvelle version est disponible. Recharger maintenant ?')) {
              window.location.reload();
            }
          }
        });
      }
    });
    
    // Vérifier les mises à jour périodiquement (seulement en production)
    if (!isDev) {
      setInterval(() => {
        registration.update().catch(console.error);
      }, 60000); // Vérifier toutes les minutes
    }
    
  } catch (error) {
    console.error('[PWA] Erreur enregistrement Service Worker:', error);
  }
};

// Écouter les messages du Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[PWA] Message du Service Worker:', event.data);
  });
}

// Fonction pour vérifier si on est en mode incognito
const detectIncognito = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Test pour Chrome/Edge
    if ('webkitRequestFileSystem' in window) {
      (window as any).webkitRequestFileSystem(
        0,
        1,
        () => resolve(false),
        () => resolve(true)
      );
    }
    // Test pour Firefox
    else if ('MozAppearance' in document.documentElement.style) {
      const db = indexedDB.open('test');
      db.onerror = () => resolve(true);
      db.onsuccess = () => resolve(false);
    }
    // Fallback
    else {
      resolve(false);
    }
  });
};

// Fonction d'initialisation sécurisée
const initializeApp = async () => {
  try {
    const isIncognito = await detectIncognito();
    if (isIncognito) {
      console.warn('[PWA] Mode incognito détecté - certaines fonctionnalités peuvent être limitées');
    }

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onError={(error, errorInfo) => {
            console.error('[Main] ErrorBoundary caught an error:', error, errorInfo);
          }}
          onReset={() => {
            console.log('[Main] ErrorBoundary reset - reloading page');
            window.location.reload();
          }}
        >
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
        </ErrorBoundary>
  </React.StrictMode>
);

    // Enregistrer le Service Worker après que React soit monté (seulement en production)
    if (import.meta.env.PROD) {
      setTimeout(() => {
        registerServiceWorker();
      }, 2000); // Délai pour laisser React s'initialiser complètement
    } else {
      console.log('[PWA] Service Worker désactivé en mode développement - pour l\'activer: ajoutez ?sw à l\'URL');
      
      // Activer le SW en dev seulement si demandé explicitement
      if (window.location.search.includes('?sw') || window.location.search.includes('&sw')) {
        setTimeout(() => {
          registerServiceWorker();
        }, 3000);
      }
    }

  } catch (error) {
    console.error('[App] Erreur d\'initialisation:', error);
    
    // Fallback d'urgence
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: red; font-family: Arial, sans-serif;">
          <h2>Erreur d'initialisation de l'application</h2>
          <p>Une erreur critique s'est produite lors du démarrage de l'application.</p>
          <p style="font-size: 14px; color: #666; margin: 10px 0;">
            Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}
          </p>
          <div style="margin-top: 20px;">
            <button onclick="window.location.reload()" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Recharger
            </button>
            <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="padding: 10px 20px; margin: 5px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Vider le cache et recharger
            </button>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            Si le problème persiste, essayez en mode navigation privée ou contactez le support.
          </p>
        </div>
      `;
    }
  }
};

// Démarrer l'application
initializeApp();
