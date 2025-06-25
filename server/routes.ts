import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Vehicles API
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(parseInt(req.params.id));
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicle = await storage.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  app.put("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.updateVehicle(parseInt(req.params.id), req.body);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVehicle(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Interventions API
  app.get("/api/interventions", async (req, res) => {
    try {
      const interventions = await storage.getAllInterventions();
      res.json(interventions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interventions" });
    }
  });

  app.get("/api/interventions/:id", async (req, res) => {
    try {
      const intervention = await storage.getIntervention(parseInt(req.params.id));
      if (!intervention) {
        return res.status(404).json({ error: "Intervention not found" });
      }
      res.json(intervention);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch intervention" });
    }
  });

  app.post("/api/interventions", async (req, res) => {
    try {
      const intervention = await storage.createIntervention(req.body);
      res.status(201).json(intervention);
    } catch (error) {
      res.status(500).json({ error: "Failed to create intervention" });
    }
  });

  app.put("/api/interventions/:id", async (req, res) => {
    try {
      const intervention = await storage.updateIntervention(parseInt(req.params.id), req.body);
      if (!intervention) {
        return res.status(404).json({ error: "Intervention not found" });
      }
      res.json(intervention);
    } catch (error) {
      res.status(500).json({ error: "Failed to update intervention" });
    }
  });

  // Alerts API
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alert = await storage.createAlert(req.body);
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to create alert" });
    }
  });

  // Users API
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
