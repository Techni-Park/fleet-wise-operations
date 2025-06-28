import { mysqlTable, text, int, varchar, datetime, decimal, mysqlEnum, timestamp, bigint, smallint, tinyint, date, time, float, longtext, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  active: tinyint("active", { unsigned: true }).notNull().default(0),
  CDUSER: varchar("CDUSER", { length: 10 }),
  firstName: varchar("first_name", { length: 191 }).notNull(),
  lastName: varchar("last_name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  password: varchar("password", { length: 191 }).notNull(),
  rememberToken: varchar("remember_token", { length: 100 }),
  lastLogin: datetime("last_login"),
  ip: varchar("ip", { length: 20 }),
  idagenda: varchar("idagenda", { length: 100 }).notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export const vehicles = mysqlTable("vehicles", {
  id: int("id").primaryKey().autoincrement(),
  plate: varchar("plate", { length: 20 }).notNull().unique(),
  model: varchar("model", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 50 }),
  year: int("year").notNull(),
  mileage: int("mileage").notNull().default(0),
  vin: varchar("vin", { length: 17 }).unique(),
  color: varchar("color", { length: 30 }),
  fuelType: mysqlEnum("fuel_type", ["essence", "diesel", "electrique", "hybride"]).notNull(),
  enginePower: varchar("engine_power", { length: 20 }),
  status: mysqlEnum("status", ["active", "maintenance", "inactive"]).notNull().default("active"),
  insurance: datetime("insurance"),
  technicalControl: datetime("technical_control"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Table INTERVENTION (structure réelle MySQL)
export const interventions = mysqlTable("INTERVENTION", {
  IDINTERVENTION: bigint("IDINTERVENTION", { mode: "number" }).primaryKey(),
  LIB50: varchar("LIB50", { length: 50 }),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }).default(0),
  IDPROJET: bigint("IDPROJET", { mode: "number" }).default(0),
  IDTACHE: bigint("IDTACHE", { mode: "number" }).default(0),
  DT_INTER_DBT: date("DT_INTER_DBT"),
  HR_DEBUT: time("HR_DEBUT").default("00:00:00"),
  DT_INTER_FIN: date("DT_INTER_FIN"),
  HR_FIN: time("HR_FIN").default("00:00:00"),
  ID2GENRE_INTER: smallint("ID2GENRE_INTER").default(0),
  ST_INTER: tinyint("ST_INTER", { unsigned: true }).default(0),
  CDUSER: varchar("CDUSER", { length: 3 }),
  US_TEAM: varchar("US_TEAM", { length: 50 }),
  CD_PRODUIT: varchar("CD_PRODUIT", { length: 25 }),
  LIB_INTERVENTION: longtext("LIB_INTERVENTION"),
  DEMANDEUR: varchar("DEMANDEUR", { length: 30 }),
  SUR_SITE: tinyint("SUR_SITE").default(0),
  ID2ZONE_GEO: tinyint("ID2ZONE_GEO", { unsigned: true }).default(0),
  DT_PROCH_INTER: date("DT_PROCH_INTER"),
  LIB_PROCHINTER: longtext("LIB_PROCHINTER"),
  ITRANSMIS: tinyint("ITRANSMIS").default(0),
  CLE_MACHINE_CIBLE: varchar("CLE_MACHINE_CIBLE", { length: 12 }),
  SIGNATURE_CLT: longtext("SIGNATURE_CLT"),
  SIGNATURE_TECH: longtext("SIGNATURE_TECH"),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  USDEF_CBO: smallint("USDEF_CBO"),
  USDEF_BOO: tinyint("USDEF_BOO"),
  USDEF_DATE: date("USDEF_DATE"),
  DH_SYNCHRO: datetime("DH_SYNCHRO"),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
});

export const alerts = mysqlTable("alerts", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  vehicleId: int("vehicle_id").notNull(),
  category: mysqlEnum("category", ["maintenance", "compliance", "insurance", "usage"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).notNull(),
  status: mysqlEnum("status", ["active", "resolved"]).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Table ACTION
export const actions = mysqlTable("ACTION", {
  IDACTION: bigint("IDACTION", { mode: "number" }).primaryKey().autoincrement(),
  DT_AFAIRE: date("DT_AFAIRE"),
  DTREAL: date("DTREAL"),
  CDUSER: varchar("CDUSER", { length: 3 }).default(""),
  TYPACT: smallint("TYPACT").default(0),
  LIB100: varchar("LIB100", { length: 100 }).default(""),
  COMMENTAIRE: longtext("COMMENTAIRE"),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }).default(0),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  AFFICHE_AVANT: tinyint("AFFICHE_AVANT").default(0),
  IDPROJET: bigint("IDPROJET", { mode: "number" }).default(0),
  IDTACHE: bigint("IDTACHE", { mode: "number" }).default(0),
  PRIORITE: smallint("PRIORITE").default(0),
  ST_ACTION: smallint("ST_ACTION").default(0),
  DH_ACOMMENCER: datetime("DH_ACOMMENCER", { mode: "string", fsp: 3 }),
  DUREE_PREVUE: bigint("DUREE_PREVUE", { mode: "number" }).default(0),
  DH_COMMENCE: datetime("DH_COMMENCE", { mode: "string", fsp: 3 }),
  DH_MAILEXPED: datetime("DH_MAILEXPED", { mode: "string", fsp: 3 }),
  CLE_MACHINE_CIBLE: varchar("CLE_MACHINE_CIBLE", { length: 12 }).default(""),
  IDACTIONPLANIF: bigint("IDACTIONPLANIF", { mode: "number" }).default(0),
  RAPPEL_MAIL: tinyint("RAPPEL_MAIL").default(0),
  IARCHIVE: tinyint("IARCHIVE").default(0),
  ID2GENRE_ACTION: smallint("ID2GENRE_ACTION").default(0),
  DH_AFINIR: datetime("DH_AFINIR", { mode: "string", fsp: 3 }),
  DH_REAL: datetime("DH_REAL", { mode: "string", fsp: 3 }),
  IDAGENDA_GOOGLE: varchar("IDAGENDA_GOOGLE", { length: 160 }).default(""),
  IDAGENDA_OUTLK: varchar("IDAGENDA_OUTLK", { length: 160 }).default(""),
  LIEU: varchar("LIEU", { length: 160 }).default(""),
  CLE_PIECE_CIBLE: varchar("CLE_PIECE_CIBLE", { length: 12 }).default(""),
  IDACTION_PREC: int("IDACTION_PREC").default(0),
  IRAPPELFAIT: tinyint("IRAPPELFAIT").default(0),
  ID2ZONE_GEO: tinyint("ID2ZONE_GEO").default(0),
});

// Table ANOMALIE
export const anomalies = mysqlTable("ANOMALIE", {
  IDANOMALIE: bigint("IDANOMALIE", { mode: "number" }).primaryKey().autoincrement(),
  LIB_ANOMALIE: varchar("LIB_ANOMALIE", { length: 80 }).default(""),
  ID2_TYPANOM: smallint("ID2_TYPANOM").default(0),
  CRITICITE: smallint("CRITICITE").default(0),
  REPRODUCTIBLE: smallint("REPRODUCTIBLE").default(0),
  PRIORITE: smallint("PRIORITE").default(0),
  VERSION: varchar("VERSION", { length: 12 }).default(""),
  US_RESP: varchar("US_RESP", { length: 3 }).default(""),
  US_TRT: varchar("US_TRT", { length: 3 }).default(""),
  ST_ANOM: tinyint("ST_ANOM").default(0),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  DH_SYNCHRO: datetime("DH_SYNCHRO"),
  LIB_CONCERNE: varchar("LIB_CONCERNE", { length: 25 }).default(""),
  REF_EXTERNE: varchar("REF_EXTERNE", { length: 25 }).default(""),
  VERSION_RESOL: varchar("VERSION_RESOL", { length: 12 }).default(""),
  TRGCIBLE: varchar("TRGCIBLE", { length: 11 }).default(""),
  ITERMINE: tinyint("ITERMINE").default(0),
  DH_CONSTAT: datetime("DH_CONSTAT", { mode: "string", fsp: 3 }),
  DH_RESOLUTION: datetime("DH_RESOLUTION", { mode: "string", fsp: 3 }),
  DETECTE_PAR: varchar("DETECTE_PAR", { length: 30 }).default(""),
  OBSERVATIONS: longtext("OBSERVATIONS"),
});

// Table CONTACT
export const contacts = mysqlTable("CONTACT", {
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }).primaryKey().autoincrement(),
  IBAN: varchar("IBAN", { length: 42 }).default(""),
  NOMFAMILLE: varchar("NOMFAMILLE", { length: 30 }).default(""),
  PRENOM: varchar("PRENOM", { length: 20 }).default(""),
  NOMFAMILLEYL: varchar("NOMFAMILLEYL", { length: 30 }).default(""),
  PRENOMYL: varchar("PRENOMYL", { length: 20 }).default(""),
  NOMCLAS: varchar("NOMCLAS", { length: 30 }).default(""),
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }).default(0),
  QT_PRO: smallint("QT_PRO").default(0),
  CTG_CONTACT: tinyint("CTG_CONTACT"),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  DTNAISS: date("DTNAISS"),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  IDCIVILITE: bigint("IDCIVILITE", { mode: "number" }).default(1),
  ADRESSE1: varchar("ADRESSE1", { length: 50 }).default(""),
  ADRESSE2: varchar("ADRESSE2", { length: 50 }).default(""),
  RAISON_SOCIALE: varchar("RAISON_SOCIALE", { length: 160 }).default(""),
  CDPAYS: varchar("CDPAYS", { length: 3 }).default("FRA"),
  CPOSTAL: varchar("CPOSTAL", { length: 9 }).default(""),
  TEL1: varchar("TEL1", { length: 18 }).default(""),
  VILLE: varchar("VILLE", { length: 30 }).default(""),
  TEL2: varchar("TEL2", { length: 18 }).default(""),
  INFOPORTE: varchar("INFOPORTE", { length: 30 }).default(""),
  EMAIL: varchar("EMAIL", { length: 64 }).default(""),
  WEBSITE: varchar("WEBSITE", { length: 60 }).default(""),
  IDCIVILITEP: smallint("IDCIVILITEP").default(0),
  ADRESSEP1: varchar("ADRESSEP1", { length: 50 }).default(""),
  ADRESSEP2: varchar("ADRESSEP2", { length: 50 }).default(""),
  CDPAYSP: varchar("CDPAYSP", { length: 3 }).default(""),
  CPOSTALP: varchar("CPOSTALP", { length: 9 }).default(""),
  VILLEP: varchar("VILLEP", { length: 30 }).default(""),
  EMAILP: varchar("EMAILP", { length: 64 }).default(""),
  WEBSITEP: varchar("WEBSITEP", { length: 60 }).default(""),
  TELP1: varchar("TELP1", { length: 18 }).default(""),
  TELP2: varchar("TELP2", { length: 18 }).default(""),
  TELP3: varchar("TELP3", { length: 18 }).default(""),
  TELAUTRE: varchar("TELAUTRE", { length: 100 }).default(""),
  SECTEUR_PRO: varchar("SECTEUR_PRO", { length: 50 }).default(""),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  USDEF_BOO: tinyint("USDEF_BOO"),
  COMMENTAIRE: longtext("COMMENTAIRE"),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
  DH_SYNCHRO: datetime("DH_SYNCHRO"),
  PHOTO: json("PHOTO"),
  ID2GENRE_CONTACT: tinyint("ID2GENRE_CONTACT").default(0),
  FONCTION_PRO: varchar("FONCTION_PRO", { length: 50 }).default(""),
  CD_LANG: smallint("CD_LANG").default(0),
  USDEF_DATE: date("USDEF_DATE"),
  USDEF_CBO: smallint("USDEF_CBO"),
  LATITUDEP: float("LATITUDEP").default(0),
  LONGITUDEP: float("LONGITUDEP").default(0),
  REFEXTERNE: varchar("REFEXTERNE", { length: 12 }).default(""),
  CD_DEVISE: varchar("CD_DEVISE", { length: 3 }).default(""),
  US_RESP: varchar("US_RESP", { length: 3 }).default(""),
  ID2TYP_CLIENT: int("ID2TYP_CLIENT").default(0),
  IMAIL_BLACKLIST: tinyint("IMAIL_BLACKLIST"),
  IARCHIVE: tinyint("IARCHIVE").default(0),
  ID2ZONE_GEO: tinyint("ID2ZONE_GEO").default(0),
  ICLTPRO: tinyint("ICLTPRO").default(0),
  LOGIN: varchar("LOGIN", { length: 64 }).default(""),
  PASSWORD: varchar("PASSWORD", { length: 12 }).default(""),
  IANOM: tinyint("IANOM").default(0),
  CDREGION: varchar("CDREGION", { length: 3 }).default(""),
  CDREGIONP: varchar("CDREGIONP", { length: 3 }).default(""),
  TYPTEL3: tinyint("TYPTEL3").default(0),
  TYPTEL2: tinyint("TYPTEL2").default(0),
  TYPTEL1: tinyint("TYPTEL1").default(0),
  TYPTELP1: tinyint("TYPTELP1").default(0),
  TYPTELP2: tinyint("TYPTELP2").default(0),
  TYPTELP3: tinyint("TYPTELP3").default(0),
  IDORIG: bigint("IDORIG", { mode: "number" }).default(0),
  AUTHKEY: varchar("AUTHKEY", { length: 80 }).default(""),
  TEL3: varchar("TEL3", { length: 18 }).default(""),
  IANOMALIE: tinyint("IANOMALIE").default(0),
});

