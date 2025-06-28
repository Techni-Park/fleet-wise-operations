@echo off
echo 🎨 Création des icônes PWA manquantes...

REM Créer le dossier icons s'il n'existe pas
if not exist "client\public\icons" mkdir "client\public\icons"

REM Copier le favicon pour toutes les tailles (temporaire)
copy "client\public\favicon.ico" "client\public\icons\icon-72.png" >nul
copy "client\public\favicon.ico" "client\public\icons\icon-96.png" >nul  
copy "client\public\favicon.ico" "client\public\icons\icon-128.png" >nul
copy "client\public\favicon.ico" "client\public\icons\icon-144.png" >nul
copy "client\public\favicon.ico" "client\public\icons\icon-152.png" >nul
copy "client\public\favicon.ico" "client\public\icons\icon-192.png" >nul
copy "client\public\favicon.ico" "client\public\icons\icon-384.png" >nul
copy "client\public\favicon.ico" "client\public\icons\icon-512.png" >nul

REM Créer les icônes de raccourcis
copy "client\public\favicon.ico" "client\public\icons\shortcut-add.png" >nul
copy "client\public\favicon.ico" "client\public\icons\shortcut-list.png" >nul
copy "client\public\favicon.ico" "client\public\icons\shortcut-offline.png" >nul

echo ✅ Icônes PWA créées avec succès !
echo 📁 Emplacement : client\public\icons\
echo 🔄 Redémarrer le serveur : npm start

dir "client\public\icons" /b
echo.
echo 💡 Note: Ce sont des icônes temporaires (favicon.ico)
echo    Pour de vraies icônes, utilisez un générateur PWA icon
echo.
echo 🌐 Testez maintenant : http://localhost:5000 