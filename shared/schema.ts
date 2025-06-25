import { pgTable, text, serial, integer, varchar, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["admin", "manager", "technician", "driver"]);
export const statusEnum = pgEnum("status", ["active", "inactive", "pending"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["essence", "diesel", "electrique", "hybride"]);
export const vehicleStatusEnum = pgEnum("vehicle_status", ["active", "maintenance", "inactive"]);
export const interventionTypeEnum = pgEnum("intervention_type", ["maintenance", "reparation", "controle", "diagnostic", "nettoyage", "convoyage", "conciergerie"]);
export const interventionStatusEnum = pgEnum("intervention_status", ["scheduled", "in_progress", "completed", "cancelled"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const alertCategoryEnum = pgEnum("alert_category", ["maintenance", "compliance", "insurance", "usage"]);
export const alertStatusEnum = pgEnum("alert_status", ["active", "resolved"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: roleEnum("role").notNull().default("driver"),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  plate: varchar("plate", { length: 20 }).notNull().unique(),
  model: varchar("model", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 50 }),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull().default(0),
  vin: varchar("vin", { length: 17 }).unique(),
  color: varchar("color", { length: 30 }),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  enginePower: varchar("engine_power", { length: 20 }),
  status: vehicleStatusEnum("status").notNull().default("active"),
  insurance: timestamp("insurance"),
  technicalControl: timestamp("technical_control"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertUserSchema = createInsertSchema(users);
export const insertVehicleSchema = createInsertSchema(vehicles);
export const insertInterventionSchema = createInsertSchema(interventions);
export const insertAlertSchema = createInsertSchema(alerts);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertIntervention = z.infer<typeof insertInterventionSchema>;
export type Intervention = typeof interventions.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
