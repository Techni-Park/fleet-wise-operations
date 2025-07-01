-- Script de création des tables pour les formulaires personnalisés
-- À exécuter dans MySQL

-- Table forms pour stocker les métadonnées des formulaires personnalisés
CREATE TABLE `forms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_general_ci,
  `entity_type_id` bigint NOT NULL COMMENT '1=véhicule, 3=intervention, etc.',
  `is_active` tinyint NOT NULL DEFAULT '1' COMMENT '1=actif, 0=inactif',
  `created_by` varchar(10) COLLATE utf8mb4_general_ci DEFAULT 'WEB',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_forms_entity_type` (`entity_type_id`),
  KEY `idx_forms_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table forms_fields pour stocker les champs des formulaires
CREATE TABLE `forms_fields` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `idforms` bigint NOT NULL COMMENT 'Référence vers forms.id',
  `nom` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('text','email','number','date','datetime','textarea','select','radio','checkbox','switch','file') COLLATE utf8mb4_general_ci NOT NULL,
  `taille` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'medium' COMMENT 'small, medium, large, full',
  `obligatoire` tinyint NOT NULL DEFAULT '0',
  `ordre` int NOT NULL DEFAULT '0',
  `groupe` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'General' COMMENT 'Nom du groupe',
  `ordre_groupe` int NOT NULL DEFAULT '0',
  `options` json DEFAULT NULL COMMENT 'Pour select/radio: {values: [{value, label}]}, placeholder, etc.',
  `validation` json DEFAULT NULL COMMENT 'Règles de validation: {min, max, pattern, required, etc.}',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_forms_fields_idforms` (`idforms`),
  KEY `idx_forms_fields_ordre` (`ordre`),
  KEY `idx_forms_fields_groupe` (`groupe`),
  CONSTRAINT `fk_forms_fields_idforms` FOREIGN KEY (`idforms`) REFERENCES `forms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table forms_fields_values pour stocker les valeurs des formulaires remplis
CREATE TABLE `forms_fields_values` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `forms_field_id` bigint NOT NULL COMMENT 'Référence vers forms_fields.id',
  `entity_id` bigint NOT NULL COMMENT 'ID de l\'entité (intervention, véhicule, etc.)',
  `valeur` longtext COLLATE utf8mb4_general_ci,
  `created_by` varchar(10) COLLATE utf8mb4_general_ci DEFAULT 'WEB',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_forms_fields_values_field_id` (`forms_field_id`),
  KEY `idx_forms_fields_values_entity_id` (`entity_id`),
  KEY `idx_forms_fields_values_composite` (`forms_field_id`, `entity_id`),
  CONSTRAINT `fk_forms_fields_values_field_id` FOREIGN KEY (`forms_field_id`) REFERENCES `forms_fields` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Ajout d'un formulaire d'exemple pour les interventions
INSERT INTO `forms` (`nom`, `description`, `entity_type_id`, `is_active`, `created_by`) VALUES
('Rapport d\'intervention standard', 'Formulaire standard pour le rapport d\'intervention', 3, 1, 'ADMIN');

-- Ajout de quelques champs d'exemple
SET @form_id = LAST_INSERT_ID();

INSERT INTO `forms_fields` (`idforms`, `nom`, `label`, `type`, `taille`, `obligatoire`, `ordre`, `groupe`, `ordre_groupe`, `options`) VALUES
(@form_id, 'etat_general', 'État général du matériel', 'select', 'medium', 1, 1, 'Diagnostic', 1, '{"values": [{"value": "excellent", "label": "Excellent"}, {"value": "bon", "label": "Bon"}, {"value": "moyen", "label": "Moyen"}, {"value": "mauvais", "label": "Mauvais"}]}'),
(@form_id, 'duree_intervention', 'Durée d\'intervention (heures)', 'number', 'small', 1, 2, 'Diagnostic', 1, '{"placeholder": "Ex: 2.5", "min": 0, "max": 24, "step": 0.5}'),
(@form_id, 'problemes_detectes', 'Problèmes détectés', 'textarea', 'large', 0, 3, 'Diagnostic', 1, '{"placeholder": "Décrivez les problèmes identifiés..."}'),
(@form_id, 'pieces_remplacees', 'Pièces remplacées', 'textarea', 'medium', 0, 1, 'Travaux effectués', 2, '{"placeholder": "Liste des pièces..."}'),
(@form_id, 'operations_effectuees', 'Opérations effectuées', 'textarea', 'large', 1, 2, 'Travaux effectués', 2, '{"placeholder": "Détail des opérations..."}'),
(@form_id, 'client_present', 'Client présent lors de l\'intervention', 'switch', 'medium', 0, 1, 'Informations client', 3, '{}'),
(@form_id, 'signature_client', 'Signature client requise', 'checkbox', 'medium', 0, 2, 'Informations client', 3, '{}'),
(@form_id, 'recommandations', 'Recommandations', 'textarea', 'large', 0, 3, 'Informations client', 3, '{"placeholder": "Recommandations pour le client..."}'); 