// Table INGREDIENT
export const ingredients = mysqlTable("INGREDIENT", {
  IDINGREDIENT: bigint("IDINGREDIENT", { mode: "number" }).primaryKey().autoincrement(),
  CD_PRODUIT: varchar("CD_PRODUIT", { length: 25 }).default(""),
  DESCRIPTION: varchar("DESCRIPTION", { length: 80 }),
  IDPROJET: bigint("IDPROJET", { mode: "number" }).default(0),
  IDTACHE: bigint("IDTACHE", { mode: "number" }).default(0),
  IDINTERVENTION: bigint("IDINTERVENTION", { mode: "number" }).default(0),
  QT_CONSO: float("QT_CONSO").default(0),
  UNITE_VENTE: varchar("UNITE_VENTE", { length: 20 }),
  IDFAMPROD: int("IDFAMPROD").notNull(),
  QT_FACT: float("QT_FACT").default(0),
  DT_DEBUT: date("DT_DEBUT"),
  HR_DEBUT: time("HR_DEBUT").default("00:00:00"),
  DT_FIN: date("DT_FIN"),
  HR_FIN: time("HR_FIN").default("00:00:00"),
  LIB80: varchar("LIB80", { length: 80 }).default(""),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  ID2GENRE_INGREDIENT: int("ID2GENRE_INGREDIENT").default(0),
  PU_ACHAT_HT: decimal("PU_ACHAT_HT", { precision: 24, scale: 6 }).default("0.000000"),
  PU_VENTE_HT: decimal("PU_VENTE_HT", { precision: 24, scale: 6 }).default("0.000000"),
  MTT_VALO: decimal("MTT_VALO", { precision: 24, scale: 6 }).default("0.000000"),
  TYP_FAM: smallint("TYP_FAM").default(0),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
  isupprime: tinyint("isupprime").default(0),
  isynchro: tinyint("isynchro").default(0),
  DH_SYNCHRO: date("DH_SYNCHRO"),
  RAISON_SOCIALE: varchar("RAISON_SOCIALE", { length: 50 }),
  NOMFAMILLE: varchar("NOMFAMILLE", { length: 30 }),
  PRENOM: varchar("PRENOM", { length: 50 }),
  ADRESSE: varchar("ADRESSE", { length: 80 }),
  CP: varchar("CP", { length: 5 }),
  VILLE: varchar("VILLE", { length: 50 }),
  EMAIL: varchar("EMAIL", { length: 80 }),
  IDSOCIETE: int("IDSOCIETE"),
});

