import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from 'sonner'

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

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[PWA] Service Worker enregistré:', registration.scope);
      
      // Écouter les mises à jour du SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Nouvelle version disponible');
              // Ici on pourrait afficher une notification à l'utilisateur
            }
          });
        }
      });
      
    } catch (error) {
      console.error('[PWA] Erreur enregistrement Service Worker:', error);
    }
  });
  
  // Écouter les messages du Service Worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[PWA] Message du Service Worker:', event.data);
    
    if (event.data.type === 'SYNC_COMPLETE') {
      console.log(`[PWA] Synchronisation terminée: ${event.data.entity}`);
      // Ici on pourrait rafraîchir les données de l'interface
    }
  });
}
