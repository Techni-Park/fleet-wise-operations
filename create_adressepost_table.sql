-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 85.31.239.121
-- Généré le : lun. 30 juin 2025 à 15:12
-- Version du serveur : 8.0.42-0ubuntu0.22.04.1
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestinter_test`
--

-- --------------------------------------------------------

--
-- Structure de la table `ADRESSEPOST`
--

CREATE TABLE `ADRESSEPOST` (
  `IDADRESSEPOST` bigint NOT NULL,
  `XXIDCONTACT` int DEFAULT '0',
  `ID2GENRE_ADRESSE` tinyint UNSIGNED DEFAULT '0',
  `LIBDESC` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `NOMFAMILLE` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `PRENOM` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `ADRESSE1` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `ADRESSE2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `CPOSTAL` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `VILLE` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `CDPAYS` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `IDCIVILITE` bigint DEFAULT '0',
  `DT_DEBUT` date DEFAULT NULL,
  `DT_FIN` date DEFAULT NULL,
  `DHCRE` datetime(3) DEFAULT NULL,
  `USCRE` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `DHMOD` datetime(3) DEFAULT NULL,
  `RAISON_SOCIALE` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `USMOD` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `DH_SYNCHRO` datetime DEFAULT NULL,
  `TRGCIBLE` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `CDREGION` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `TEL1` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `TYPTEL1` tinyint UNSIGNED DEFAULT '0',
  `TEL2` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `INFOPORTE` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `TYPTEL2` tinyint UNSIGNED DEFAULT '0',
  `TYPTEL3` tinyint UNSIGNED DEFAULT '0',
  `TEL3` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `USDEF_LIB` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `USDEF_NUM` double DEFAULT NULL,
  `USDEF_CBO` tinyint UNSIGNED DEFAULT NULL,
  `USDEF_BOO` tinyint DEFAULT NULL,
  `USDEF_DATE` date DEFAULT NULL,
  `LATITUDE` float DEFAULT '0',
  `LONGITUDE` float DEFAULT '0',
  `DISTANCE_SIEGE` float NOT NULL DEFAULT '0',
  `IPREF` tinyint DEFAULT '0',
  `ID2ZONE_GEO` tinyint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ADRESSEPOST`
--

INSERT INTO `ADRESSEPOST` (`IDADRESSEPOST`, `XXIDCONTACT`, `ID2GENRE_ADRESSE`, `LIBDESC`, `NOMFAMILLE`, `PRENOM`, `ADRESSE1`, `ADRESSE2`, `CPOSTAL`, `VILLE`, `CDPAYS`, `IDCIVILITE`, `DT_DEBUT`, `DT_FIN`, `DHCRE`, `USCRE`, `DHMOD`, `RAISON_SOCIALE`, `USMOD`, `created_at`, `updated_at`, `DH_SYNCHRO`, `TRGCIBLE`, `CDREGION`, `TEL1`, `TYPTEL1`, `TEL2`, `INFOPORTE`, `TYPTEL2`, `TYPTEL3`, `TEL3`, `USDEF_LIB`, `USDEF_NUM`, `USDEF_CBO`, `USDEF_BOO`, `USDEF_DATE`, `LATITUDE`, `LONGITUDE`, `DISTANCE_SIEGE`, `IPREF`, `ID2ZONE_GEO`) VALUES
(1, 0, 2, 'Adresse pro', 'PI', 'Laetitia', 'Lieu-dit Champ Perrier', 'Impasse des Artisans', '04160', 'L\'ESCALE', 'FRA', 2, NULL, NULL, '2019-01-24 09:05:07.836', 'SV', '2023-03-29 15:35:56.601', 'TECHNI-PARK', 'LI', '2024-07-29 14:23:13', '2024-07-29 14:23:13', '2024-07-29 16:23:11', 'CTC1', '', '', 0, '06-08-72-58-67', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(2, 0, 2, 'Adresse pro', 'BIDAL', 'Jean-Christophe', '6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 1, NULL, NULL, '2019-01-10 15:48:29.671', 'LP', '2023-03-27 16:47:09.572', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:14', '2024-07-29 14:23:14', '2024-07-29 16:23:13', 'CTC2', '', '06-33-78-67-86', 255, '', '', 0, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(3, 0, 2, 'Adresse pro', 'BARROIS', 'Gérard', '6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 1, NULL, NULL, '2019-01-23 14:47:21.165', 'SV', '2023-03-27 16:45:57.432', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:15', '2024-07-29 14:23:15', '2024-07-29 16:23:14', 'CTC7', '', '03-81-54-68-15', 2, '06-75-65-08-30', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(4, 0, 2, 'Adresse pro', 'CURTIL', 'Christophe', '6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 1, NULL, NULL, '2019-01-23 14:47:25.452', 'SV', '2023-03-27 16:45:26.947', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:17', '2024-07-29 14:23:17', '2024-07-29 16:23:15', 'CTC8', '', '03-81-54-52-89', 2, '06-85-32-52-38', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(5, 0, 2, 'Adresse pro', 'BOHLY', 'Michel', '6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 1, NULL, NULL, '2019-01-23 14:47:12.515', 'SV', '2023-03-27 16:46:43.025', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:18', '2024-07-29 14:23:18', '2024-07-29 16:23:17', 'CTC9', '', '03-81-54-52-65', 2, '06-75-65-08-31', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(6, 0, 2, 'Adresse pro', 'BATAILLE', 'Elvire', '6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 2, NULL, NULL, '2019-01-23 14:47:31.723', 'SV', '2023-03-27 16:44:59.135', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:19', '2024-07-29 14:23:19', '2024-07-29 16:23:18', 'CTC10', '', '03-81-54-49-99', 2, '06-25-82-52-33', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(7, 0, 2, 'Adresse pro', 'BRANCHER', 'Sylvie', 'N°6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 2, NULL, NULL, '2019-01-23 14:47:36.685', 'SV', '2023-12-21 08:56:00.330', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:21', '2024-07-29 14:23:21', '2024-07-29 16:23:19', 'CTC11', '', '03-84-54-56-91', 2, '', '', 0, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(8, 0, 2, 'Adresse pro', 'GAUTHIER', 'Rachel', '6 Rue Isaac Newton', '', '25000', 'BESANCON', 'FRA', 2, NULL, NULL, '2019-01-23 14:47:44.555', 'SV', '2024-05-24 11:17:25.768', 'FLOWBIRD BESANCON', 'LI', '2024-07-29 14:23:22', '2024-07-29 14:23:22', '2024-07-29 16:23:21', 'CTC12', '', '03-81-54-68-96', 2, '', '', 0, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(9, 0, 2, 'Adresse pro', 'VESPROUMIS', 'Denis', '39 rue Louveau', '', '92320', 'CHATILLON', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:25.973', 'SV', '2023-03-27 16:30:03.164', 'FLOWBIRD CHATILLON', 'LI', '2024-07-29 14:23:23', '2024-07-29 14:23:23', '2024-07-29 16:23:22', 'CTC13', '', '03-81-54-68-81', 2, '06-75-71-50-23', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(10, 0, 2, 'Adresse pro', 'LEVY', 'Jean-Marc', '39 rue Louveau', '', '92320', 'CHATILLON', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:29.956', 'SV', '2024-01-25 10:05:59.049', 'FLOWBIRD CHATILLON', 'LI', '2024-07-29 14:23:25', '2024-07-29 14:23:25', '2024-07-29 16:23:23', 'CTC14', '', '03-55-48-17-28', 2, '06-16-67-57-34', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(11, 0, 2, 'Adresse pro', 'LEBACLE', 'Olivier', '39 rue Louveau', '', '92320', 'CHATILLON', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:34.500', 'SV', '2023-03-27 16:29:14.664', 'FLOWBIRD CHATILLON', 'LI', '2024-07-29 14:23:26', '2024-07-29 14:23:26', '2024-07-29 16:23:25', 'CTC15', '', '', 0, '06-07-67-36-34', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(12, 0, 2, 'Adresse pro', 'STOJMANOVSKI', 'Sacha', '39 rue Louveau', '', '92320', 'CHATILLON', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:38.485', 'SV', '2023-03-27 16:28:15.164', 'FLOWBIRD CHATILLON', 'LI', '2024-07-29 14:23:27', '2024-07-29 14:23:27', '2024-07-29 16:23:26', 'CTC16', '', '01-55-48-17-29', 2, '06-16-67-55-56', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(13, 0, 2, 'Adresse pro', 'LBAKH', 'Rachid', '96 Avenue de l\'Europe', '', '13127', 'VITROLLES', 'FRA', 1, NULL, NULL, '2019-01-23 14:49:07.821', 'SV', '2024-01-25 10:03:59.612', 'FLOWBIRD VITROLLES', 'LI', '2024-07-29 14:23:28', '2024-07-29 14:23:28', '2024-07-29 16:23:27', 'CTC17', '', '04-42-79-64-13', 2, '06-16-67-57-38', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(14, 0, 2, 'Adresse pro', 'SPERTO', 'Christophe', '100 avenue de Suffren', '', '75015', 'PARIS 15', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:42.772', 'SV', '2023-03-27 16:27:20.070', 'FLOWBIRD (Siège)', 'LI', '2024-07-29 14:23:30', '2024-07-29 14:23:30', '2024-07-29 16:23:28', 'CTC18', '', '01-58-09-81-45', 2, '06-75-88-09-82', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(15, 0, 2, 'Adresse pro', 'BESBROSSES', 'Eric', '100 avenue de Suffren', '', '75015', 'PARIS 15', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:50.197', 'SV', '2023-07-11 08:36:54.264', 'FLOWBIRD (Siège)', 'LI', '2024-07-29 14:23:31', '2024-07-29 14:23:31', '2024-07-29 16:23:30', 'CTC19', '', '03-81-54-56-62', 2, '06-78-61-42-22', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(16, 0, 2, 'Adresse pro', 'STEFANELLO', 'Jérôme', '100 avenue de Suffren', '', '75015', 'PARIS 15', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:54.661', 'SV', '2023-03-27 16:26:06.835', 'FLOWBIRD (Siège)', 'LI', '2024-07-29 14:23:32', '2024-07-29 14:23:32', '2024-07-29 16:23:31', 'CTC20', '', '', 0, '06-13-18-35-77', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(17, 0, 2, 'Adresse pro', 'GLAIZOT', 'Louis', '100 avenue de Suffren', '', '75015', 'PARIS 15', 'FRA', 1, NULL, NULL, '2019-01-23 14:48:58.754', 'SV', '2023-03-27 16:48:56.682', 'FLOWBIRD (Siège)', 'LI', '2024-07-29 14:23:34', '2024-07-29 14:23:34', '2024-07-29 16:23:32', 'CTC21', '', '', 0, '07-77-82-78-76', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(18, 0, 2, 'Adresse pro', 'BECHAR', 'Maxime', '100 avenue de Suffren', '', '75015', 'PARIS 15', 'FRA', 1, NULL, NULL, '2019-01-23 14:49:03.205', 'SV', '2023-03-27 16:25:12.897', 'FLOWBIRD (Siège)', 'LI', '2024-07-29 14:23:35', '2024-07-29 14:23:35', '2024-07-29 16:23:34', 'CTC22', '', '', 0, '', '', 0, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(19, 0, 2, 'Adresse pro', 'STREIFF', 'Vincent', '18 allée de la Forêt de la Reine', '', '54600', 'VILLERS LES NANCY', 'FRA', 1, NULL, NULL, '2019-01-23 14:46:47.501', 'SV', '2023-03-27 16:47:58.432', 'FLOWBIRD AGENCE NORD-EST', 'LI', '2024-07-29 14:23:36', '2024-07-29 14:23:36', '2024-07-29 16:23:35', 'CTC23', '', '03-83-41-38-67', 2, '06-16-67-56-01', '', 2, 0, '', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0),
(20, 0, 2, 'Adresse pro', 'GARCIA', '', '1 avenue d\'Aix', '', '13840', 'ROGNES', 'FRA', 1, NULL, NULL, '2019-01-23 14:50:25.630', 'SV', '2023-04-04 16:24:47.969', 'MAIRIE ROGNES', 'LI', '2024-07-29 14:23:37', '2024-07-29 14:23:37', '2024-07-29 16:23:36', 'CTC24', '', '04-42-50-22-05', 2, '06-12-23-35-56', '', 2, 2, '04-42-50-12-36', '', 0, 0, 0, NULL, 0, 0, 0, 1, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `ADRESSEPOST`
--
ALTER TABLE `ADRESSEPOST`
  ADD PRIMARY KEY (`IDADRESSEPOST`),
  ADD KEY `WDIDX17222607620` (`TRGCIBLE`),
  ADD KEY `CC_CIBLEGENREPREF` (`TRGCIBLE`,`ID2GENRE_ADRESSE`,`IPREF`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 