// Table MACHINE_MNT (structure réelle MySQL)
export const machinesMnt = mysqlTable("MACHINE_MNT", {
  IDMACHINE: bigint("IDMACHINE", { mode: "number" }).primaryKey(),
  CD_MACHINE: varchar("CD_MACHINE", { length: 25 }),
  LIB_MACHINE: varchar("LIB_MACHINE", { length: 50 }),
  ID2_ETATMACHINE: int("ID2_ETATMACHINE").notNull(),
  MARQUE: varchar("MARQUE", { length: 25 }),
  MODELE: varchar("MODELE", { length: 25 }),
  NUM_SAV: varchar("NUM_SAV", { length: 25 }),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  CONTACT_SAV: varchar("CONTACT_SAV", { length: 60 }),
  TELSAV: varchar("TELSAV", { length: 18 }),
  OBSERVATIONS: longtext("OBSERVATIONS"),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }),
  DT_PROCH_MNT: date("DT_PROCH_MNT"),
  DT_EXP_GARANTIE: date("DT_EXP_GARANTIE"),
  ID2GENRE_MACHINE: tinyint("ID2GENRE_MACHINE", { unsigned: true }),
  ADRESSE1: varchar("ADRESSE1", { length: 50 }),
  USCRE: varchar("USCRE", { length: 3 }),
  USMOD: varchar("USMOD", { length: 3 }),
  DT_MISEENFONCTION: date("DT_MISEENFONCTION"),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  USDEF_BOO: tinyint("USDEF_BOO"),
  IMG_MACHINE: longtext("IMG_MACHINE"),
  DOSSIER: varchar("DOSSIER", { length: 150 }),
  DT_DBT_GARANTIE: date("DT_DBT_GARANTIE"),
  NUM_SERIE: varchar("NUM_SERIE", { length: 25 }),
  TYPE_MACHINE: varchar("TYPE_MACHINE", { length: 25 }),
  IMMAT: varchar("IMMAT", { length: 20 }),
  PUISSANCEW: int("PUISSANCEW"),
  KILOMETRAGE: int("KILOMETRAGE"),
  USDEF_DATE: date("USDEF_DATE"),
  USDEF_CBO: smallint("USDEF_CBO"),
  US_RESP: varchar("US_RESP", { length: 3 }),
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }),
  POIDS: float("POIDS"),
  CD_PRODUIT: varchar("CD_PRODUIT", { length: 25 }),
  DT_MNT_DBT: date("DT_MNT_DBT"),
  DT_MNT_FIN: date("DT_MNT_FIN"),
  IARCHIVE: tinyint("IARCHIVE"),
  CPOSTAL: varchar("CPOSTAL", { length: 9 }),
  VILLE: varchar("VILLE", { length: 30 }),
  CDREGION: varchar("CDREGION", { length: 3 }),
  CDPAYS: varchar("CDPAYS", { length: 3 }),
  ADRESSE2: varchar("ADRESSE2", { length: 50 }),
  CAPACITE: varchar("CAPACITE", { length: 50 }),
});

// Table VEHICULE (structure réelle MySQL)
export const vehicules = mysqlTable("VEHICULE", {
  IDVEHICULE: bigint("IDVEHICULE", { mode: "number" }).primaryKey(),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }),
  IDMACHINE: int("IDMACHINE", { unsigned: true }).notNull(),
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }),
  IMMAT: varchar("IMMAT", { length: 20 }),
  ID2_TYPEVEHIC: tinyint("ID2_TYPEVEHIC", { unsigned: true }),
  PUISSANCE_ADMIN: tinyint("PUISSANCE_ADMIN"),
  NUM_CNIT: varchar("NUM_CNIT", { length: 25 }),
  NUM_IDENTIF: varchar("NUM_IDENTIF", { length: 25 }),
  NUMSERIE_CLE: text("NUMSERIE_CLE"),
  URL_CONSTRUCTEUR: varchar("URL_CONSTRUCTEUR", { length: 100 }),
  PVIDE: int("PVIDE"),
  PTAC: int("PTAC"),
  PTR: int("PTR"),
  GENRE_NATIONAL: varchar("GENRE_NATIONAL", { length: 5 }),
  CARBURANT: varchar("CARBURANT", { length: 5 }),
  PLACES_ASSISES: int("PLACES_ASSISES"),
  COUT_KM: float("COUT_KM"),
  NUMCONTRASS: varchar("NUMCONTRASS", { length: 24 }),
  DT_ECHASS: date("DT_ECHASS"),
  KMVIDANGE: int("KMVIDANGE", { unsigned: true }),
  KMACTUEL: int("KMACTUEL", { unsigned: true }),
  DT_PREMCIRC: date("DT_PREMCIRC"),
  DT_PRCTRL: date("DT_PRCTRL"),
  DT_DERNIEREMAINT: date("DT_DERNIEREMAINT"),
  DT_CTRLTECH: date("DT_CTRLTECH"),
  DT_CTRLPOLLUTION: date("DT_CTRLPOLLUTION"),
  PNEUSAV: varchar("PNEUSAV", { length: 24 }),
  PNEUSAR: varchar("PNEUSAR", { length: 24 }),
  NOTES: text("NOTES"),
  DHCRE: datetime("DHCRE"),
  USCRE: varchar("USCRE", { length: 3 }),
  DHMOD: datetime("DHMOD"),
  USMOD: varchar("USMOD", { length: 3 }),
});

// Ancienne table MACHINE_MNT (renommée pour éviter les conflits)
export const machinesMntOld = mysqlTable("machines_mnt_old", {
  IDMACHINE: bigint("IDMACHINE", { mode: "number" }).primaryKey().autoincrement(),
  CD_MACHINE: varchar("CD_MACHINE", { length: 25 }).default(""),
  LIB_MACHINE: varchar("LIB_MACHINE", { length: 50 }).default(""),
  ID2_ETATMACHINE: int("ID2_ETATMACHINE").notNull(),
  MARQUE: varchar("MARQUE", { length: 25 }).default(""),
  MODELE: varchar("MODELE", { length: 25 }).default(""),
  NUM_SAV: varchar("NUM_SAV", { length: 25 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  CONTACT_SAV: varchar("CONTACT_SAV", { length: 60 }).default(""),
  TELSAV: varchar("TELSAV", { length: 18 }).default(""),
  OBSERVATIONS: longtext("OBSERVATIONS"),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }).default(0),
  DT_PROCH_MNT: date("DT_PROCH_MNT"),
  DT_EXP_GARANTIE: date("DT_EXP_GARANTIE"),
  ID2GENRE_MACHINE: tinyint("ID2GENRE_MACHINE").default(0),
  ADRESSE1: varchar("ADRESSE1", { length: 50 }).default(""),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  DT_MISEENFONCTION: date("DT_MISEENFONCTION"),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  USDEF_BOO: tinyint("USDEF_BOO"),
  IMG_MACHINE: json("IMG_MACHINE"),
  DOSSIER: varchar("DOSSIER", { length: 150 }).default(""),
  DT_DBT_GARANTIE: date("DT_DBT_GARANTIE"),
  NUM_SERIE: varchar("NUM_SERIE", { length: 25 }).default(""),
  TYPE_MACHINE: varchar("TYPE_MACHINE", { length: 25 }).default(""),
  IMMAT: varchar("IMMAT", { length: 20 }).default(""),
  PUISSANCEW: int("PUISSANCEW").default(0),
  KILOMETRAGE: int("KILOMETRAGE").default(0),
  USDEF_DATE: date("USDEF_DATE"),
  USDEF_CBO: smallint("USDEF_CBO"),
  US_RESP: varchar("US_RESP", { length: 3 }).default(""),
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }).default(0),
  POIDS: float("POIDS").default(0),
  CD_PRODUIT: varchar("CD_PRODUIT", { length: 25 }).default(""),
  DT_MNT_DBT: date("DT_MNT_DBT"),
  DT_MNT_FIN: date("DT_MNT_FIN"),
  IARCHIVE: tinyint("IARCHIVE").default(0),
  CPOSTAL: varchar("CPOSTAL", { length: 9 }).default(""),
  VILLE: varchar("VILLE", { length: 30 }).default(""),
  CDREGION: varchar("CDREGION", { length: 3 }).default(""),
  CDPAYS: varchar("CDPAYS", { length: 3 }).default(""),
  ADRESSE2: varchar("ADRESSE2", { length: 50 }).default(""),
  CAPACITE: varchar("CAPACITE", { length: 50 }).default("0"),
});

