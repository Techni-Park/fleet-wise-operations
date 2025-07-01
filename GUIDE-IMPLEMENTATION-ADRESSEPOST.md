# 🗺️ Guide d'Implémentation Géolocalisation ADRESSEPOST

## Vue d'ensemble

L'implémentation permet d'utiliser les adresses géolocalisées de la table `ADRESSEPOST` pour les interventions, avec un fallback sur `ADRINTER` si aucune adresse postale n'est définie.

## Logique de Géolocalisation

### Priorité des Adresses

1. **Priorité 1** : `Z83_INTERVENTION.IDADRLIEU` → `ADRESSEPOST`
   - Si `IDADRLIEU` existe et > 0
   - Utilise `ADRESSEPOST.ADRESSE1`, `ADRESSE2`, `VILLE`, `CPOSTAL`
   - Récupère `LATITUDE` et `LONGITUDE` si disponibles

2. **Priorité 2** : `Z83_INTERVENTION.ADRINTER`
   - Si pas d'`IDADRLIEU` ou `ADRESSEPOST` non trouvée
   - Utilise le champ texte libre `ADRINTER`
   - Nécessite géocodage externe (OpenStreetMap, Google Maps)

## Structure Base de Données

### Table ADRESSEPOST
```sql
CREATE TABLE `ADRESSEPOST` (
  `IDADRESSEPOST` bigint NOT NULL AUTO_INCREMENT,
  `XXIDCONTACT` int DEFAULT '0',
  `ID2GENRE_ADRESSE` tinyint UNSIGNED DEFAULT '0',
  `LIBDESC` varchar(50) DEFAULT '',
  `NOMFAMILLE` varchar(30) DEFAULT '',
  `PRENOM` varchar(20) DEFAULT '',
  `ADRESSE1` varchar(50) DEFAULT '',
  `ADRESSE2` varchar(50) DEFAULT '',
  `CPOSTAL` varchar(9) DEFAULT '',
  `VILLE` varchar(30) DEFAULT '',
  `CDPAYS` varchar(3) DEFAULT '',
  `LATITUDE` decimal(10,8) NULL,
  `LONGITUDE` decimal(11,8) NULL,
  `RAISON_SOCIALE` varchar(160) DEFAULT '',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`IDADRESSEPOST`)
);
```

### Table Z83_INTERVENTION
```sql
-- IDADRLIEU fait référence à ADRESSEPOST.IDADRESSEPOST
-- ADRINTER est utilisé en fallback
```

## Implémentation Technique

### Backend (server/storage.ts)

Les fonctions suivantes ont été modifiées pour inclure la logique ADRESSEPOST :

1. `getAllInterventions()` - Liste des interventions avec adresses
2. `getIntervention()` - Détail d'une intervention
3. `getInterventionsByVehicle()` - Interventions par véhicule

### Jointures SQL
```sql
LEFT JOIN Z83_INTERVENTION z83 ON i.IDINTERVENTION = z83.IDINTERVENTION
LEFT JOIN ADRESSEPOST ap ON z83.IDADRLIEU = ap.IDADRESSEPOST 
  AND z83.IDADRLIEU IS NOT NULL AND z83.IDADRLIEU > 0
```

### Champs Retournés
```sql
-- Adresse complète construite
CASE 
  WHEN ap.ADRESSE1 IS NOT NULL AND ap.ADRESSE1 != '' 
  THEN CONCAT(
    COALESCE(ap.ADRESSE1, ''),
    CASE WHEN ap.ADRESSE2 IS NOT NULL AND ap.ADRESSE2 != '' 
         THEN CONCAT(', ', ap.ADRESSE2) ELSE '' END
  )
  ELSE z83.ADRINTER 
END as ADRESSE_INTERVENTION_FULL

-- Coordonnées GPS
CASE 
  WHEN ap.LATITUDE IS NOT NULL AND ap.LONGITUDE IS NOT NULL 
       AND ap.LATITUDE != 0 AND ap.LONGITUDE != 0 
  THEN ap.LATITUDE 
  ELSE NULL 
END as latitude

CASE 
  WHEN ap.LATITUDE IS NOT NULL AND ap.LONGITUDE IS NOT NULL 
       AND ap.LATITUDE != 0 AND ap.LONGITUDE != 0 
  THEN ap.LONGITUDE 
  ELSE NULL 
END as longitude
```

## Installation

### 1. Créer la table ADRESSEPOST
```bash
# Exécuter le script SQL
mysql -h 85.31.239.121 -u gestinter_admin -p gestinter_test < create_adressepost_table.sql
```

