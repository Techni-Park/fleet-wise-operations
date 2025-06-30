# 🔧 Guide de Test - Système de Pré-chargement PWA

## 🚀 **Étape 1 : Démarrage et vérification**

### Lancer l'application
```bash
npm run dev
```

### Vérifier les logs de démarrage
1. **Ouvrir la console** (F12 > Console)
2. **Rechercher les logs** :
   ```
   [AutoSync] Service de synchronisation automatique initialisé
   [OfflineStorage] IndexedDB initialisé
   [SW] Service Worker chargé - Auth URLs exclus du cache
   ```

## 🔍 **Étape 2 : Test du pré-chargement automatique**

### Test de connexion avec pré-chargement
1. **Se connecter** à l'application
2. **Observer la console** pour :
   ```
   [Auth] Début du pré-chargement pour: [votre_utilisateur]
   [AutoSync] Véhicules pré-chargés: XX
   [AutoSync] Contacts pré-chargés: XX
   [AutoSync] Anomalies pré-chargées: XX
   [Auth] Pré-chargement terminé: X entités
   ```

### Vérifier l'indicateur de statut
- **En-tête** : Badge "Synchronisation..." puis "Synchronisé" 🟢
- **Tooltip** : Affichage des détails de stockage et sync

### Inspecter IndexedDB
1. **F12 > Application > Storage > IndexedDB**
2. **Vérifier la base** `FleetTechPWA` avec :
   - Store `cache` : Données véhicules, contacts, anomalies
   - Timestamps récents

## 📱 **Étape 3 : Test des paramètres PWA**

### Accéder aux paramètres
1. **Navigation** : Aller à `/pwa-settings` ou créer le lien
2. **Vérifier l'affichage** :
   - Statut PWA (en ligne, stockage, dernière sync)
   - Configuration du pré-chargement
   - Composant Mode Voyage

### Tester la configuration
1. **Modifier les paramètres** :
   - Désactiver/réactiver le pré-chargement
   - Changer les limites (véhicules, contacts)
   - Modifier l'intervalle de sync
2. **Sauvegarder** et vérifier les messages toast
3. **Vérifier la persistance** : Rafraîchir la page

## 🗺️ **Étape 4 : Test du mode voyage**

### Configuration du mode voyage
1. **Dans PWA Settings > Mode Voyage** :
   - Saisir des IDs de véhicules : `1, 2, 3`
   - Optionnel : IDs de contacts : `10, 20`
   - Cliquer "Détecter GPS" (autoriser la géolocalisation)

### Activation
1. **Cliquer "Activer le mode voyage"**
2. **Observer les logs** :
   ```
   [AutoSync] Activation mode voyage: {...}
   [AutoSync] Mode voyage activé avec succès
   ```
3. **Vérifier IndexedDB** : Nouvelles entrées `vehicle_X`, `contact_X`

## 🌐 **Étape 5 : Test hors ligne**

### Simulation mode offline
1. **F12 > Network > Throttling > Offline**
2. **Ou désactiver WiFi/réseau**

### Vérifier les fonctionnalités
1. **Navigation** : L'app reste fonctionnelle
2. **Fiches véhicules** : 
   - Accéder aux véhicules pré-chargés ✅
   - Tenter d'accéder à un véhicule non pré-chargé ❌
3. **Créer intervention** : Doit fonctionner et stocker en local
4. **Capture photo** : Avec GPS si géolocalisation activée

### Vérifier l'indicateur
- Badge "Hors ligne" 🔴 dans l'en-tête
- Tooltip affiche status offline

## 🔄 **Étape 6 : Test de synchronisation**

### Retour en ligne
1. **Réactiver la connexion**
2. **Observer la synchronisation automatique** :
   ```
   [AutoSync] Synchronisation automatique...
   [SW] Synchronisation réussie
   ```

### Test synchronisation manuelle
1. **PWA Settings > "Pré-charger maintenant"**
2. **Vérifier les résultats** affichés
3. **Toast de confirmation**

### Test synchronisation background
1. **Attendre l'intervalle configuré** (ou réduire pour test)
2. **Observer les logs automatiques**

## 🔧 **Étape 7 : Tests avancés**

### Test du Service Worker
1. **Console > Application > Service Workers**
2. **Vérifier** :
   - SW actif et en cours d'exécution
   - Événements sync enregistrés
3. **Test** : `navigator.serviceWorker.ready.then(reg => reg.sync.register('sync-interventions'))`

### Test des endpoints backend
```bash
# Test direct des endpoints
curl http://localhost:5000/api/pwa/test
curl http://localhost:5000/api/pwa/cache/vehicles?limit=5
curl http://localhost:5000/api/pwa/cache/geography?lat=45.764&lng=4.836&radius=25
```

### Stress test stockage
1. **Augmenter les limites** : 500 véhicules, 200 contacts
2. **Activer mode voyage** avec plusieurs véhicules
3. **Vérifier performance** et utilisation mémoire

## 📊 **Étape 8 : Validation complète**

### Scénario complet utilisateur
1. **Matin** :
   - Connexion → Pré-chargement automatique
   - Vérification des véhicules à visiter
   - Activation mode voyage avec IDs spécifiques

2. **Terrain** :
   - Passage hors ligne
   - Consultation fiches véhicules
   - Création interventions
   - Capture photos GPS

3. **Retour** :
   - Retour en ligne
   - Synchronisation automatique
   - Vérification données serveur

### Métriques à vérifier
- ✅ **Temps de pré-chargement** : < 30 secondes
- ✅ **Fiches disponibles offline** : Toutes les pré-chargées
- ✅ **Interventions créées offline** : Sauvées dans IndexedDB
- ✅ **Synchronisation** : Automatique au retour en ligne
- ✅ **Stockage** : Optimisé selon configuration

## 🚨 **Résolution de problèmes**

### Erreurs communes
1. **"IndexedDB non initialisé"** :
   - Vérifier compatibilité navigateur
   - Rafraîchir la page

2. **"Erreur HTTP endpoints"** :
   - Vérifier serveur backend démarré
   - Contrôler authentification

3. **"Pré-chargement bloqué"** :
   - Vérifier connexion internet
   - Contrôler logs console pour erreurs spécifiques

### Débogage avancé
```javascript
// Console pour vérifier état autoSync
await autoSync.getStatus()

// Vérifier configuration
await autoSync.getPreloadConfig()

// Forcer nettoyage pour reset
await offlineStorage.clearAllData()
```

## ✅ **Checklist de validation**

- [ ] Application démarre sans erreur
- [ ] Pré-chargement automatique au login
- [ ] Indicateur de statut fonctionnel
- [ ] Paramètres PWA accessibles et fonctionnels
- [ ] Mode voyage opérationnel
- [ ] Fonctionnement hors ligne complet
- [ ] Synchronisation automatique
- [ ] Performance acceptable
- [ ] Stockage optimisé
- [ ] Endpoints backend répondent
- [ ] Service Worker actif
- [ ] IndexedDB peuplé correctement

🎉 **Si tous les tests passent, votre système de pré-chargement PWA est opérationnel !** 