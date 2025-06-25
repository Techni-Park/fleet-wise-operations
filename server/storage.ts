import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, vehicles, interventions, alerts, documents, actions, anomalies, contacts, ingredients, machinesMnt, produits, societes, userSystem, vehicules,
  type User, type InsertUser, type Vehicle, type InsertVehicle, type Intervention, type InsertIntervention, 
  type Alert, type InsertAlert, type Document, type InsertDocument, type Action, type InsertAction,
  type Anomalie, type InsertAnomalie, type Contact, type InsertContact, type Ingredient, type InsertIngredient,
  type MachineMnt, type InsertMachineMnt, type Produit, type InsertProduit, type Societe, type InsertSociete,
  type UserSystem, type InsertUserSystem, type Vehicule, type InsertVehicule
} from "@shared/schema";

export interface IStorage {
  // Test de connexion
  testConnection(): Promise<any[]>;
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Vehicles
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByPlate(plate: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  getAllVehicles(): Promise<Vehicle[]>;

  // Interventions
  getIntervention(id: number): Promise<Intervention | undefined>;
  createIntervention(intervention: InsertIntervention): Promise<Intervention>;
  updateIntervention(id: number, intervention: Partial<InsertIntervention>): Promise<Intervention | undefined>;
  deleteIntervention(id: number): Promise<boolean>;
  getAllInterventions(): Promise<Intervention[]>;
  getInterventionsByVehicle(vehicleId: number): Promise<Intervention[]>;

  // Alerts
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;
  getAllAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;

  // Documents
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  getAllDocuments(): Promise<Document[]>;
  getDocumentsByProject(projectId: number): Promise<Document[]>;

  // Actions
  getAction(id: number): Promise<Action | undefined>;
  getAllActions(): Promise<Action[]>;
  createAction(action: InsertAction): Promise<Action>;

  // Contacts
  getContact(id: number): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Machines
  getMachine(id: number): Promise<MachineMnt | undefined>;
  getAllMachines(): Promise<MachineMnt[]>;
  createMachine(machine: InsertMachineMnt): Promise<MachineMnt>;

  // Produits
  getProduit(id: number): Promise<Produit | undefined>;
  getAllProduits(): Promise<Produit[]>;
  createProduit(produit: InsertProduit): Promise<Produit>;

  // Societes
  getSociete(id: number): Promise<Societe | undefined>;
  getAllSocietes(): Promise<Societe[]>;
  createSociete(societe: InsertSociete): Promise<Societe>;

  // Vehicules
  getVehicule(id: number): Promise<Vehicule | undefined>;
  getAllVehicules(): Promise<Vehicule[]>;
  createVehicule(vehicule: InsertVehicule): Promise<Vehicule>;

  // Anomalies
  getAnomalie(id: number): Promise<Anomalie | undefined>;
  getAllAnomalies(): Promise<Anomalie[]>;
  createAnomalie(anomalie: InsertAnomalie): Promise<Anomalie>;

  // Ingredients
  getIngredient(id: number): Promise<Ingredient | undefined>;
  getAllIngredients(): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
}

export class MySQLStorage implements IStorage {
  async testConnection(): Promise<any[]> {
    const result = await db.execute(sql`SHOW TABLES`);
    return result;
  }
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user);
    const insertId = result[0].insertId as number;
    const newUser = await this.getUser(insertId);
    return newUser!;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    await db.update(users).set(user).where(eq(users.id, id));
    return this.getUser(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Vehicles
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return result[0];
  }