// Table Z83_INTERVENTION
export const z83Interventions = mysqlTable("Z83_INTERVENTION", {
  IDZ83_INTERVENTION: bigint("IDZ83_INTERVENTION", { mode: "number" }).primaryKey().autoincrement(),
  IDINTERVENTION: bigint("IDINTERVENTION", { mode: "number" }).default(0),
  INSTRUCTIONS: longtext("INSTRUCTIONS"),
  IDCTCREFERENT: int("IDCTCREFERENT", { unsigned: true }).default(0),
  IDCTCMATERIEL: int("IDCTCMATERIEL").default(0),
  IDADRMATERIEL: int("IDADRMATERIEL", { unsigned: true }).default(0),
  IDADRREFERENT: int("IDADRREFERENT").default(0),
  IDADRLIEU: int("IDADRLIEU").default(0),
  ADRINTER: varchar("ADRINTER", { length: 100 }),
  TPS_PASSE: smallint("TPS_PASSE", { unsigned: true }).default(0),
  PRIORITE: tinyint("PRIORITE", { unsigned: true }).default(0),
  DH_DEBUT_REEL: datetime("DH_DEBUT_REEL", { mode: "string", fsp: 3 }),
  DH_FIN_REEL: datetime("DH_FIN_REEL", { mode: "string", fsp: 3 }),
  SATISFACTION_CLIENT: tinyint("SATISFACTION_CLIENT", { unsigned: true }).default(0),
  CHARGE_ESTIMEE: smallint("CHARGE_ESTIMEE", { unsigned: true }).default(0),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 50 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }),
  DH_SYNCHRO: date("DH_SYNCHRO"),
});

// Table DOCUMENT (conservée avec les autres)
export const documents = mysqlTable("DOCUMENT", {
  ID: int("ID").primaryKey().autoincrement(),
  IDDOCUMENT: bigint("IDDOCUMENT", { mode: "number" }).unique(),
  CDUSER: varchar("CDUSER", { length: 3 }).default(""),
  LIB100: varchar("LIB100", { length: 100 }).default(""),
  FILEREF: varchar("FILEREF", { length: 256 }).default(""),
  COMMENTAIRE: longtext("COMMENTAIRE"),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }).default(0),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  DT_DOC: date("DT_DOC"),
  IDPROJET: bigint("IDPROJET", { mode: "number" }).default(0),
  IDTACHE: bigint("IDTACHE", { mode: "number" }).default(0),
  ID2GENRE_DOCUMENT: smallint("ID2GENRE_DOCUMENT").default(0),
  XXTRIGRAMME: varchar("XXTRIGRAMME", { length: 3 }).default(""),
  XXIDNUMCIBLE: int("XXIDNUMCIBLE").default(0),
  IDFICHIERBRUT: bigint("IDFICHIERBRUT", { mode: "number" }).default(0),
  ID2STATUT_DOC: tinyint("ID2STATUT_DOC").default(0),
  IDDOSSIERCLASS: bigint("IDDOSSIERCLASS", { mode: "number" }).default(0),
  TRGCIBLE: varchar("TRGCIBLE", { length: 11 }).default(""),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
  DH_SYNCHRO: datetime("DH_SYNCHRO"),
});

