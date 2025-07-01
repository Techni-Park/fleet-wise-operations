-- ================================================================
-- TABLES PWA POUR FONCTIONNALITÉS OFFLINE
-- ================================================================

-- Table pour stocker les médias (photos, signatures, documents)
CREATE TABLE `INTERVENTION_MEDIA` (
  `ID` bigint PRIMARY KEY AUTO_INCREMENT,
  `IDINTERVENTION` bigint NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `ORIGINAL_NAME` varchar(255),
  `FILE_PATH` varchar(500), -- Chemin VPS: /uploads/interventions/2024/12/
  `MIMETYPE` varchar(100),
  `SIZE` bigint,
  `TYPE` enum('photo','signature','document') NOT NULL,
  `DESCRIPTION` text,
  `GPS_LATITUDE` decimal(10,8),
  `GPS_LONGITUDE` decimal(11,8),
  `TAKEN_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `CDUSER` varchar(10),
  `CREATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `UPDATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_media_intervention` (`IDINTERVENTION`),
  INDEX `idx_media_type` (`TYPE`),
  INDEX `idx_media_user` (`CDUSER`)
);

-- Table pour la synchronisation offline
CREATE TABLE `INTERVENTION_SYNC` (
  `ID` bigint PRIMARY KEY AUTO_INCREMENT,
  `IDINTERVENTION` bigint NOT NULL,
  `SYNC_STATUS` enum('pending','synced','error') DEFAULT 'pending',
  `OFFLINE_DATA` longtext, -- JSON des données modifiées offline
  `ERROR_MESSAGE` text,
  `LAST_SYNC` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `CDUSER` varchar(10),
  `CREATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `UPDATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `unique_intervention_user` (`IDINTERVENTION`, `CDUSER`),
  INDEX `idx_sync_status` (`SYNC_STATUS`),
  INDEX `idx_sync_user` (`CDUSER`)
);

-- Table pour stocker les données offline des techniciens
CREATE TABLE `PWA_OFFLINE_CACHE` (
  `ID` bigint PRIMARY KEY AUTO_INCREMENT,
  `CDUSER` varchar(10) NOT NULL,
  `CACHE_KEY` varchar(255) NOT NULL,
  `CACHE_DATA` longtext NOT NULL, -- JSON des données cachées
  `EXPIRES_AT` datetime(3),
  `CREATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `UPDATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `unique_user_cache` (`CDUSER`, `CACHE_KEY`),
  INDEX `idx_cache_expiry` (`EXPIRES_AT`)
);

-- Table pour les paramètres PWA par utilisateur
CREATE TABLE `PWA_SETTINGS` (
  `ID` bigint PRIMARY KEY AUTO_INCREMENT,
  `CDUSER` varchar(10) NOT NULL UNIQUE,
  `PUSH_NOTIFICATIONS` tinyint(1) DEFAULT 1,
  `OFFLINE_SYNC_INTERVAL` int DEFAULT 300, -- secondes
  `AUTO_PHOTO_UPLOAD` tinyint(1) DEFAULT 1,
  `GPS_TRACKING` tinyint(1) DEFAULT 1,
  `SETTINGS_JSON` json,
  `CREATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `UPDATED_AT` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
); 