  async getVehicleByPlate(plate: string): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles).where(eq(vehicles.plate, plate)).limit(1);
    return result[0];
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const result = await db.insert(vehicles).values(vehicle);
    const insertId = result[0].insertId as number;
    const newVehicle = await this.getVehicle(insertId);
    return newVehicle!;
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    await db.update(vehicles).set(vehicle).where(eq(vehicles.id, id));
    return this.getVehicle(id);
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return db.select().from(vehicles);
  }

  // Interventions
  async getIntervention(id: number): Promise<Intervention | undefined> {
    const result = await db.select().from(interventions).where(eq(interventions.id, id)).limit(1);
    return result[0];
  }

  async createIntervention(intervention: InsertIntervention): Promise<Intervention> {
    const result = await db.insert(interventions).values(intervention);
    const insertId = result[0].insertId as number;
    const newIntervention = await this.getIntervention(insertId);
    return newIntervention!;
  }

  async updateIntervention(id: number, intervention: Partial<InsertIntervention>): Promise<Intervention | undefined> {
    await db.update(interventions).set(intervention).where(eq(interventions.id, id));
    return this.getIntervention(id);
  }

  async deleteIntervention(id: number): Promise<boolean> {
    const result = await db.delete(interventions).where(eq(interventions.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllInterventions(): Promise<Intervention[]> {
    return db.select().from(interventions);
  }

  async getInterventionsByVehicle(vehicleId: number): Promise<Intervention[]> {
    return db.select().from(interventions).where(eq(interventions.vehicleId, vehicleId));
  }

  // Alerts
  async getAlert(id: number): Promise<Alert | undefined> {
    const result = await db.select().from(alerts).where(eq(alerts.id, id)).limit(1);
    return result[0];
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(alert);
    const insertId = result[0].insertId as number;
    const newAlert = await this.getAlert(insertId);
    return newAlert!;
  }

  async updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert | undefined> {
    await db.update(alerts).set(alert).where(eq(alerts.id, id));
    return this.getAlert(id);
  }

  async deleteAlert(id: number): Promise<boolean> {
    const result = await db.delete(alerts).where(eq(alerts.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllAlerts(): Promise<Alert[]> {
    return db.select().from(alerts);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return db.select().from(alerts).where(eq(alerts.status, "active"));
  }

  // Documents
  async getDocument(id: number): Promise<Document | undefined> {
    const result = await db.select().from(documents).where(eq(documents.ID, id)).limit(1);
    return result[0];
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(document);
    const insertId = result[0].insertId as number;
    const newDocument = await this.getDocument(insertId);
    return newDocument!;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    await db.update(documents).set(document).where(eq(documents.ID, id));
    return this.getDocument(id);
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.ID, id));
    return result[0].affectedRows > 0;
  }

  async getAllDocuments(): Promise<Document[]> {
    return db.select().from(documents);
  }

  async getDocumentsByProject(projectId: number): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.IDPROJET, projectId));
  }

  // Actions
  async getAction(id: number): Promise<Action | undefined> {
    const result = await db.select().from(actions).where(eq(actions.IDACTION, id)).limit(1);
    return result[0];
  }

  async getAllActions(): Promise<Action[]> {
    return db.select().from(actions);
  }

  async createAction(action: InsertAction): Promise<Action> {
    const result = await db.insert(actions).values(action);
    const insertId = result[0].insertId as number;
    const newAction = await this.getAction(insertId);
    return newAction!;
  }

  // Contacts
  async getContact(id: number): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.IDCONTACT, id)).limit(1);
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return db.select().from(contacts);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact);
    const insertId = result[0].insertId as number;
    const newContact = await this.getContact(insertId);
    return newContact!;
  }

  // Machines
  async getMachine(id: number): Promise<MachineMnt | undefined> {
    const result = await db.select().from(machinesMnt).where(eq(machinesMnt.IDMACHINE, id)).limit(1);
    return result[0];
  }

  async getAllMachines(): Promise<MachineMnt[]> {
    return db.select().from(machinesMnt);
  }

  async createMachine(machine: InsertMachineMnt): Promise<MachineMnt> {
    const result = await db.insert(machinesMnt).values(machine);
    const insertId = result[0].insertId as number;
    const newMachine = await this.getMachine(insertId);
    return newMachine!;
  }

  // Produits
  async getProduit(id: number): Promise<Produit | undefined> {
    const result = await db.select().from(produits).where(eq(produits.IDPRODUIT, id)).limit(1);
    return result[0];
  }

  async getAllProduits(): Promise<Produit[]> {
    return db.select().from(produits);
  }

  async createProduit(produit: InsertProduit): Promise<Produit> {
    const result = await db.insert(produits).values(produit);
    const insertId = result[0].insertId as number;
    const newProduit = await this.getProduit(insertId);
    return newProduit!;
  }

  // Societes
  async getSociete(id: number): Promise<Societe | undefined> {
    const result = await db.select().from(societes).where(eq(societes.IDSOCIETE, id)).limit(1);
    return result[0];
  }

  async getAllSocietes(): Promise<Societe[]> {
    return db.select().from(societes);
  }

  async createSociete(societe: InsertSociete): Promise<Societe> {
    const result = await db.insert(societes).values(societe);
    const insertId = result[0].insertId as number;
    const newSociete = await this.getSociete(insertId);
    return newSociete!;
  }

  // Vehicules
  async getVehicule(id: number): Promise<Vehicule | undefined> {
    const result = await db.select().from(vehicules).where(eq(vehicules.IDVEHICULE, id)).limit(1);
    return result[0];
  }

  async getAllVehicules(): Promise<Vehicule[]> {
    return db.select().from(vehicules);
  }

  async createVehicule(vehicule: InsertVehicule): Promise<Vehicule> {
    const result = await db.insert(vehicules).values(vehicule);
    const insertId = result[0].insertId as number;
    const newVehicule = await this.getVehicule(insertId);
    return newVehicule!;
  }

  // Anomalies
  async getAnomalie(id: number): Promise<Anomalie | undefined> {
    const result = await db.select().from(anomalies).where(eq(anomalies.IDANOMALIE, id)).limit(1);
    return result[0];
  }

  async getAllAnomalies(): Promise<Anomalie[]> {
    return db.select().from(anomalies);
  }

  async createAnomalie(anomalie: InsertAnomalie): Promise<Anomalie> {
    const result = await db.insert(anomalies).values(anomalie);
    const insertId = result[0].insertId as number;
    const newAnomalie = await this.getAnomalie(insertId);
    return newAnomalie!;
  }

  // Ingredients
  async getIngredient(id: number): Promise<Ingredient | undefined> {
    const result = await db.select().from(ingredients).where(eq(ingredients.IDINGREDIENT, id)).limit(1);
    return result[0];
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return db.select().from(ingredients);
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const result = await db.insert(ingredients).values(ingredient);
    const insertId = result[0].insertId as number;
    const newIngredient = await this.getIngredient(insertId);
    return newIngredient!;
  }
}

export const storage = new MySQLStorage();