// Table PRODUIT
export const produits = mysqlTable("PRODUIT", {
  IDPRODUIT: bigint("IDPRODUIT", { mode: "number" }).primaryKey().autoincrement(),
  CD_PRODUIT: varchar("CD_PRODUIT", { length: 25 }).default("").unique(),
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }).default(0),
  LIB_PRODUIT: varchar("LIB_PRODUIT", { length: 100 }).default(""),
  IDFAMPROD: bigint("IDFAMPROD", { mode: "number" }).default(0),
  PU_ACHAT_HT: decimal("PU_ACHAT_HT", { precision: 24, scale: 6 }).default("0.000000"),
  PU_VENTE_HT: decimal("PU_VENTE_HT", { precision: 24, scale: 6 }).default("0.000000"),
  TX_TVA_VENTE: float("TX_TVA_VENTE").default(0),
  PU_ACHAT_TTC: decimal("PU_ACHAT_TTC", { precision: 24, scale: 6 }).default("0.000000"),
  PU_VENTE_TTC: decimal("PU_VENTE_TTC", { precision: 24, scale: 6 }).default("0.000000"),
  STK_ALERTE: float("STK_ALERTE").default(0),
  STK_SECURITE: float("STK_SECURITE").default(0),
  STK_COURANT: float("STK_COURANT").default(0),
  UNITE_VENTE: varchar("UNITE_VENTE", { length: 15 }).default(""),
  EAN13: varchar("EAN13", { length: 13 }).default(""),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  IMG_PROD: json("IMG_PROD"),
  DOSSIER: varchar("DOSSIER", { length: 150 }).default(""),
  IHORSCATALOGUE: tinyint("IHORSCATALOGUE").default(0),
  DELAI_LIVR: smallint("DELAI_LIVR").default(0),
  POIDS_BRUT: float("POIDS_BRUT").default(0),
  VOLUME: float("VOLUME").default(0),
  IGERE_STOCK: tinyint("IGERE_STOCK").default(0),
  DESCRIPTIF: longtext("DESCRIPTIF"),
  TX_TVA_ACHAT: float("TX_TVA_ACHAT").default(0),
  NOTES_TECHNIQUES: longtext("NOTES_TECHNIQUES"),
  IDSSFAMPROD: bigint("IDSSFAMPROD", { mode: "number" }).default(0),
  CD_PRODUIT_FOU: varchar("CD_PRODUIT_FOU", { length: 25 }).default(""),
  USDEF_BOO: tinyint("USDEF_BOO"),
  USDEF_CBO: smallint("USDEF_CBO"),
  USDEF_DATE: date("USDEF_DATE"),
  DELAI_LIVR_FOU: smallint("DELAI_LIVR_FOU").default(0),
  CD_PLANCOMPTA: varchar("CD_PLANCOMPTA", { length: 15 }).default(""),
  TX_REM_FOU: float("TX_REM_FOU").default(0),
  TX_CHUTE: float("TX_CHUTE").default(0),
  MTT_DEEE: decimal("MTT_DEEE", { precision: 24, scale: 6 }).default("0.000000"),
  IPRODCOMP: tinyint("IPRODCOMP").default(0),
  ICOMPMOD: tinyint("ICOMPMOD").default(0),
  ITELQUEL: tinyint("ITELQUEL").default(0),
  IMP_DETAIL_COMP: smallint("IMP_DETAIL_COMP").default(0),
  IGENFABAUTO: tinyint("IGENFABAUTO").default(0),
  ID2RAYON: int("ID2RAYON").default(0),
  IARRONDI_HT: tinyint("IARRONDI_HT").default(0),
  ITARIFAUTO: tinyint("ITARIFAUTO").default(0),
  STK_MAX: float("STK_MAX").default(0),
  MARQUE: varchar("MARQUE", { length: 25 }).default(""),
  UNITE_ACHAT: varchar("UNITE_ACHAT", { length: 15 }).default(""),
  NOTES_FOURNISSEUR: longtext("NOTES_FOURNISSEUR"),
  PU_REVIENT_HT: decimal("PU_REVIENT_HT", { precision: 24, scale: 6 }).default("0.000000"),
  PU_REVIENT_TTC: decimal("PU_REVIENT_TTC", { precision: 24, scale: 6 }).default("0.000000"),
  TX_TVA_REVIENT: float("TX_TVA_REVIENT").default(0),
  NOMEN_DOUANE: varchar("NOMEN_DOUANE", { length: 10 }).default(""),
  POIDS_NET: float("POIDS_NET").default(0),
  QT_MINCDE: float("QT_MINCDE").default(0),
  DIMLONG: float("DIMLONG").default(0),
  DIMLARG: float("DIMLARG").default(0),
  DIMHAUT: float("DIMHAUT").default(0),
  TYP_COMMERCIALISAT: tinyint("TYP_COMMERCIALISAT").default(0),
  IGERE_LOT: tinyint("IGERE_LOT").default(0),
  QTE_INDIV: float("QTE_INDIV").default(0),
  TYP_PRIX: tinyint("TYP_PRIX").default(0),
  PCT_PRIXVENTE: float("PCT_PRIXVENTE").default(0),
  ITARFOU: tinyint("ITARFOU").default(0),
  CD_DEVISEFOU: varchar("CD_DEVISEFOU", { length: 3 }).default(""),
  PU_ACHAT_HTDF: decimal("PU_ACHAT_HTDF", { precision: 24, scale: 6 }).default("0.000000"),
  ISANSREMISEC: tinyint("ISANSREMISEC").default(0),
  ISANSREMISEF: tinyint("ISANSREMISEF").default(0),
  DT_DERMAJTARIFC: date("DT_DERMAJTARIFC"),
  DT_DERMAJTARIFF: date("DT_DERMAJTARIFF"),
  ID2GENRE_PRD: tinyint("ID2GENRE_PRD").default(0),
  TX_MARGE: float("TX_MARGE").default(0),
  TX_MARGEOBJ: float("TX_MARGEOBJ").default(0),
  IFINSERIE: tinyint("IFINSERIE").default(0),
  NBDECQPROD: tinyint("NBDECQPROD").default(0),
  IDPRODUITDOSS: bigint("IDPRODUITDOSS", { mode: "number" }).default(0),
  PAMP: decimal("PAMP", { precision: 24, scale: 6 }).default("0.000000"),
  ID2TYP_GARANTIE: tinyint("ID2TYP_GARANTIE").default(0),
  DUREE_GARANTIE: smallint("DUREE_GARANTIE").default(0),
  VITESSEROTA: float("VITESSEROTA").default(0),
  MTT_TRANSPORT: decimal("MTT_TRANSPORT", { precision: 24, scale: 6 }).default("0.000000"),
  MTT_DOUANES: decimal("MTT_DOUANES", { precision: 24, scale: 6 }).default("0.000000"),
  ID2_ATTRIBPRO: smallint("ID2_ATTRIBPRO"),
  IDORIG: bigint("IDORIG", { mode: "number" }).default(0),
  CD_ACTION: varchar("CD_ACTION", { length: 1 }).default(""),
  TIMESTAMP_TRAD: datetime("TIMESTAMP_TRAD", { mode: "string", fsp: 3 }),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  AUTHKEY: varchar("AUTHKEY", { length: 80 }).default(""),
  QTE_REASSORT: float("QTE_REASSORT").default(0),
  IGERE_NUMSERIE: tinyint("IGERE_NUMSERIE").default(0),
  USDEF_LIB1: varchar("USDEF_LIB1", { length: 40 }).default(""),
  USDEF_DATE1: date("USDEF_DATE1"),
  USDEF_LIB2: varchar("USDEF_LIB2", { length: 40 }).default(""),
  USDEF_DATE2: date("USDEF_DATE2"),
  USDEF_LIB3: varchar("USDEF_LIB3", { length: 40 }).default(""),
  USDEF_DATE3: date("USDEF_DATE3"),
  USDEF_LIB4: varchar("USDEF_LIB4", { length: 40 }).default(""),
  USDEF_DATE4: date("USDEF_DATE4"),
  USDEF_LIB5: varchar("USDEF_LIB5", { length: 40 }).default(""),
  USDEF_DATE5: date("USDEF_DATE5"),
});

// Table SOCIETE
export const societes = mysqlTable("SOCIETE", {
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }).primaryKey().autoincrement(),
  IDDELPMT: bigint("IDDELPMT", { mode: "number" }).default(0),
  RAISON_SOCIALE: varchar("RAISON_SOCIALE", { length: 160 }).default(""),
  ADRESSEP1: varchar("ADRESSEP1", { length: 50 }).default(""),
  ADRESSEP2: varchar("ADRESSEP2", { length: 50 }).default(""),
  CPOSTALP: varchar("CPOSTALP", { length: 9 }).default(""),
  VILLEP: varchar("VILLEP", { length: 30 }).default(""),
  CDPAYSP: varchar("CDPAYSP", { length: 3 }).default(""),
  TELAUTRE: varchar("TELAUTRE", { length: 150 }).default(""),
  NENTREP: varchar("NENTREP", { length: 30 }).default(""),
  SIRET: varchar("SIRET", { length: 21 }).default(""),
  CODE_APE: varchar("CODE_APE", { length: 5 }).default(""),
  NUM_TVA: varchar("NUM_TVA", { length: 15 }).default(""),
  EMAILP: varchar("EMAILP", { length: 50 }).default(""),
  WEBSITEP: varchar("WEBSITEP", { length: 60 }).default(""),
  IFOURNISSEUR: tinyint("IFOURNISSEUR").default(0),
  IDCONTACT_CDE: bigint("IDCONTACT_CDE", { mode: "number" }).default(0),
  COMMENTAIRE: longtext("COMMENTAIRE"),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  EFFECTIFS: int("EFFECTIFS").default(0),
  USDEF_BOO: tinyint("USDEF_BOO"),
  USDEF_CBO: smallint("USDEF_CBO"),
  USDEF_DATE: date("USDEF_DATE"),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  TX_REMISE: float("TX_REMISE").default(0),
  TX_TVACLI: float("TX_TVACLI").default(0),
  REGIME_TVACLI: tinyint("REGIME_TVACLI").default(0),
  CD_DEVISE: varchar("CD_DEVISE", { length: 3 }).default(""),
  ID2MODE_PAIEMENT: tinyint("ID2MODE_PAIEMENT").default(0),
  ID2CDT_FACTUR: tinyint("ID2CDT_FACTUR").default(0),
  ID2FORME_SOCIALE: tinyint("ID2FORME_SOCIALE").default(0),
  TELP1: varchar("TELP1", { length: 18 }).default(""),
  MTT_CAPITAL: bigint("MTT_CAPITAL", { mode: "number" }).default(0),
  TELP2: varchar("TELP2", { length: 18 }).default(""),
  TELP3: varchar("TELP3", { length: 18 }).default(""),
  TYPTELP1: tinyint("TYPTELP1").default(0),
  TYPTELP2: tinyint("TYPTELP2").default(0),
  TYPTELP3: tinyint("TYPTELP3").default(0),
  TX_REMISEMAX: float("TX_REMISEMAX").default(0),
  IBAN: varchar("IBAN", { length: 42 }).default(""),
  BIC: varchar("BIC", { length: 14 }).default(""),
  CDREGIONP: varchar("CDREGIONP", { length: 3 }).default(""),
  REFEXTERNE: varchar("REFEXTERNE", { length: 12 }).default(""),
  TX_RETRO: float("TX_RETRO").default(0),
  US_RESP: varchar("US_RESP", { length: 3 }).default(""),
  ID2CDTCDFOU: tinyint("ID2CDTCDFOU").default(0),
  MTT_FRANCO: int("MTT_FRANCO").default(0),
});

