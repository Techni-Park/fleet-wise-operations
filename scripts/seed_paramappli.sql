-- Ce script insère une ligne de configuration par défaut dans la table PARAMAPPLI.
-- Assurez-vous que cette table est vide avant d'exécuter ce script pour éviter les doublons.
-- Les valeurs fournies sont des exemples et peuvent être adaptées à vos besoins.

INSERT INTO `PARAMAPPLI` (
  `IDPARAMAPPLI`, `RAISON_SOCIALE`, `US_RESP`, `TYP_UTILISATION`, `ADRESSE`, `CDREGION`, `CPOSTAL`, `VILLE`, `CDPAYS`, 
  `WEBSITE`, `EMAIL`, `SIRET`, `TEL1`, `TYPTEL1`, `TEL2`, `TYPTEL2`, `TEL3`, `TYPTEL3`, `STATUT_SOCIAL`, `NUM_TVA`, 
  `RCS`, `DT_IMMAT`, `CODE_APE`, `COMPTE_BQ_PRINC`, `INONASS_TVA`, `MTT_CAPITAL`, `IAUTOENTREP`, `LIB_NONASS`, 
  `MODE_TVA`, `ITAX_CANADA`, `TXTAX_CANADA`, `DT_PREMEXERCICE`, `TX_FRAIS_GENERAUX`, `PRIVIL_PGMEXTERNE`, 
  `PRIVIL_EXPORT`, `TYPDONNEES_CONTACT`,`CD_LANG`, `CD_DEVISE`, `DHCRE`, `USCRE`, `DHMOD`, `USMOD`) 
  VALUES (
  1, 
  'FleetTracker Pro', 
  'ADM', 
  1, 
  '123 Rue de la Flotte', 
  'IDF', 
  '75001', 
  'Paris', 
  'FRA', 
  'https://www.fleettrackerpro.com', 
  'contact@fleettracker.com', 
  '12345678901234', 
  '0102030405', 
  1, NULL, 0, NULL, 0, 
  'SAS', 
  'FR12345678901', 
  'Paris B 123 456 789', 
  '2023-01-01', 
  '6202A', 
  'FR7630001007941234567890185', 
  0, 
  10000, 
  0, 
  '', 
  1, 0, 0.0, '2023-01-01', 0.0, 
  0,1,1,1, -- CD_LANG (1 for French, assuming an ID system)
  1, -- CD_DEVISE (1 for EUR, assuming an ID system)
  NOW(), 
  'SYS', 
  NOW(), 
  'SYS'
)
ON DUPLICATE KEY UPDATE
  RAISON_SOCIALE = VALUES(RAISON_SOCIALE),
  EMAIL = VALUES(EMAIL),
  ADRESSE = VALUES(ADRESSE),
  VILLE = VALUES(VILLE),
  CPOSTAL = VALUES(CPOSTAL),
  CDPAYS = VALUES(CDPAYS),
  SIRET = VALUES(SIRET),
  NUM_TVA = VALUES(NUM_TVA),
  CODE_APE = VALUES(CODE_APE),
  RCS = VALUES(RCS),
  STATUT_SOCIAL = VALUES(STATUT_SOCIAL),
  MTT_CAPITAL = VALUES(MTT_CAPITAL),
  DHMOD = NOW(),
  USMOD = 'SYS';

-- Note: Les champs LOGO_*, FILIGRANNE, et les champs de configuration d'impression (POLICE_*, LIB_BAS_*) sont laissés à NULL/valeur par défaut.
-- Vous pouvez les mettre à jour via l'interface de l'application si nécessaire. 