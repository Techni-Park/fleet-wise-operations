import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, vehicles, interventions, alerts, documents, type User, type InsertUser, type Vehicle, type InsertVehicle, type Intervention, type InsertIntervention, type Alert, type InsertAlert, type Document, type InsertDocument } from "@shared/schema";

export interface IStorage {
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
}

export class MySQLStorage implements IStorage {
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
}

export const storage = new MySQLStorage();