// Table USER (système legacy)
export const userSystem = mysqlTable("USER", {
  IDUSER: bigint("IDUSER", { mode: "number" }).primaryKey().autoincrement(),
  CDUSER: varchar("CDUSER", { length: 3 }).default("").unique(),
  PASSWORD: varchar("PASSWORD", { length: 12 }).default(""),
  IARCHIVE: tinyint("IARCHIVE").default(0),
  NOMFAMILLE: varchar("NOMFAMILLE", { length: 30 }).default(""),
  PRENOM: varchar("PRENOM", { length: 20 }).default(""),
  PARAM_USER: longtext("PARAM_USER"),
  TELBUR: varchar("TELBUR", { length: 18 }).default(""),
  OUVRIR_DEMARRAGE: smallint("OUVRIR_DEMARRAGE").default(0),
  ACTION_Défaut: tinyint("ACTION_Défaut").default(0),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  CHRN_LANC: smallint("CHRN_LANC").default(0),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  DH_SYNCHRO: datetime("DH_SYNCHRO"),
  CHRN_OPAC: tinyint("CHRN_OPAC").default(0),
  CHRN_DELAI: tinyint("CHRN_DELAI").default(0),
  IAUTORISE: tinyint("IAUTORISE").default(0),
  ICONNECTE: tinyint("ICONNECTE").default(0),
  IP_CONNECTION: varchar("IP_CONNECTION", { length: 15 }).default(""),
  DH_CONNECT: datetime("DH_CONNECT", { mode: "string", fsp: 3 }),
  IADMIN: tinyint("IADMIN").default(0),
  ADRESSE1: varchar("ADRESSE1", { length: 50 }).default(""),
  ADRESSE2: varchar("ADRESSE2", { length: 50 }).default(""),
  CPOSTAL: varchar("CPOSTAL", { length: 9 }).default(""),
  VILLE: varchar("VILLE", { length: 30 }).default(""),
  EMAIL: varchar("EMAIL", { length: 64 }).default(""),
  EMAILP: varchar("EMAILP", { length: 50 }).default(""),
  NOM_MAIL: varchar("NOM_MAIL", { length: 40 }).default(""),
  NOM_MAILP: varchar("NOM_MAILP", { length: 40 }).default(""),
  COMMENTAIRE: longtext("COMMENTAIRE"),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  CL_FONDMENU: int("CL_FONDMENU").default(0),
  OPAC_POSTIT: smallint("OPAC_POSTIT").default(0),
  CHRN_AFFICHE: tinyint("CHRN_AFFICHE").default(0),
  CHRN_SON: tinyint("CHRN_SON").default(0),
  NUMSECU: varchar("NUMSECU", { length: 13 }).default(""),
  IAUTMODIF: tinyint("IAUTMODIF").default(0),
  TELDOM: varchar("TELDOM", { length: 18 }).default(""),
  GSMBUR: varchar("GSMBUR", { length: 18 }).default(""),
  IAFF_PREMLIGNE: tinyint("IAFF_PREMLIGNE").default(0),
  TELDET_LANC: smallint("TELDET_LANC").default(0),
  TELDET_SON: tinyint("TELDET_SON").default(0),
  NOM_APPARENT: varchar("NOM_APPARENT", { length: 50 }).default(""),
  ACTION_AFF_AVANT: tinyint("ACTION_AFF_AVANT").default(0),
  CD_LANG: smallint("CD_LANG").default(0),
  MENTIONS_SP: varchar("MENTIONS_SP", { length: 300 }).default(""),
  PHOTO: json("PHOTO"),
  HR_DBT_W: time("HR_DBT_W").default("00:00:00"),
  HR_FIN_W: time("HR_FIN_W").default("00:00:00"),
  JR_DEBUT_SEMAINE: smallint("JR_DEBUT_SEMAINE").default(0),
  DUREE_ACTION_DEFAUT: smallint("DUREE_ACTION_DEFAUT"),
  PRIVILEGES: smallint("PRIVILEGES"),
  IMASQPXACH: tinyint("IMASQPXACH").default(0),
  ISYNCH_GGL: tinyint("ISYNCH_GGL").default(0),
  ISYNCH_OUTLK: tinyint("ISYNCH_OUTLK").default(0),
  IRAPPEL_FACTURE: smallint("IRAPPEL_FACTURE"),
  IRAPPEL_DEVIS: smallint("IRAPPEL_DEVIS").default(0),
  NBJOURS_RAPPEL: smallint("NBJOURS_RAPPEL").default(0),
  NBHR_HEBDO: float("NBHR_HEBDO").default(0),
  POLICE_POSTIT: varchar("POLICE_POSTIT", { length: 20 }).default(""),
  COUL_POSTIT: int("COUL_POSTIT").default(0),
  TAILLEPOL_POSTIT: tinyint("TAILLEPOL_POSTIT").default(0),
  PRIVIL_PGMEXTERNE: smallint("PRIVIL_PGMEXTERNE").default(0),
  PRIVIL_SUP: smallint("PRIVIL_SUP"),
  DH_DERNIERE_LECTURE: datetime("DH_DERNIERE_LECTURE", { mode: "string", fsp: 3 }),
  AFF_ONGLET_PROJET: tinyint("AFF_ONGLET_PROJET"),
  AFF_ONGLET_CONTACT: tinyint("AFF_ONGLET_CONTACT"),
  AFF_MENUS: tinyint("AFF_MENUS"),
  PRIVIL_PATCH: tinyint("PRIVIL_PATCH").default(0),
  PRIVIL_EXPORT: tinyint("PRIVIL_EXPORT").default(0),
  AFF_ONGLET_PRODUIT: tinyint("AFF_ONGLET_PRODUIT"),
  CL_FONDECRAN: int("CL_FONDECRAN").default(0),
  DH_DECONNECT: datetime("DH_DECONNECT", { mode: "string", fsp: 3 }),
  DT_NAISS: date("DT_NAISS"),
  LIEUNAISS: varchar("LIEUNAISS", { length: 36 }).default(""),
  SIGNATURE: json("SIGNATURE"),
  FONCTION_PRO: varchar("FONCTION_PRO", { length: 25 }),
  CDPAYS: varchar("CDPAYS", { length: 3 }).default(""),
  CDREGIONP: varchar("CDREGIONP", { length: 3 }).default(""),
  ADRESSEP1: varchar("ADRESSEP1", { length: 50 }).default(""),
  ADRESSEP2: varchar("ADRESSEP2", { length: 50 }).default(""),
  CPOSTALP: varchar("CPOSTALP", { length: 9 }).default(""),
  VILLEP: varchar("VILLEP", { length: 30 }).default(""),
  CDREGION: varchar("CDREGION", { length: 3 }).default(""),
  CDPAYSP: varchar("CDPAYSP", { length: 3 }).default(""),
  PRIVIL_REFER: tinyint("PRIVIL_REFER").default(0),
  PRIVIL_ADDON: tinyint("PRIVIL_ADDON").default(0),
  DUR_PAUSE: time("DUR_PAUSE").default("00:00:00"),
  ICONF_ABANDON: tinyint("ICONF_ABANDON").default(0),
  ID2POOL: int("ID2POOL").default(0),
  ID2SERVICE: int("ID2SERVICE").default(0),
  IPANIER: tinyint("IPANIER").default(0),
  IEXTERNE: tinyint("IEXTERNE").default(0),
  DT_ENTREE: date("DT_ENTREE"),
  DT_SORTIE: date("DT_SORTIE"),
  IC2CONTRATW: int("IC2CONTRATW").default(0),
  COEFFSAL: varchar("COEFFSAL", { length: 10 }).default(""),
  DHRECONNECT: datetime("DHRECONNECT", { mode: "string", fsp: 3 }),
  TX_REMISEMAX: float("TX_REMISEMAX").default(0),
  CD_PAYSNAISS: varchar("CD_PAYSNAISS", { length: 3 }).default(""),
  USDEF_BOO: tinyint("USDEF_BOO"),
  USDEF_CBO: tinyint("USDEF_CBO"),
  USDEF_DATE: date("USDEF_DATE"),
  USDEF_LIB: varchar("USDEF_LIB", { length: 40 }),
  USDEF_NUM: float("USDEF_NUM"),
  HRDBTCNXAUT: time("HRDBTCNXAUT").default("00:00:00"),
  HRFINCNXAUT: time("HRFINCNXAUT").default("00:00:00"),
  IPCNXAUT: varchar("IPCNXAUT", { length: 15 }),
  PRIVIL_AUTRES: varchar("PRIVIL_AUTRES", { length: 12 }).default(""),
  JRCNXAUT: tinyint("JRCNXAUT"),
  COULAFF: int("COULAFF").default(0),
});

