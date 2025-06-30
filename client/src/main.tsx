import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'

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
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
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
        <div style="padding: 20px; text-align: center; color: red;">
          <h2>Erreur d'initialisation de l'application</h2>
          <p>Veuillez recharger la page ou essayer en mode navigation normale.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">
            Recharger
          </button>
        </div>
      `;
    }
  }
};

// Démarrer l'application
initializeApp();
