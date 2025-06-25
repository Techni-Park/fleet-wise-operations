import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test de connexion à la base de données
  app.get("/api/db-test", async (req, res) => {
    try {
      const tables = await storage.testConnection();
      res.json({ 
        success: true, 
        message: "Connexion MySQL réussie", 
        database: "gestinter_test",
        tables: tables.length,
        tableNames: tables.map(t => t.Tables_in_gestinter_test || Object.values(t)[0])
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API pour récupérer les données des tables existantes
  app.get("/api/machines", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anomalies", async (req, res) => {
    try {
      const anomalies = await storage.getAllAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
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

  // Documents API
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(parseInt(req.params.id));
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const document = await storage.createDocument(req.body);
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.updateDocument(parseInt(req.params.id), req.body);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDocument(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  app.get("/api/documents/project/:projectId", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByProject(parseInt(req.params.projectId));
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project documents" });
    }
  });

  // Actions API
  app.get("/api/actions", async (req, res) => {
    try {
      const actions = await storage.getAllActions();
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch actions" });
    }
  });

  app.get("/api/actions/:id", async (req, res) => {
    try {
      const action = await storage.getAction(parseInt(req.params.id));
      if (!action) {
        return res.status(404).json({ error: "Action not found" });
      }
      res.json(action);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch action" });
    }
  });

  // Contacts API
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  // Machines API
  app.get("/api/machines", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch machines" });
    }
  });

  app.get("/api/machines/:id", async (req, res) => {
    try {
      const machine = await storage.getMachine(parseInt(req.params.id));
      if (!machine) {
        return res.status(404).json({ error: "Machine not found" });
      }
      res.json(machine);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch machine" });
    }
  });

  app.post("/api/machines", async (req, res) => {
    try {
      const machine = await storage.createMachine(req.body);
      res.status(201).json(machine);
    } catch (error) {
      res.status(500).json({ error: "Failed to create machine" });
    }
  });

  // Produits API
  app.get("/api/produits", async (req, res) => {
    try {
      const produits = await storage.getAllProduits();
      res.json(produits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch produits" });
    }
  });

  // Societes API
  app.get("/api/societes", async (req, res) => {
    try {
      const societes = await storage.getAllSocietes();
      res.json(societes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch societes" });
    }
  });

  // Vehicules API
  app.get("/api/vehicules", async (req, res) => {
    try {
      const vehicules = await storage.getAllVehicules();
      res.json(vehicules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicules" });
    }
  });

  app.get("/api/vehicules/:id", async (req, res) => {
    try {
      const vehicule = await storage.getVehicule(parseInt(req.params.id));
      if (!vehicule) {
        return res.status(404).json({ error: "Vehicule not found" });
      }
      res.json(vehicule);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicule" });
    }
  });

  app.post("/api/vehicules", async (req, res) => {
    try {
      const vehicule = await storage.createVehicule(req.body);
      res.status(201).json(vehicule);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vehicule" });
    }
  });

  // Anomalies API
  app.get("/api/anomalies", async (req, res) => {
    try {
      const anomalies = await storage.getAllAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anomalies" });
    }
  });

  // Ingredients API
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredients" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