// Table VEHICULE ancienne (renommée pour éviter les conflits)
export const vehiculesOld = mysqlTable("vehicules_old", {
  IDVEHICULE: bigint("IDVEHICULE", { mode: "number" }).primaryKey().autoincrement(),
  IDCONTACT: bigint("IDCONTACT", { mode: "number" }),
  IDMACHINE: int("IDMACHINE").notNull().unique(),
  IDSOCIETE: bigint("IDSOCIETE", { mode: "number" }),
  IMMAT: varchar("IMMAT", { length: 20 }),
  ID2_TYPEVEHIC: tinyint("ID2_TYPEVEHIC"),
  PUISSANCE_ADMIN: tinyint("PUISSANCE_ADMIN"),
  NUM_CNIT: varchar("NUM_CNIT", { length: 25 }),
  NUM_IDENTIF: varchar("NUM_IDENTIF", { length: 25 }),
  NUMSERIE_CLE: text("NUMSERIE_CLE"),
  URL_CONSTRUCTEUR: varchar("URL_CONSTRUCTEUR", { length: 100 }),
  PVIDE: int("PVIDE"),
  PTAC: int("PTAC"),
  PTR: int("PTR"),
  GENRE_NATIONAL: varchar("GENRE_NATIONAL", { length: 5 }),
  CARBURANT: varchar("CARBURANT", { length: 5 }),
  PLACES_ASSISES: int("PLACES_ASSISES"),
  COUT_KM: float("COUT_KM"),
  NUMCONTRASS: varchar("NUMCONTRASS", { length: 24 }),
  DT_ECHASS: date("DT_ECHASS"),
  KMVIDANGE: int("KMVIDANGE"),
  KMACTUEL: int("KMACTUEL"),
  DT_PREMCIRC: date("DT_PREMCIRC"),
  DT_PRCTRL: date("DT_PRCTRL"),
  DT_DERNIEREMAINT: date("DT_DERNIEREMAINT"),
  DT_CTRLTECH: date("DT_CTRLTECH"),
  DT_CTRLPOLLUTION: date("DT_CTRLPOLLUTION"),
  PNEUSAV: varchar("PNEUSAV", { length: 24 }),
  PNEUSAR: varchar("PNEUSAR", { length: 24 }),
  NOTES: text("NOTES"),
  DHCRE: datetime("DHCRE"),
  USCRE: varchar("USCRE", { length: 3 }),
  DHMOD: datetime("DHMOD"),
  USMOD: varchar("USMOD", { length: 3 }),
});

// Schémas d'insertion
export const insertUserSchema = createInsertSchema(users);
export const insertVehicleSchema = createInsertSchema(vehicles);
export const insertInterventionSchema = createInsertSchema(interventions);
export const insertAlertSchema = createInsertSchema(alerts);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertActionSchema = createInsertSchema(actions);
export const insertAnomalieSchema = createInsertSchema(anomalies);
export const insertContactSchema = createInsertSchema(contacts);
export const insertIngredientSchema = createInsertSchema(ingredients);
export const insertMachineMntSchema = createInsertSchema(machinesMnt);
export const insertProduitSchema = createInsertSchema(produits);
export const insertSocieteSchema = createInsertSchema(societes);
export const insertUserSystemSchema = createInsertSchema(userSystem);
export const insertVehiculeSchema = createInsertSchema(vehicules);
export const insertZ83InterventionSchema = createInsertSchema(z83Interventions);

// Table custom_fields pour définir les champs personnalisés
export const customFields = mysqlTable("custom_fields", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  entity_type_id: bigint("entity_type_id", { mode: "number" }).notNull(),
  nom: varchar("nom", { length: 50 }).notNull(),
  label: varchar("label", { length: 150 }).notNull(),
  type: mysqlEnum("type", ["text", "email", "number", "date", "textarea", "select", "switch", "radio"]).notNull(),
  is_protected: tinyint("is_protected").notNull().default(0),
  obligatoire: tinyint("obligatoire").notNull().default(0),
  ordre: int("ordre").notNull().default(0),
  options: json("options"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow()
});

// Table custom_fields_values pour stocker les valeurs des champs personnalisés
export const customFieldsValues = mysqlTable("custom_fields_values", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  custom_field_id: bigint("custom_field_id", { mode: "number" }).notNull(),
  entity_type_id: bigint("entity_type_id", { mode: "number" }).notNull(),
  entity_id: bigint("entity_id", { mode: "number" }).notNull(),
  valeur: longtext("valeur"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow()
});

// Table forms pour stocker les métadonnées des formulaires personnalisés
export const forms = mysqlTable("forms", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  nom: varchar("nom", { length: 100 }).notNull(),
  description: longtext("description"),
  entity_type_id: bigint("entity_type_id", { mode: "number" }).notNull(), // 1=véhicule, 3=intervention, etc.
  is_active: tinyint("is_active").notNull().default(1), // 1=actif, 0=inactif
  created_by: varchar("created_by", { length: 10 }).default("WEB"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow()
});

// Table forms_fields pour stocker les champs des formulaires
export const formsFields = mysqlTable("forms_fields", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  idforms: bigint("idforms", { mode: "number" }).notNull(), // Référence vers forms.id
  nom: varchar("nom", { length: 50 }).notNull(),
  label: varchar("label", { length: 150 }).notNull(),
  type: mysqlEnum("type", ["text", "email", "number", "date", "datetime", "textarea", "select", "radio", "checkbox", "switch", "file"]).notNull(),
  taille: varchar("taille", { length: 20 }).default("medium"), // small, medium, large, full
  obligatoire: tinyint("obligatoire").notNull().default(0),
  ordre: int("ordre").notNull().default(0),
  groupe: varchar("groupe", { length: 50 }).default("General"), // Nom du groupe
  ordre_groupe: int("ordre_groupe").notNull().default(0),
  options: json("options"), // Pour select/radio: {values: [{value, label}]}, placeholder, etc.
  validation: json("validation"), // Règles de validation: {min, max, pattern, required, etc.}
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow()
});

