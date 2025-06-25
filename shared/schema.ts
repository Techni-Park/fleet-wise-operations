import { mysqlTable, text, int, varchar, datetime, decimal, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: mysqlEnum("role", ["admin", "manager", "technician", "driver"]).notNull().default("driver"),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
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

export const interventions = mysqlTable("interventions", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["maintenance", "reparation", "controle", "diagnostic", "nettoyage", "convoyage", "conciergerie"]).notNull(),
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).notNull().default("scheduled"),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).notNull().default("medium"),
  vehicleId: int("vehicle_id").notNull(),
  technicianId: int("technician_id"),
  scheduledDate: datetime("scheduled_date"),
  startDate: datetime("start_date"),
  completedDate: datetime("completed_date"),
  estimatedDuration: varchar("estimated_duration", { length: 20 }),
  actualDuration: varchar("actual_duration", { length: 20 }),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
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

export const documents = mysqlTable("DOCUMENT", {
  ID: int("ID").primaryKey().autoincrement(),
  IDDOCUMENT: int("IDDOCUMENT").unique(),
  CDUSER: varchar("CDUSER", { length: 3 }).default(""),
  LIB100: varchar("LIB100", { length: 100 }).default(""),
  FILEREF: varchar("FILEREF", { length: 256 }).default(""),
  COMMENTAIRE: text("COMMENTAIRE"),
  IDCONTACT: int("IDCONTACT").default(0),
  DHCRE: datetime("DHCRE", { mode: "string", fsp: 3 }),
  USCRE: varchar("USCRE", { length: 3 }).default(""),
  DHMOD: datetime("DHMOD", { mode: "string", fsp: 3 }),
  USMOD: varchar("USMOD", { length: 3 }).default(""),
  DT_DOC: datetime("DT_DOC", { mode: "date" }),
  IDPROJET: int("IDPROJET").default(0),
  IDTACHE: int("IDTACHE").default(0),
  ID2GENRE_DOCUMENT: int("ID2GENRE_DOCUMENT").default(0),
  XXTRIGRAMME: varchar("XXTRIGRAMME", { length: 3 }).default(""),
  XXIDNUMCIBLE: int("XXIDNUMCIBLE").default(0),
  IDFICHIERBRUT: int("IDFICHIERBRUT").default(0),
  ID2STATUT_DOC: int("ID2STATUT_DOC").default(0),
  IDDOSSIERCLASS: int("IDDOSSIERCLASS").default(0),
  TRGCIBLE: varchar("TRGCIBLE", { length: 11 }).default(""),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
  DH_SYNCHRO: datetime("DH_SYNCHRO"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertVehicleSchema = createInsertSchema(vehicles);
export const insertInterventionSchema = createInsertSchema(interventions);
export const insertAlertSchema = createInsertSchema(alerts);
export const insertDocumentSchema = createInsertSchema(documents);

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