### 2. Mettre à jour le schéma Drizzle
```typescript
// shared/schema.ts - déjà ajouté
export const adressePost = mysqlTable("ADRESSEPOST", {
  IDADRESSEPOST: bigint("IDADRESSEPOST", { mode: "number" }).primaryKey().autoincrement(),
  // ... autres champs
  LATITUDE: decimal("LATITUDE", { precision: 10, scale: 8 }),
  LONGITUDE: decimal("LONGITUDE", { precision: 11, scale: 8 }),
  // ...
});
```

### 3. Tester l'implémentation
```bash
# Démarrer le serveur
npm run dev

# Tester les endpoints
curl "http://localhost:5000/api/interventions?limit=5"
```

## Frontend (client/)

### Affichage des Adresses
Les composants suivants affichent maintenant les adresses ADRESSEPOST :

1. **Pages/Interventions.tsx** - Liste des interventions
2. **Pages/InterventionDetails.tsx** - Détail intervention
3. **Components/Maps/InterventionsMap.tsx** - Carte des interventions

### Champs Disponibles
```typescript
interface InterventionWithAddress {
  IDINTERVENTION: number;
  // ... autres champs intervention
  
  // Données ADRESSEPOST
  IDADRESSEPOST?: number;
  ADRESSEPOST_ADRESSE1?: string;
  ADRESSEPOST_ADRESSE2?: string;
  ADRESSEPOST_VILLE?: string;
  ADRESSEPOST_CPOSTAL?: string;
  ADRESSEPOST_LATITUDE?: number;
  ADRESSEPOST_LONGITUDE?: number;
  
  // Données Z83_INTERVENTION
  IDADRLIEU?: number;
  ADRINTER?: string;
  
  // Champs calculés
  ADRESSE_INTERVENTION_FULL?: string;
  latitude?: number;
  longitude?: number;
}
```

## Scripts de Test

### Test de la Logique
```bash
node scripts/test-adressepost-geocoding.js
```

Le script teste :
- ✅ Connexion base de données
- ✅ Existence des tables
- ✅ Logique de jointure
- ✅ API endpoints
- ✅ Génération de données de test

## Migration des Données

### Associer Interventions Existantes
```sql
-- Mettre à jour Z83_INTERVENTION avec IDADRLIEU
UPDATE Z83_INTERVENTION z83
JOIN INTERVENTION i ON z83.IDINTERVENTION = i.IDINTERVENTION
JOIN CONTACT c ON i.IDCONTACT = c.IDCONTACT
JOIN ADRESSEPOST ap ON c.IDCONTACT = ap.XXIDCONTACT
SET z83.IDADRLIEU = ap.IDADRESSEPOST
WHERE z83.IDADRLIEU IS NULL AND ap.IDADRESSEPOST IS NOT NULL;
```

### Géocoder les Adresses ADRINTER
```sql
-- Identifier les interventions sans IDADRLIEU
SELECT z83.IDINTERVENTION, z83.ADRINTER
FROM Z83_INTERVENTION z83
WHERE z83.IDADRLIEU IS NULL AND z83.ADRINTER IS NOT NULL;
```

## Cas d'Usage

### 1. Intervention avec ADRESSEPOST
```
Intervention #1234
├─ Z83_INTERVENTION.IDADRLIEU = 42
├─ ADRESSEPOST #42
│  ├─ ADRESSE1: "6 Rue Isaac Newton"
│  ├─ VILLE: "BESANCON"
│  ├─ CPOSTAL: "25000"
│  ├─ LATITUDE: 47.2480
│  └─ LONGITUDE: 6.0185
└─ Résultat: Adresse géolocalisée complète
```

### 2. Intervention avec ADRINTER
```
Intervention #1235
├─ Z83_INTERVENTION.IDADRLIEU = NULL
├─ Z83_INTERVENTION.ADRINTER = "123 Rue de la Paix, Paris"
└─ Résultat: Géocodage OpenStreetMap nécessaire
```

### 3. Intervention sans adresse
```
Intervention #1236
├─ Z83_INTERVENTION.IDADRLIEU = NULL
├─ Z83_INTERVENTION.ADRINTER = NULL
└─ Résultat: Pas d'adresse disponible
```

## Avantages de l'Implémentation

### ✅ Performance
- Pas de géocodage en temps réel pour les adresses ADRESSEPOST
- Coordonnées GPS pré-calculées

### ✅ Fiabilité
- Adresses vérifiées et standardisées
- Fallback automatique sur ADRINTER

### ✅ Flexibilité
- Support des deux types d'adresses
- Migration progressive possible

### ✅ Maintenance
- Données centralisées dans ADRESSEPOST
- Réutilisation pour contacts/clients

## Prochaines Étapes

1. **Migration complète** : Associer toutes les interventions existantes
2. **Interface admin** : Gestion des adresses ADRESSEPOST
3. **Géocodage automatique** : Script pour géocoder ADRINTER
4. **Optimisation** : Index sur les jointures fréquentes
5. **Monitoring** : Alertes sur adresses manquantes 