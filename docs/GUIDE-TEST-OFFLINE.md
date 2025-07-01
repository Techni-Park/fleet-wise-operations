# 🔌 Guide Pratique - Test Mode Hors Ligne

## 🚀 Démarrage Rapide

```bash
# 1. Tester les composants offline
npm run pwa:test-offline

# 2. Démarrer le serveur
npm start

# 3. Naviguer vers http://localhost:5000
```

---

## 📱 **Méthode 1 : DevTools Chrome (Recommandée)**

### **Étape 1 - Préparation**
1. **Ouvrir Chrome/Edge** sur `http://localhost:5000`
2. **Se connecter** avec :
   - Email : `dev@techni-park.com`  
   - Mot de passe : `DEV`
3. **Naviguer** dans l'application (visiter quelques pages)

### **Étape 2 - Activation Mode Offline**
1. **Ouvrir DevTools** (`F12`)
2. **Onglet Application** → **Service Workers**
3. **Cocher "Offline"** ✅
4. **Recharger la page** (`Ctrl+R`)

### **Résultat Attendu**
- ✅ Page offline.html s'affiche
- ✅ Message "Fleet Wise Operations continue de fonctionner"
- ✅ Liste des fonctionnalités disponibles
- ✅ Bouton "Réessayer la connexion"

---

## 🌐 **Méthode 2 : Simulation Réseau**

### **Via DevTools Network**
1. **DevTools** (`F12`) → **Onglet Network**
2. **Menu déroulant** "No throttling" → **Sélectionner "Offline"**
3. **Recharger** la page
4. **Naviguer** dans l'app

### **Via Windows (Test Physique)**
1. **Désactiver WiFi/Ethernet** sur l'ordinateur
2. **Ouvrir la PWA installée**
3. **Utiliser l'application**

---

## 🧪 **Tests Spécifiques à Effectuer**

### **Test 1 : Navigation Offline**
```bash
✅ Actions à tester :
- Recharger la page → Page offline.html
- Cliquer sur liens → Navigation limitée  
- Utiliser le menu → Fonctions essentielles disponibles
```

### **Test 2 : Authentification Offline**
```bash
🔐 Étapes :
1. Mode offline activé (DevTools)
2. Se déconnecter (si connecté)
3. Tenter de se reconnecter
4. Vérifier le message d'erreur

✅ Résultat attendu :
"Connexion internet requise pour s'authentifier"
```

### **Test 3 : Cache des Données**
```bash
📊 Étapes :
1. Mode online : Consulter interventions/véhicules
2. Passer en mode offline (DevTools)
3. Naviguer vers les mêmes pages
4. Vérifier les données affichées

✅ Résultat attendu :
- Données précédemment consultées s'affichent
- Nouvelles requêtes échouent gracieusement
```

### **Test 4 : Service Worker Logs**
```bash
🔍 Console DevTools - Logs à surveiller :
[SW] Service Worker chargé - Auth URLs exclus du cache
[SW] Requête API échouée, tentative cache: /api/...
[SW] Données trouvées en cache pour: /api/...
[PWA] Mode offline détecté
```

---

## 📸 **Test Fonctionnalités PWA Offline**

### **Capture Photos Hors Ligne**
```bash
📷 Test :
1. Mode offline activé
2. Aller dans une intervention
3. Prendre une photo
4. Vérifier stockage local (IndexedDB)

💾 Vérification IndexedDB :
DevTools → Application → Storage → IndexedDB → FleetWisePWA
```

### **Stockage Local**
```bash
🗄️ Données disponibles offline :
- Interventions consultées récemment
- Photos prises
- Signatures ajoutées  
- Données véhicules en cache
```

---

## 🔄 **Test Synchronisation**

### **Mode Online → Offline → Online**
```bash
🔄 Scenario :
1. Connecté : Prendre photo, modifier intervention
2. Offline : Continuer à utiliser l'app 
3. Reconnecté : Vérifier sync automatique

✅ Résultat :
- Données synchronisées automatiquement
- Pas de perte de données
- Notifications de sync dans les logs
```

---

## 🛠️ **Dépannage**

### **Service Worker ne fonctionne pas**
```bash
🔧 Solutions :
1. Vider le cache : DevTools → Application → Clear Storage
2. Désinscrire SW : Application → Service Workers → Unregister
3. Recharger l'app : Ctrl+Shift+R (rechargement forcé)
4. Reconstruire : npm run pwa:update-sw
```

### **Page offline ne s'affiche pas**
```bash
🔧 Vérifications :
1. Fichier client/public/offline.html existe
2. Service Worker enregistré et actif
3. Mode offline réellement activé (DevTools)
4. Cache vidé et rechargé
```

### **Données non mises en cache**
```bash
🔧 Causes possibles :
1. Requêtes POST/PUT non mises en cache (normal)
2. URLs d'authentification exclues (normal)
3. Erreurs 4xx/5xx non cachées (normal)
4. Cache plein → vider le stockage
```

---

## 📊 **Vérification du Cache**

### **Via DevTools**
```bash
🔍 DevTools → Application :
- Cache Storage : Contenu mis en cache
- IndexedDB : Données applicatives
- Service Worker : État et logs
- Network : Requêtes interceptées
```

### **Via Console JavaScript**
```javascript
// Vérifier le cache programmatiquement
caches.keys().then(console.log);
navigator.serviceWorker.ready.then(reg => console.log('SW ready:', reg));
```

---

## 🎯 **Critères de Réussite**

### **✅ Mode Offline Fonctionnel Si :**
- Page offline.html s'affiche en mode déconnecté
- Données précédemment consultées restent accessibles  
- Photos peuvent être prises et stockées localement
- Messages d'erreur appropriés pour actions impossibles offline
- Synchronisation automatique au retour online
- Service Worker intercepte et gère les requêtes correctement

### **📋 Checklist Finale :**
- [ ] Page offline personnalisée affichée
- [ ] Navigation limitée mais fonctionnelle
- [ ] Cache des données consultées
- [ ] Gestion authentification offline
- [ ] Stockage local des médias
- [ ] Synchronisation au retour online
- [ ] Messages utilisateur appropriés
- [ ] Service Worker actif et fonctionnel

---

## 📞 **Commandes Utiles**

```bash
# Test complet offline
npm run pwa:test-offline

# Vérifier les endpoints PWA  
curl http://localhost:5000/api/pwa/test

# Reconstruire avec mise à jour SW
npm run pwa:update-sw

# Test authentification
npm run pwa:test-auth
```

---

🎉 **Votre PWA Fleet Wise Operations est maintenant testable en mode hors ligne !** 