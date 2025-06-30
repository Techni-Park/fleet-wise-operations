import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from 'sonner'

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

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" richColors />
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
