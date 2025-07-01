# 📋 Instructions de déploiement pour le système de chat

## 🔧 Modifications apportées pour le chat :

### 1. **Champs corrigés dans les requêtes ACTION :**
- `REPLY_TO` → `IDACTION_PREC` (pour les réponses)
- `TYPACT = 10` (obligatoire pour messages chat)
- `ID2GENRE_ACTION = 1` (obligatoire pour chat)
- `CLE_MACHINE_CIBLE = INTxxx` (au lieu de TRGCIBLE)

### 2. **Nouveaux endpoints API :**
- `GET /api/interventions/:id/chat` - Récupérer les messages
- `POST /api/interventions/:id/chat` - Créer un message

### 3. **Fichiers modifiés :**
- `server/storage.ts` - Nouvelles méthodes de chat
- `server/routes.ts` - Nouveaux endpoints
- `shared/schema.ts` - Correction du schéma ACTION
- `client/src/pages/InterventionDetails.tsx` - Interface chat

## 🚀 Étapes de déploiement :

### Sur votre serveur de production :

1. **Sauvegarder l'actuel :**
```bash
cp -r /var/www/fleet-wise-operations /var/www/fleet-wise-operations-backup-$(date +%Y%m%d)
```

2. **Mettre à jour le code :**
```bash
cd /var/www/fleet-wise-operations
git pull origin main
```

3. **Installer les dépendances :**
```bash
npm install
```

4. **Construire l'application :**
```bash
npm run build
```

5. **Redémarrer le serveur :**
```bash
pm2 restart fleet-wise-operations
# ou si vous utilisez systemd :
sudo systemctl restart fleet-wise-operations
```

6. **Vérifier les logs :**
```bash
pm2 logs fleet-wise-operations
# ou
tail -f /var/log/fleet-wise-operations/error.log
```

## 🔍 Vérification du déploiement :

Testez l'endpoint depuis le serveur de production :
```bash
curl -X POST "http://localhost:8900/api/interventions/3218/chat" \
  -H "Content-Type: application/json" \
  -d '{"LIB100":"Test production","COMMENTAIRE":"Test après déploiement","CDUSER":"WEB","CLE_MACHINE_CIBLE":"INT3218","IDACTION_PREC":0}'
```

## ⚠️ Problèmes possibles :

### Si l'erreur persiste, vérifiez :

1. **Structure de la base de données :**
```sql
DESCRIBE ACTION;
-- Vérifiez que les champs existent :
-- - CLE_MACHINE_CIBLE (varchar)
-- - IDACTION_PREC (int)
-- - TYPACT (int)
-- - ID2GENRE_ACTION (int)
```

2. **Permissions de fichiers :**
```bash
chown -R www-data:www-data /var/www/fleet-wise-operations
chmod -R 755 /var/www/fleet-wise-operations
```

3. **Variables d'environnement :**
Vérifiez que la connexion à la base de données est correcte.

## 📞 Support :
Si le problème persiste après le déploiement, partagez :
- Les logs d'erreur du serveur de production
- Le résultat de `DESCRIBE ACTION;` depuis la base de données
- La version Node.js utilisée en production 