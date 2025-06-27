import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";
  import "./passport-config"; // Import the passport configuration
  import { storage } from "./storage";
  import { db } from "./db";

// Configuration multer pour l'upload en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter images et documents
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|pdf|doc|docx|txt|xlsx|xls/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

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
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // API pour récupérer les données des tables existantes
  app.get("/api/machines", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/anomalies", async (req, res) => {
    try {
      const anomalies = await storage.getAllAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
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

  // Interventions API - données réelles MySQL avec pagination
  app.get("/api/interventions", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const result = await storage.getAllInterventions(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Erreur API interventions:', error);
      res.status(500).json({ error: (error as Error).message });
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

  // Interventions par véhicule
  app.get("/api/vehicles/:vehicleId/interventions", async (req, res) => {
    try {
      const interventions = await storage.getInterventionsByVehicle(parseInt(req.params.vehicleId));
      res.json(interventions);
    } catch (error) {
      console.error('Erreur API interventions par véhicule:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Documents d'intervention
  app.get("/api/interventions/:id/documents", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByIntervention(parseInt(req.params.id));
      res.json(documents);
    } catch (error) {
      console.error('Erreur API documents intervention:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/interventions/:id/documents", async (req, res) => {
    try {
      const document = await storage.createInterventionDocument(parseInt(req.params.id), req.body);
      res.status(201).json(document);
    } catch (error) {
      console.error('Erreur création document intervention:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Upload de photos pour l'onglet Rapport/Photos (TRGCIBLE = INTxxx)
  app.post("/api/interventions/:id/photos/upload", upload.single('file'), async (req, res) => {
    try {
      const interventionId = parseInt(req.params.id);
      const file = req.file;
      const cduser = req.body.cduser || 'WEB';

      if (!file) {
        return res.status(400).json({ error: "Aucun fichier fourni" });
      }

      // Sauvegarder la photo dans le sous-dossier INT{id} avec TRGCIBLE = INTxxx et IDCONTACT
      const comment = req.body.comment || '';
      const document = await storage.savePhotoToInterventionReport(interventionId, file, cduser, comment);
      console.log('📷 Photo rapport créée:', { 
        id: document.IDDOCUMENT, 
        trgcible: document.TRGCIBLE,
        idcontact: document.IDCONTACT,
        fileref: document.FILEREF 
      });

      res.status(201).json({ 
        document,
        message: "Photo ajoutée au rapport avec succès"
      });
    } catch (error) {
      console.error('Erreur upload photo rapport:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Commentaires d'intervention
  app.get("/api/interventions/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getInterventionComments(parseInt(req.params.id));
      res.json(comments);
    } catch (error) {
      console.error('Erreur API commentaires intervention:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/interventions/:id/comments", async (req, res) => {
    try {
      const comment = await storage.createInterventionComment(parseInt(req.params.id), req.body);
      res.status(201).json(comment);
    } catch (error) {
      console.error('Erreur création commentaire intervention:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Chat d'intervention
  app.get("/api/interventions/:id/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      console.error('Erreur API messages chat intervention:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/interventions/:id/chat", async (req, res) => {
    try {
      const message = await storage.createChatMessage(parseInt(req.params.id), req.body);
      res.status(201).json(message);
    } catch (error) {
      console.error('Erreur création message chat intervention:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Upload de fichiers pour le chat
  app.post("/api/interventions/:id/chat/upload", upload.single('file'), async (req, res) => {
    try {
      const interventionId = parseInt(req.params.id);
      const file = req.file;
      const cduser = req.body.cduser || 'WEB';

      if (!file) {
        return res.status(400).json({ error: "Aucun fichier fourni" });
      }

      // 1. Sauvegarder le fichier physiquement et créer l'entrée DOCUMENT
      const document = await storage.saveFileToIntervention(interventionId, file, cduser);
      console.log('📄 Document créé:', { id: document.IDDOCUMENT, fileref: document.FILEREF });

      // 2. Créer l'action dans le chat
      const comment = req.body.comment || '';
      const actionData = {
        CLE_PIECE_CIBLE: `INT${interventionId}`,
        LIB100: file.mimetype.startsWith('image/') ? 'Photo partagée' : 'Document partagé',
        COMMENTAIRE: comment || `${file.mimetype.startsWith('image/') ? 'Photo' : 'Document'}: ${file.originalname}`,
        CDUSER: cduser,
        TYPACT: 10,
        ID2GENRE_ACTION: 1,
        IDACTION_PREC: parseInt(req.body.replyTo || '0') || 0,
      };

      const action = await storage.createChatMessage(interventionId, actionData);
      console.log('💬 Action créée:', { id: action.IDACTION, lib: action.LIB100 });

      // 3. Lier le document à l'action
      if (action && document) {
        const trgcible = `ACT${action.IDACTION}`;
        console.log('🔗 Liaison document-action:', { docId: document.IDDOCUMENT, trgcible });
        
        const updatedDocument = await storage.updateDocument(document.IDDOCUMENT, {
          TRGCIBLE: trgcible
        });
        
        console.log('✅ Document mis à jour:', { 
          id: updatedDocument?.IDDOCUMENT, 
          trgcible: updatedDocument?.TRGCIBLE 
        });
      } else {
        console.error('❌ Erreur: action ou document manquant', { 
          actionExists: !!action, 
          documentExists: !!document 
        });
      }

      res.status(201).json({ 
        action,
        document,
        message: "Fichier uploadé avec succès"
      });
    } catch (error) {
      console.error('Erreur upload fichier chat:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Instructions avancées Z83_INTERVENTION
  app.get("/api/interventions/:id/instructions", async (req, res) => {
    try {
      const instructions = await storage.getZ83Intervention(parseInt(req.params.id));
      res.json(instructions || { INSTRUCTIONS: '' });
    } catch (error) {
      console.error('Erreur API instructions:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/interventions/:id/instructions", async (req, res) => {
    try {
      const { instructions } = req.body;
      const userId = req.body.userId || 'WEB';
      const result = await storage.createOrUpdateZ83Intervention(
        parseInt(req.params.id), 
        instructions, 
        userId
      );
      res.json(result);
    } catch (error) {
      console.error('Erreur sauvegarde instructions:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Téléchargement de documents
  app.get("/api/documents/:id/download", async (req, res) => {
    try {
      const document = await storage.getDocument(parseInt(req.params.id));
      if (!document) {
        return res.status(404).json({ error: "Document non trouvé" });
      }

      // Construire le chemin du fichier
      let fullPath: string;
      
      if (document.FILEREF.startsWith('/photos/')) {
        // Nouveau système : fichiers dans /dist/public/assets/photos/
        fullPath = path.join(process.cwd(), 'dist', 'public', 'assets', document.FILEREF);
      } else if (document.FILEREF.startsWith('/assets/')) {
        // Système intermédiaire : fichiers dans /dist/public/assets/
        fullPath = path.join(process.cwd(), 'dist', 'public', document.FILEREF);
      } else {
        // Ancien système : fichiers dans uploads/
        fullPath = path.join(process.cwd(), 'uploads', document.FILEREF);
      }

      // Vérifier si le fichier existe
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "Fichier non trouvé sur le serveur" });
      }

      // Définir le type de contenu
      const ext = path.extname(document.FILEREF).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${document.LIB100}"`);

      // Envoyer le fichier
      res.sendFile(fullPath);
    } catch (error) {
      console.error('Erreur téléchargement document:', error);
      res.status(500).json({ error: (error as Error).message });
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

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUser(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
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

  app.get("/api/contacts/collaborators/:companyName/:currentContactId", async (req, res) => {
    try {
      const collaborators = await storage.getCollaborators(req.params.companyName, parseInt(req.params.currentContactId));
      res.json(collaborators);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaborators" });
    }
  });

  // Contacts API
  app.get("/api/contacts", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const { contacts, total } = await storage.getAllContacts(page, limit);
      res.json({ contacts, total, page, limit });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(parseInt(req.params.id));
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
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

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateContact(parseInt(req.params.id), req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContact(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
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

  // Vehicules API
  app.get("/api/vehicules", async (req, res) => {
    try {
      const vehicules = await storage.getAllVehicules();
      res.json(vehicules);
    } catch (error) {
      console.error('Erreur API vehicules:', error);
      res.status(500).json({ error: error.message });
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
      const { vehicleData, machineData, customFields } = req.body;
      
      if (vehicleData && machineData) {
        // Création avec les deux tables
        const vehicule = await storage.createVehiculeWithMachine(vehicleData, machineData, customFields);
        res.status(201).json(vehicule);
      } else {
        // Fallback pour l'ancienne méthode
        const vehicule = await storage.createVehicule(req.body);
        res.status(201).json(vehicule);
      }
    } catch (error) {
      console.error('Erreur POST vehicule:', error);
      res.status(500).json({ error: "Failed to create vehicule" });
    }
  });

  app.put("/api/vehicules/:id", async (req, res) => {
    try {
      const { vehicleData, machineData, customFields } = req.body;
      const vehicule = await storage.updateVehicule(parseInt(req.params.id), vehicleData, machineData, customFields);
      if (!vehicule) {
        return res.status(404).json({ error: "Vehicule not found or update failed" });
      }
      res.json(vehicule);
    } catch (error) {
      console.error('Erreur PUT vehicule:', error);
      res.status(500).json({ error: "Failed to update vehicule" });
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

  // Custom Fields API
  app.get("/api/custom-fields", async (req, res) => {
    try {
      const entityTypeId = req.query.entity_type_id ? parseInt(req.query.entity_type_id as string) : 1;
      const fields = await storage.getCustomFieldsByEntityType(entityTypeId);
      res.json(fields);
    } catch (error) {
      console.error('Erreur lors de la récupération des champs personnalisés:', error);
      res.status(500).json({ error: "Failed to fetch custom fields" });
    }
  });

  app.get("/api/custom-field-values/:entityId", async (req, res) => {
    try {
      const values = await storage.getCustomFieldValuesForEntity(parseInt(req.params.entityId));
      res.json(values);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch custom field values" });
    }
  });

  app.post("/api/custom-field-values", async (req, res) => {
    try {
      const { entityId, customFieldId, valeur } = req.body;
      const result = await storage.saveCustomFieldValue(entityId, customFieldId, valeur);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to save custom field value" });
    }
  });

  app.delete("/api/custom-field-values/:entityId/:customFieldId", async (req, res) => {
    try {
      const entityId = parseInt(req.params.entityId);
      const customFieldId = parseInt(req.params.customFieldId);
      const success = await storage.deleteCustomFieldValue(entityId, customFieldId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Custom field value not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete custom field value" });
    }
  });

  // Custom Fields Management
  app.post("/api/custom-fields", async (req, res) => {
    try {
      const field = await storage.createCustomField(req.body);
      res.json(field);
    } catch (error) {
      console.error('Erreur création champ personnalisé:', error);
      res.status(500).json({ error: "Failed to create custom field" });
    }
  });

  app.put("/api/custom-fields/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateCustomField(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur modification champ personnalisé:', error);
      res.status(500).json({ error: "Failed to update custom field" });
    }
  });

  app.delete("/api/custom-fields/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCustomField(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Custom field not found" });
      }
    } catch (error) {
      console.error('Erreur suppression champ personnalisé:', error);
      res.status(500).json({ error: "Failed to delete custom field" });
    }
  });

  app.patch("/api/custom-fields/:id/order", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { ordre } = req.body;
      await storage.updateCustomFieldOrder(id, ordre);
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur modification ordre champ personnalisé:', error);
      res.status(500).json({ error: "Failed to update custom field order" });
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

  // Authentication routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/current-user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Placeholder for forgot password route
  app.post("/api/forgot-password", async (req, res) => {
    // In a real application, you would handle password reset logic here:
    // 1. Validate email
    // 2. Generate a unique token
    // 3. Save the token with an expiry to the database associated with the user's email
    // 4. Send an email to the user with a link containing the token
    console.log("Forgot password request for:", req.body.email);
    res.json({ message: "If an account with that email exists, a password reset link has been sent." });
  });

  // Route de test pour bcrypt
  app.get("/api/test-bcrypt", async (req, res) => {
    try {
      console.log('=== DÉBUT TEST BCRYPT ===');
      
      // Test d'abord si bcrypt est disponible avec dynamic import
      let bcrypt;
      try {
        bcrypt = await import('bcrypt');
        console.log('✅ bcrypt module trouvé');
      } catch (importError) {
        console.log('❌ bcrypt module NOT FOUND:', (importError as Error).message);
        return res.json({
          success: false,
          error: 'bcrypt module non installé',
          message: 'bcrypt n\'est pas installé. Lancez: npm install bcrypt @types/bcrypt',
          importError: (importError as Error).message,
          bcryptInstalled: false
        });
      }
      
      const testPassword = "123456";
      const storedHash = "$2y$10$ZglZoahK99IfUXzzerUQfOQT4HwNw33a0MUwRiii7dT4.3xU8uhzS";
      
      console.log('Test bcrypt - Mot de passe:', testPassword);
      console.log('Test bcrypt - Hash stocké:', storedHash);
      
      const isValid = await bcrypt.compare(testPassword, storedHash);
      console.log('Test bcrypt - Résultat:', isValid);
      console.log('=== FIN TEST BCRYPT ===');
      
      res.json({
        success: true,
        testPassword: testPassword,
        storedHash: storedHash,
        isValid: isValid,
        message: isValid ? "✅ Le mot de passe '123456' correspond au hash" : "❌ Le mot de passe '123456' ne correspond PAS au hash",
        bcryptInstalled: true
      });
    } catch (error) {
      console.error('Erreur test bcrypt:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        errorStack: (error as Error).stack,
        message: "Erreur lors du test bcrypt: " + (error as Error).message,
        bcryptInstalled: false
      });
    }
  });

  // Route de test pour plusieurs mots de passe courants
  app.get("/api/test-common-passwords", async (req, res) => {
    try {
      console.log('=== TEST MOTS DE PASSE COURANTS ===');
      
      // Test d'abord si bcrypt est disponible
      let bcrypt;
      try {
        bcrypt = await import('bcrypt');
        console.log('✅ bcrypt module trouvé');
      } catch (importError) {
        return res.json({
          success: false,
          error: 'bcrypt module non installé',
          message: 'bcrypt n\'est pas installé. Lancez: npm install bcrypt @types/bcrypt'
        });
      }
      
      const storedHash = "$2y$10$ZglZoahK99IfUXzzerUQfOQT4HwNw33a0MUwRiii7dT4.3xU8uhzS";
      const commonPasswords = [
        "123456",
        "admin",
        "password",
        "admin123",
        "123456789",
        "gestinter",
        "test",
        "dev",
        "team",
        "",
        "123",
        "admin@123",
        "fleet",
        "wise"
      ];
      
      console.log('Test avec', commonPasswords.length, 'mots de passe courants...');
      
      const results = [];
      for (const password of commonPasswords) {
        try {
          const isValid = await bcrypt.compare(password, storedHash);
          results.push({
            password: password || '[VIDE]',
            isValid: isValid
          });
          
          if (isValid) {
            console.log('🎉 MOT DE PASSE TROUVÉ:', password || '[VIDE]');
          }
        } catch (error) {
          results.push({
            password: password || '[VIDE]',
            isValid: false,
            error: (error as Error).message
          });
        }
      }
      
      const validPassword = results.find(r => r.isValid);
      
      res.json({
        success: true,
        message: validPassword 
          ? `🎉 Mot de passe trouvé : "${validPassword.password}"` 
          : '❌ Aucun des mots de passe courants ne correspond',
        storedHash: storedHash,
        testedPasswords: results.length,
        validPassword: validPassword?.password || null,
        results: results
      });
    } catch (error) {
      console.error('Erreur test mots de passe courants:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        message: "Erreur lors du test: " + (error as Error).message
      });
    }
  });

  // Route de test pour la table users
  app.get("/api/test-users-table", async (req, res) => {
    try {
      console.log('=== TEST TABLE USERS ===');
      // Simulation du test car getAllFromUsersTable n'existe pas encore
      const testUser = await storage.getUserFromUsersTable(1);
      
      res.json({
        success: true,
        message: testUser ? "Table users accessible" : "Table users trouvée mais vide",
        data: testUser ? {
          id: testUser.id,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          CDUSER: testUser.CDUSER,
          active: testUser.active,
          password: testUser.password ? '[HASH PRÉSENT]' : '[PAS DE HASH]'
        } : null
      });
    } catch (error) {
      console.error('Erreur test table users:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        message: "Erreur lors du test de la table users: " + (error as Error).message
      });
    }
  });

  // Route de test pour la table USER
  app.get("/api/test-user-table", async (req, res) => {
    try {
      console.log('=== TEST TABLE USER ===');
      const users = await storage.getAllUsers();
      console.log('Nombre d\'utilisateurs USER trouvés:', users.length);
      
      res.json({
        success: true,
        message: `Table USER trouvée avec ${users.length} utilisateur(s)`,
        count: users.length,
        data: users.slice(0, 5) // Limiter à 5 premiers pour l'affichage
      });
    } catch (error) {
      console.error('Erreur test table USER:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        message: "Erreur lors du test de la table USER: " + (error as Error).message
      });
    }
  });

  // Route de test pour la jointure users + USER
  app.get("/api/test-jointure", async (req, res) => {
    try {
      console.log('=== TEST JOINTURE USERS + USER ===');
      
      // Tester avec l'utilisateur ID 1 de la table users
      const firstUser = await storage.getUserFromUsersTable(1);
      if (!firstUser) {
        return res.json({
          success: false,
          message: "Aucun utilisateur trouvé avec ID 1 dans la table users",
          data: null
        });
      }
      console.log('Test jointure avec utilisateur ID:', firstUser.id);
      
      const fullUserData = await storage.getUserWithJointure(firstUser.id);
      
      res.json({
        success: true,
        message: fullUserData ? "Jointure réussie" : "Jointure échouée",
        userFromUsersTable: {
          id: firstUser.id,
          email: firstUser.email,
          CDUSER: firstUser.CDUSER,
          active: firstUser.active
        },
        joinedData: fullUserData
      });
    } catch (error) {
      console.error('Erreur test jointure:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        message: "Erreur lors du test de jointure: " + (error as Error).message
      });
    }
  });

  // Route de test pour l'authentification avec table USER (mot de passe en clair)
  app.get("/api/test-user-auth", async (req, res) => {
    try {
      console.log('=== TEST AUTHENTIFICATION TABLE USER ===');
      
      // Tester avec les données que vous avez
      const testEmail = "dev@techni-park.com";
      const testPassword = "DEV";
      
      console.log('Test authentification pour:', testEmail);
      
      const user = await storage.getUserByEmail(testEmail);
      if (!user) {
        return res.json({
          success: false,
          message: `Utilisateur non trouvé pour l'email: ${testEmail}`,
          testEmail: testEmail,
          testPassword: testPassword
        });
      }
      
      console.log('Utilisateur trouvé:', { 
        IDUSER: user.IDUSER, 
        EMAILP: user.EMAILP, 
        NOMFAMILLE: user.NOMFAMILLE,
        PRENOM: user.PRENOM,
        CDUSER: user.CDUSER,
        IAUTORISE: user.IAUTORISE 
      });
      
      // Tester l'autorisation
      const isAuthorized = user.IAUTORISE === 1;
      console.log('Utilisateur autorisé (IAUTORISE = 1):', isAuthorized);
      
      // Tester le mot de passe
      const passwordMatch = user.PASSWORD === testPassword;
      console.log('Mot de passe stocké:', user.PASSWORD);
      console.log('Mot de passe testé:', testPassword);
      console.log('Mot de passe correspond:', passwordMatch);
      
      res.json({
        success: true,
        message: 'Test d\'authentification terminé',
        testEmail: testEmail,
        testPassword: testPassword,
        userFound: true,
        userEmail: user.EMAILP,
        userNom: user.NOMFAMILLE,
        userPrenom: user.PRENOM,
        userCDUSER: user.CDUSER,
        isAuthorized: isAuthorized,
        passwordInDB: user.PASSWORD,
        passwordMatch: passwordMatch,
        canLogin: isAuthorized && passwordMatch,
        finalResult: isAuthorized && passwordMatch ? 
          "✅ L'utilisateur peut se connecter" : 
          "❌ L'utilisateur ne peut PAS se connecter"
      });
    } catch (error) {
      console.error('Erreur test authentification USER:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        message: "Erreur lors du test: " + (error as Error).message
      });
    }
  });

  // Route pour lister tous les utilisateurs de la table USER
  app.get("/api/list-all-users", async (req, res) => {
    try {
      console.log('=== LISTE TOUS LES UTILISATEURS TABLE USER ===');
      
      const allUsers = await storage.getAllUsers();
      console.log('Nombre d\'utilisateurs trouvés dans USER:', allUsers.length);
      
      // Masquer les mots de passe et ne montrer que les infos importantes
      const safeUsers = allUsers.map(user => ({
        IDUSER: user.IDUSER,
        EMAILP: user.EMAILP,
        NOMFAMILLE: user.NOMFAMILLE,
        PRENOM: user.PRENOM,
        CDUSER: user.CDUSER,
        IADMIN: user.IADMIN,
        IAUTORISE: user.IAUTORISE,
        FONCTION_PRO: user.FONCTION_PRO,
        PASSWORD: user.PASSWORD ? '[PRÉSENT: ' + user.PASSWORD.substring(0, 3) + '...]' : '[VIDE]'
      }));
      
      res.json({
        success: true,
        message: `${allUsers.length} utilisateur(s) trouvé(s) dans la table USER`,
        count: allUsers.length,
        users: safeUsers,
        emailsList: allUsers.map(u => u.EMAILP).filter(email => email), // Liste des EMAILP uniquement
        searchEmail: "dev@techni-park.com",
        emailExists: allUsers.some(u => u.EMAILP === "dev@techni-park.com")
      });
    } catch (error) {
      console.error('Erreur liste utilisateurs USER:', error);
      res.json({
        success: false,
        error: (error as Error).message,
        message: "Erreur lors de la récupération: " + (error as Error).message
      });
    }
  });

  // Routes pour le planning
  app.get('/api/planning/interventions', async (req, res) => {
    try {
      console.log('Planning interventions called with params:', req.query);
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ error: 'Paramètres start et end requis' });
      }

      // Utilisation directe du storage pour récupérer les interventions
      const allInterventions = await storage.getAllInterventions(1, 1000);
      
      // Filtrer par date côté serveur
      const filteredInterventions = allInterventions.interventions.filter(intervention => {
        if (!intervention.DT_INTER_DBT) return false;
        const date = intervention.DT_INTER_DBT;
        return date >= start && date <= end;
      });
      
      console.log('Interventions found:', filteredInterventions.length);
      res.json(filteredInterventions.slice(0, 50)); // Limiter à 50 résultats
    } catch (error) {
      console.error('Erreur lors de la récupération des interventions pour le planning:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
    }
  });

  app.get('/api/planning/alerts', async (req, res) => {
    try {
      console.log('Planning alerts called with params:', req.query);
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ error: 'Paramètres start et end requis' });
      }
      
      // Pour l'instant, retournons un tableau vide car nous n'avons pas de méthode pour les actions
      console.log('Alerts found: 0 (pas encore implémenté)');
      res.json([]);
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes pour le planning:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
    }
  });

  app.get('/api/planning/resources', async (req, res) => {
    try {
      console.log('Planning resources called with params:', req.query);
      const { type } = req.query;
      
      if (type === 'technicien') {
        // Utiliser le storage pour récupérer les utilisateurs
        const users = await storage.getAllUsers();
        const techniciens = users
          .filter(user => user.CDUSER && user.CDUSER.trim() !== '')
          .map(user => ({
            id: user.CDUSER,
            name: `${user.NOMFAMILLE || ''} ${user.PRENOM || ''}`.trim() || user.CDUSER,
            type: 'technicien'
          }))
          .slice(0, 20);
        
        console.log('Techniciens found:', techniciens.length);
        res.json(techniciens);
      } else {
        // Pour l'instant, retournons des machines de test
        const machines = [
          { id: 'R001', name: 'Machine 001', type: 'machine' },
          { id: 'R002', name: 'Machine 002', type: 'machine' },
          { id: 'R003', name: 'Machine 003', type: 'machine' }
        ];
        
        console.log('Machines found:', machines.length);
        res.json(machines);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources pour le planning:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
    }
  });

  // Route de test pour vérifier les tables du planning
  app.get('/api/planning/test-tables', async (req, res) => {
    try {
      console.log('Testing planning tables...');
      
      // Test table INTERVENTION
      const testIntervention = await db.execute(`SELECT COUNT(*) as count FROM INTERVENTION LIMIT 1`);
      const interventionCount = (testIntervention[0] as any[])?.[0]?.count || 0;
      
      // Test table ACTION  
      const testAction = await db.execute(`SELECT COUNT(*) as count FROM ACTION LIMIT 1`);
      const actionCount = (testAction[0] as any[])?.[0]?.count || 0;
      
      // Test table USER
      const testUser = await db.execute(`SELECT COUNT(*) as count FROM USER LIMIT 1`);
      const userCount = (testUser[0] as any[])?.[0]?.count || 0;
      
      // Test table MACHINE_MNT
      const testMachine = await db.execute(`SELECT COUNT(*) as count FROM MACHINE_MNT LIMIT 1`);
      const machineCount = (testMachine[0] as any[])?.[0]?.count || 0;
      
      res.json({
        success: true,
        tables: {
          INTERVENTION: { exists: true, count: interventionCount },
          ACTION: { exists: true, count: actionCount },
          USER: { exists: true, count: userCount },
          MACHINE_MNT: { exists: true, count: machineCount }
        },
        message: 'Toutes les tables sont accessibles'
      });
    } catch (error) {
      console.error('Erreur test tables planning:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: 'Erreur lors du test des tables'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