// Table forms_fields_values pour stocker les valeurs des formulaires remplis
export const formsFieldsValues = mysqlTable("forms_fields_values", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  forms_field_id: bigint("forms_field_id", { mode: "number" }).notNull(), // Référence vers forms_fields.id
  entity_id: bigint("entity_id", { mode: "number" }).notNull(), // ID de l'entité (intervention, véhicule, etc.)
  valeur: longtext("valeur"),
  created_by: varchar("created_by", { length: 10 }).default("WEB"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow()
});

export type CustomField = typeof customFields.$inferSelect;
export type InsertCustomField = typeof customFields.$inferInsert;
export type CustomFieldValue = typeof customFieldsValues.$inferSelect;
export type InsertCustomFieldValue = typeof customFieldsValues.$inferInsert;

// Types TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertIntervention = z.infer<typeof insertInterventionSchema>;
export type Intervention = typeof interventions.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertAction = z.infer<typeof insertActionSchema>;
export type Action = typeof actions.$inferSelect;
export type InsertAnomalie = z.infer<typeof insertAnomalieSchema>;
export type Anomalie = typeof anomalies.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;
export type InsertMachineMnt = z.infer<typeof insertMachineMntSchema>;
export type MachineMnt = typeof machinesMnt.$inferSelect;
export type InsertProduit = z.infer<typeof insertProduitSchema>;
export type Produit = typeof produits.$inferSelect;
export type InsertSociete = z.infer<typeof insertSocieteSchema>;
export type Societe = typeof societes.$inferSelect;
export type InsertUserSystem = z.infer<typeof insertUserSystemSchema>;
export type UserSystem = typeof userSystem.$inferSelect;
export type InsertVehicule = z.infer<typeof insertVehiculeSchema>;
export type Vehicule = typeof vehicules.$inferSelect;
export type InsertMachineMnt = z.infer<typeof insertMachineMntSchema>;
export type MachineMnt = typeof machinesMnt.$inferSelect;
export type InsertZ83Intervention = z.infer<typeof insertZ83InterventionSchema>;
export type Z83Intervention = typeof z83Interventions.$inferSelect;

// Types pour les formulaires personnalisés
export type Form = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;
export type FormField = typeof formsFields.$inferSelect;
export type InsertFormField = typeof formsFields.$inferInsert;
export type FormFieldValue = typeof formsFieldsValues.$inferSelect;
export type InsertFormFieldValue = typeof formsFieldsValues.$inferInsert;

// ================================================================
// TABLES PWA POUR FONCTIONNALITÉS OFFLINE
// ================================================================

// Table pour stocker les médias (photos, signatures, documents)
export const interventionMedia = mysqlTable("INTERVENTION_MEDIA", {
  ID: bigint("ID", { mode: "number" }).primaryKey().autoincrement(),
  IDINTERVENTION: bigint("IDINTERVENTION", { mode: "number" }).notNull(),
  FILENAME: varchar("FILENAME", { length: 255 }).notNull(),
  ORIGINAL_NAME: varchar("ORIGINAL_NAME", { length: 255 }),
  FILE_PATH: varchar("FILE_PATH", { length: 500 }),
  MIMETYPE: varchar("MIMETYPE", { length: 100 }),
  SIZE: bigint("SIZE", { mode: "number" }),
  TYPE: mysqlEnum("TYPE", ["photo", "signature", "document"]).notNull(),
  DESCRIPTION: text("DESCRIPTION"),
  GPS_LATITUDE: decimal("GPS_LATITUDE", { precision: 10, scale: 8 }),
  GPS_LONGITUDE: decimal("GPS_LONGITUDE", { precision: 11, scale: 8 }),
  TAKEN_AT: datetime("TAKEN_AT", { mode: "string", fsp: 3 }),
  CDUSER: varchar("CDUSER", { length: 10 }),
  CREATED_AT: datetime("CREATED_AT", { mode: "string", fsp: 3 }),
  UPDATED_AT: datetime("UPDATED_AT", { mode: "string", fsp: 3 }),
});

// Table pour la synchronisation offline
export const interventionSync = mysqlTable("INTERVENTION_SYNC", {
  ID: bigint("ID", { mode: "number" }).primaryKey().autoincrement(),
  IDINTERVENTION: bigint("IDINTERVENTION", { mode: "number" }).notNull(),
  SYNC_STATUS: mysqlEnum("SYNC_STATUS", ["pending", "synced", "error"]).default("pending"),
  OFFLINE_DATA: longtext("OFFLINE_DATA"),
  ERROR_MESSAGE: text("ERROR_MESSAGE"),
  LAST_SYNC: datetime("LAST_SYNC", { mode: "string", fsp: 3 }),
  CDUSER: varchar("CDUSER", { length: 10 }),
  CREATED_AT: datetime("CREATED_AT", { mode: "string", fsp: 3 }),
  UPDATED_AT: datetime("UPDATED_AT", { mode: "string", fsp: 3 }),
});

// Table pour stocker les données offline des techniciens
export const pwaOfflineCache = mysqlTable("PWA_OFFLINE_CACHE", {
  ID: bigint("ID", { mode: "number" }).primaryKey().autoincrement(),
  CDUSER: varchar("CDUSER", { length: 10 }).notNull(),
  CACHE_KEY: varchar("CACHE_KEY", { length: 255 }).notNull(),
  CACHE_DATA: longtext("CACHE_DATA").notNull(),
  EXPIRES_AT: datetime("EXPIRES_AT", { mode: "string", fsp: 3 }),
  CREATED_AT: datetime("CREATED_AT", { mode: "string", fsp: 3 }),
  UPDATED_AT: datetime("UPDATED_AT", { mode: "string", fsp: 3 }),
});

// Table pour les paramètres PWA par utilisateur
export const pwaSettings = mysqlTable("PWA_SETTINGS", {
  ID: bigint("ID", { mode: "number" }).primaryKey().autoincrement(),
  CDUSER: varchar("CDUSER", { length: 10 }).notNull().unique(),
  PUSH_NOTIFICATIONS: tinyint("PUSH_NOTIFICATIONS").default(1),
  OFFLINE_SYNC_INTERVAL: int("OFFLINE_SYNC_INTERVAL").default(300),
  AUTO_PHOTO_UPLOAD: tinyint("AUTO_PHOTO_UPLOAD").default(1),
  GPS_TRACKING: tinyint("GPS_TRACKING").default(1),
  SETTINGS_JSON: json("SETTINGS_JSON"),
  CREATED_AT: datetime("CREATED_AT", { mode: "string", fsp: 3 }),
  UPDATED_AT: datetime("UPDATED_AT", { mode: "string", fsp: 3 }),
});

// Schémas Zod pour les nouvelles tables PWA
export const insertInterventionMediaSchema = createInsertSchema(interventionMedia);
export const insertInterventionSyncSchema = createInsertSchema(interventionSync);
export const insertPwaOfflineCacheSchema = createInsertSchema(pwaOfflineCache);
export const insertPwaSettingsSchema = createInsertSchema(pwaSettings);

// Types TypeScript pour les nouvelles tables PWA
export type InterventionMedia = typeof interventionMedia.$inferSelect;
export type InsertInterventionMedia = typeof interventionMedia.$inferInsert;
export type InterventionSync = typeof interventionSync.$inferSelect;
export type InsertInterventionSync = typeof interventionSync.$inferInsert;
export type PwaOfflineCache = typeof pwaOfflineCache.$inferSelect;
export type InsertPwaOfflineCache = typeof pwaOfflineCache.$inferInsert;
export type PwaSettings = typeof pwaSettings.$inferSelect;
export type InsertPwaSettings = typeof pwaSettings.$inferInsert;
