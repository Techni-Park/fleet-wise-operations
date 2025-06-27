import { eq, sql, desc } from "drizzle-orm";
import { db } from "./db";
import * as fs from "fs";
import * as path from "path";
import { 
  users, vehicles, interventions, alerts, documents, actions, anomalies, contacts, ingredients, machinesMnt, produits, societes, userSystem, vehicules, customFields, customFieldsValues, z83Interventions, forms, formsFields, formsFieldsValues,
  type User, type InsertUser, type Vehicle, type InsertVehicle, type Intervention, type InsertIntervention, 
  type Alert, type InsertAlert, type Document, type InsertDocument, type Action, type InsertAction,
  type Anomalie, type InsertAnomalie, type Contact, type InsertContact, type Ingredient, type InsertIngredient,
  type MachineMnt, type InsertMachineMnt, type Produit, type InsertProduit, type Societe, type InsertSociete,
  type UserSystem, type InsertUserSystem, type Vehicule, type InsertVehicule, type CustomField, type InsertCustomField,
  type CustomFieldValue, type InsertCustomFieldValue, type Z83Intervention, type InsertZ83Intervention,
  type Form, type InsertForm, type FormField, type InsertFormField, type FormFieldValue, type InsertFormFieldValue
} from "@shared/schema";

export interface IStorage {
  // Test de connexion
  testConnection(): Promise<any[]>;
  
  // Users (table users pour authentification)
  getUserFromUsersTable(id: number): Promise<User | undefined>;
  getUserByEmailFromUsersTable(email: string): Promise<User | undefined>;
  getUserWithJointure(usersId: number): Promise<any | undefined>;
  
  // UserSystem (table USER pour données complètes)
  getUser(id: number): Promise<UserSystem | undefined>;
  getUserByCDUSER(cduser: string): Promise<UserSystem | undefined>;
  getUserByEmail(email: string): Promise<UserSystem | undefined>;
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
  getAllInterventions(page: number, limit: number): Promise<{ interventions: Intervention[], total: number }>;
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
  getAllContacts(page: number, limit: number): Promise<{ contacts: Contact[], total: number }>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  getCollaborators(companyName: string, currentContactId: number): Promise<Contact[]>;

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
  createVehiculeWithMachine(vehicleData: Partial<InsertVehicule>, machineData: Partial<InsertMachineMnt>, customFields?: { [key: number]: string }): Promise<Vehicule>;
  updateVehicule(id: number, vehicleData: Partial<InsertVehicule>, machineData?: Partial<InsertMachineMnt>, customFields?: { [key: number]: string }): Promise<Vehicule | undefined>;

  // Anomalies
  getAnomalie(id: number): Promise<Anomalie | undefined>;
  getAllAnomalies(): Promise<Anomalie[]>;
  createAnomalie(anomalie: InsertAnomalie): Promise<Anomalie>;

  // Ingredients
  getIngredient(id: number): Promise<Ingredient | undefined>;
  getAllIngredients(): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;

  // Custom Fields
  getCustomFieldsByEntityType(entityTypeId: number): Promise<CustomField[]>;
  getCustomFieldValuesForEntity(entityId: number): Promise<CustomFieldValue[]>;
  saveCustomFieldValue(entityId: number, customFieldId: number, valeur: string): Promise<CustomFieldValue>;
  deleteCustomFieldValue(entityId: number, customFieldId: number): Promise<boolean>;
  createCustomField(field: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>): Promise<CustomField>;
  updateCustomField(id: number, field: Partial<CustomField>): Promise<void>;
  deleteCustomField(id: number): Promise<boolean>;
  updateCustomFieldOrder(id: number, ordre: number): Promise<void>;

  // Documents pour interventions
  getDocumentsByIntervention(interventionId: number): Promise<Document[]>;
  createInterventionDocument(interventionId: number, documentData: any): Promise<Document>;

  // Commentaires d'intervention (utilisation de la table ACTION pour les rapports)
  getInterventionComments(interventionId: number): Promise<Action[]>;
  createInterventionComment(interventionId: number, commentData: any): Promise<Action>;

  // Chat d'intervention (utilisation de la table ACTION avec TRGCIBLE = INTxxx)
  getChatMessages(interventionId: number): Promise<Action[]>;
  createChatMessage(interventionId: number, messageData: any): Promise<Action>;

  // Gestion des fichiers physiques
  saveFileToIntervention(interventionId: number, file: Express.Multer.File, cduser: string): Promise<Document>;
  savePhotoToInterventionReport(interventionId: number, file: Express.Multer.File, cduser: string, comment?: string): Promise<Document>;

  // Z83_INTERVENTION - Instructions avancées
  getZ83Intervention(interventionId: number): Promise<Z83Intervention | undefined>;
  createOrUpdateZ83Intervention(interventionId: number, instructions: string, userId: string): Promise<Z83Intervention>;

  // Custom Forms
  getFormsByEntityType(entityTypeId: number): Promise<Form[]>;
  getFormWithFields(formId: number): Promise<Form & { fields: FormField[] } | undefined>;
  createForm(formData: Omit<Form, 'id' | 'created_at' | 'updated_at'>): Promise<Form>;
  updateForm(formId: number, formData: Partial<Form>): Promise<Form | undefined>;
  deleteForm(formId: number): Promise<boolean>;
  
  // Form Fields
  getFormFields(formId: number): Promise<FormField[]>;
  createFormField(fieldData: Omit<FormField, 'id' | 'created_at' | 'updated_at'>): Promise<FormField>;
  updateFormField(fieldId: number, fieldData: Partial<FormField>): Promise<FormField | undefined>;
  deleteFormField(fieldId: number): Promise<boolean>;
  reorderFormFields(formId: number, fieldOrders: { id: number; ordre: number; groupe?: string; ordre_groupe?: number }[]): Promise<boolean>;
  
  // Form Values
  getFormValues(formId: number, entityId: number): Promise<{ [fieldId: number]: string }>;
  saveFormValues(formId: number, entityId: number, values: { [fieldId: number]: string }, createdBy: string): Promise<boolean>;
  getFilledFormsForEntity(entityTypeId: number, entityId: number): Promise<Array<Form & { values: { [fieldId: number]: string } }>>;

  // Intervention enrichment
  getMachineByCleMachine(cleMachine: string): Promise<MachineMnt | undefined>;
  getContactById(contactId: number): Promise<Contact | undefined>;
}

export class MySQLStorage implements IStorage {
  async testConnection(): Promise<any[]> {
    const result = await db.execute(sql`SHOW TABLES`);
    return result;
  }

  // Users (table users pour authentification)
  async getUserFromUsersTable(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmailFromUsersTable(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserWithJointure(usersId: number): Promise<any | undefined> {
    try {
      // Jointure entre users et USER via CDUSER
      const result = await db.execute(sql`
        SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.CDUSER,
          u.active,
          us.IDUSER,
          us.NOMFAMILLE,
          us.PRENOM,
          us.EMAIL as USER_EMAIL,
          us.IADMIN,
          us.IAUTORISE,
          us.FONCTION_PRO,
          us.TELBUR
        FROM users u
        LEFT JOIN USER us ON u.CDUSER = us.CDUSER
        WHERE u.id = ${usersId}
        LIMIT 1
      `);
      return result[0]?.[0];
    } catch (error) {
      console.error('Erreur getUserWithJointure:', error);
      return undefined;
    }
  }

  // UserSystem (table USER pour données complètes)
  async getUser(id: number): Promise<UserSystem | undefined> {
    const result = await db.select().from(userSystem).where(eq(userSystem.IDUSER, id)).limit(1);
    return result[0];
  }

  async getUserByCDUSER(cduser: string): Promise<UserSystem | undefined> {
    const result = await db.select().from(userSystem).where(eq(userSystem.CDUSER, cduser)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<UserSystem | undefined> {
    const result = await db.select().from(userSystem).where(eq(userSystem.EMAILP, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user);
    const insertId = result[0].insertId as number;
    const newUser = await this.getUserFromUsersTable(insertId);
    return newUser!;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    await db.update(users).set(user).where(eq(users.id, id));
    return this.getUserFromUsersTable(id);
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
    try {
      console.log(`🔍 getIntervention - Recherche intervention ID: ${id}`);
      
      // Requête avec toutes les jointures pour un seul enregistrement
      const query = sql`
        SELECT 
          i.*,
          c.NOMFAMILLE as CONTACT_NOM,
          c.PRENOM as CONTACT_PRENOM,
          c.RAISON_SOCIALE as CONTACT_RAISON_SOCIALE,
          c.EMAIL as CONTACT_EMAIL,
          c.TEL1 as CONTACT_TEL,
          c.EMAILP as CONTACT_EMAILP,
          c.TELP1 as CONTACT_TELP1,
          c.ADRESSE1 as CONTACT_ADRESSE1,
          c.VILLE as CONTACT_VILLE,
          v.IMMAT as VEHICULE_IMMAT,
          m.MARQUE as VEHICULE_MARQUE,
          m.MODELE as VEHICULE_MODELE,
          m.CD_MACHINE as VEHICULE_CODE,
          m.LIB_MACHINE as VEHICULE_LIB_MACHINE,
          m.IDMACHINE as VEHICULE_IDMACHINE,
          u.NOMFAMILLE as TECHNICIEN_NOM,
          u.PRENOM as TECHNICIEN_PRENOM,
          u.EMAIL as TECHNICIEN_EMAIL,
          u.TELBUR as TECHNICIEN_TEL
        FROM INTERVENTION i
        LEFT JOIN CONTACT c ON i.IDCONTACT = c.IDCONTACT AND c.IDCONTACT > 0
        LEFT JOIN MACHINE_MNT m ON (
          CASE 
            WHEN i.CLE_MACHINE_CIBLE LIKE 'R%' 
            THEN SUBSTRING(i.CLE_MACHINE_CIBLE, 2) = CAST(m.IDMACHINE AS CHAR)
            ELSE i.CLE_MACHINE_CIBLE = CAST(m.IDMACHINE AS CHAR)
          END
        )
        LEFT JOIN VEHICULE v ON m.IDMACHINE = v.IDMACHINE
        LEFT JOIN USER u ON i.CDUSER = u.CDUSER AND i.CDUSER IS NOT NULL AND i.CDUSER != ''
        WHERE i.IDINTERVENTION = ${id}
        LIMIT 1
      `;
      
      const result = await db.execute(query);
      const intervention = (result as any[])[0];
      
      if (intervention) {
        console.log(`✅ getIntervention - Intervention trouvée:`, {
          id: intervention.IDINTERVENTION,
          client: intervention.CONTACT_RAISON_SOCIALE || `${intervention.CONTACT_PRENOM} ${intervention.CONTACT_NOM}`,
          vehicule: intervention.VEHICULE_LIB_MACHINE || `${intervention.VEHICULE_MARQUE} ${intervention.VEHICULE_MODELE}`,
          technicien: `${intervention.TECHNICIEN_PRENOM} ${intervention.TECHNICIEN_NOM}`,
          cle_machine_cible: intervention.CLE_MACHINE_CIBLE,
          idcontact: intervention.IDCONTACT,
          cduser: intervention.CDUSER
        });
      } else {
        console.log(`❌ getIntervention - Aucune intervention trouvée pour ID: ${id}`);
      }
      
      return intervention;
    } catch (error) {
      console.error('Erreur getIntervention avec jointures:', error);
      // Fallback sans jointures
      const result = await db.select().from(interventions).where(eq(interventions.IDINTERVENTION, id)).limit(1);
      return result[0];
    }
  }

  async getAllInterventions(page: number = 1, limit: number = 12): Promise<{ interventions: Intervention[], total: number }> {
    try {
      // Calcul de l'offset
      const offset = (page - 1) * limit;
      
      // Compter le total d'abord
      const simpleCountQuery = sql`SELECT COUNT(*) as total FROM INTERVENTION`;
      const simpleCountResult = await db.execute(simpleCountQuery);
      const totalInterventions = (simpleCountResult[0] as any[])[0]?.total || 0;
      
      if (totalInterventions === 0) {
        return { interventions: [], total: 0 };
      }
      
      // Requête principale avec toutes les jointures nécessaires
      const query = sql`
        SELECT 
          i.*,
          c.NOMFAMILLE as CONTACT_NOM,
          c.PRENOM as CONTACT_PRENOM,
          c.RAISON_SOCIALE as CONTACT_RAISON_SOCIALE,
          c.EMAIL as CONTACT_EMAIL,
          c.TEL1 as CONTACT_TEL,
          c.EMAILP as CONTACT_EMAILP,
          c.TELP1 as CONTACT_TELP1,
          v.IMMAT as VEHICULE_IMMAT,
          m.MARQUE as VEHICULE_MARQUE,
          m.MODELE as VEHICULE_MODELE,
          m.CD_MACHINE as VEHICULE_CODE,
          m.LIB_MACHINE as VEHICULE_LIB_MACHINE,
          m.IDMACHINE as VEHICULE_IDMACHINE,
          u.NOMFAMILLE as TECHNICIEN_NOM,
          u.PRENOM as TECHNICIEN_PRENOM,
          u.EMAIL as TECHNICIEN_EMAIL
        FROM INTERVENTION i
        LEFT JOIN CONTACT c ON i.IDCONTACT = c.IDCONTACT AND c.IDCONTACT > 0
        LEFT JOIN MACHINE_MNT m ON (
          CASE 
            WHEN i.CLE_MACHINE_CIBLE LIKE 'R%' 
            THEN SUBSTRING(i.CLE_MACHINE_CIBLE, 2) = CAST(m.IDMACHINE AS CHAR)
            ELSE i.CLE_MACHINE_CIBLE = CAST(m.IDMACHINE AS CHAR)
          END
        )
        LEFT JOIN VEHICULE v ON m.IDMACHINE = v.IDMACHINE
        LEFT JOIN USER u ON i.CDUSER = u.CDUSER AND i.CDUSER IS NOT NULL AND i.CDUSER != ''
        ORDER BY i.IDINTERVENTION DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const interventionsResult = await db.execute(query);
      const interventions = (interventionsResult[0] as any[]) || [];
      
      return {
        interventions: interventions,
        total: totalInterventions
      };
    } catch (error) {
      console.error('Erreur getAllInterventions avec pagination:', error);
      
      // Fallback: essayer une requête simple sans jointures
      try {
        const fallbackQuery = sql`SELECT * FROM INTERVENTION ORDER BY IDINTERVENTION DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        const fallbackResult = await db.execute(fallbackQuery);
        const fallbackInterventions = (fallbackResult[0] as any[]) || [];
        
        const countQuery = sql`SELECT COUNT(*) as total FROM INTERVENTION`;
        const countResult = await db.execute(countQuery);
        const total = (countResult[0] as any[])[0]?.total || 0;
        
        return {
          interventions: fallbackInterventions,
          total: total
        };
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError);
        return { interventions: [], total: 0 };
      }
    }
  }

  async getInterventionsByVehicle(vehicleId: number): Promise<Intervention[]> {
    try {
      // Récupérer les interventions pour un véhicule spécifique via CLE_MACHINE_CIBLE
      const query = sql`
        SELECT 
          i.*,
          c.NOMFAMILLE as CONTACT_NOM,
          c.PRENOM as CONTACT_PRENOM,
          c.RAISON_SOCIALE as CONTACT_RAISON_SOCIALE,
          c.EMAIL as CONTACT_EMAIL,
          c.TEL1 as CONTACT_TEL,
          v.IMMAT as VEHICULE_IMMAT,
          m.MARQUE as VEHICULE_MARQUE,
          m.MODELE as VEHICULE_MODELE,
          m.CD_MACHINE as VEHICULE_CODE,
          m.LIB_MACHINE as VEHICULE_LIB_MACHINE,
          u.NOMFAMILLE as TECHNICIEN_NOM,
          u.PRENOM as TECHNICIEN_PRENOM
        FROM INTERVENTION i
        LEFT JOIN CONTACT c ON i.IDCONTACT = c.IDCONTACT AND c.IDCONTACT > 0
        LEFT JOIN MACHINE_MNT m ON (
          CASE 
            WHEN i.CLE_MACHINE_CIBLE LIKE 'R%' 
            THEN SUBSTRING(i.CLE_MACHINE_CIBLE, 2) = CAST(m.IDMACHINE AS CHAR)
            ELSE i.CLE_MACHINE_CIBLE = CAST(m.IDMACHINE AS CHAR)
          END
        )
        LEFT JOIN VEHICULE v ON m.IDMACHINE = v.IDMACHINE
        LEFT JOIN USER u ON i.CDUSER = u.CDUSER AND i.CDUSER IS NOT NULL AND i.CDUSER != ''
        WHERE m.IDMACHINE = ${vehicleId}
        ORDER BY i.DT_INTER_DBT DESC, i.IDINTERVENTION DESC
      `;
      
      const result = await db.execute(query);
      return (result[0] as any[]) || [];
    } catch (error) {
      console.error('Erreur getInterventionsByVehicle:', error);
      return [];
    }
  }

  async createIntervention(interventionData: InsertIntervention): Promise<Intervention> {
    try {
      // Si on a un IDMACHINE dans les données, créer le CLE_MACHINE_CIBLE
      if (interventionData.CLE_MACHINE_CIBLE && !interventionData.CLE_MACHINE_CIBLE.startsWith('R')) {
        interventionData.CLE_MACHINE_CIBLE = `R${interventionData.CLE_MACHINE_CIBLE}`;
      }
      
      // Ajouter les informations de création
      const now = new Date();
      const interventionWithMeta = {
        ...interventionData,
        DHCRE: now.toISOString(),
        DHMOD: now.toISOString(),
        created_at: now,
        updated_at: now
      };

      const result = await db.insert(interventions).values(interventionWithMeta);
      const insertId = result[0].insertId as number;
      const newIntervention = await this.getIntervention(insertId);
      return newIntervention!;
    } catch (error) {
      console.error('Erreur createIntervention:', error);
      throw error;
    }
  }

  async updateIntervention(id: number, interventionData: Partial<InsertIntervention>): Promise<Intervention | undefined> {
    try {
      // Si on modifie CLE_MACHINE_CIBLE, s'assurer du format "R{IDMACHINE}"
      if (interventionData.CLE_MACHINE_CIBLE && !interventionData.CLE_MACHINE_CIBLE.startsWith('R')) {
        interventionData.CLE_MACHINE_CIBLE = `R${interventionData.CLE_MACHINE_CIBLE}`;
      }

      // Ajouter les informations de modification
      const interventionWithMeta = {
        ...interventionData,
        DHMOD: new Date().toISOString(),
        updated_at: new Date()
      };

      await db.update(interventions).set(interventionWithMeta).where(eq(interventions.IDINTERVENTION, id));
      return this.getIntervention(id);
    } catch (error) {
      console.error('Erreur updateIntervention:', error);
      return undefined;
    }
  }

  async deleteIntervention(id: number): Promise<boolean> {
    try {
      const result = await db.delete(interventions).where(eq(interventions.IDINTERVENTION, id));
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteIntervention:', error);
      return false;
    }
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
    const result = await db.select().from(documents).where(eq(documents.IDDOCUMENT, id)).limit(1);
    return result[0];
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    // S'assurer qu'il y a un IDDOCUMENT
    if (!document.IDDOCUMENT) {
      document.IDDOCUMENT = Date.now() + Math.floor(Math.random() * 1000);
    }
    
    const result = await db.insert(documents).values(document);
    // Récupérer le document créé par IDDOCUMENT (pas par l'ID auto-increment)
    const newDocument = await this.getDocument(document.IDDOCUMENT);
    return newDocument!;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    console.log('🔄 updateDocument appelé avec:', { id, document });
    const result = await db.update(documents).set(document).where(eq(documents.IDDOCUMENT, id));
    console.log('🔄 updateDocument résultat:', result);
    // Récupérer le document mis à jour par IDDOCUMENT
    return this.getDocument(id);
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.IDDOCUMENT, id));
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

  async getAllContacts(page: number = 1, limit: number = 50): Promise<{ contacts: any[], total: number }> {
    const offset = (page - 1) * limit;
    
    const query = sql`
      SELECT c.*, (SELECT COUNT(*) FROM INTERVENTION i WHERE i.IDCONTACT = c.IDCONTACT) as interventionCount
      FROM CONTACT c
      ORDER BY c.IDCONTACT DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const contactList = await db.execute(query);
    
    const totalRecordsQuery = sql`SELECT count(*) as count FROM CONTACT`;
    const totalRecordsResult = await db.execute(totalRecordsQuery);
    const total = (totalRecordsResult[0] as any[])[0].count;

    return { contacts: contactList[0] as any[], total };
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact);
    const insertId = result[0].insertId as number;
    const newContact = await this.getContact(insertId);
    return newContact!;
  }

  async updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined> {
    try {
      await db.update(contacts).set(contact).where(eq(contacts.IDCONTACT, id));
      return await this.getContact(id);
    } catch (error) {
      console.error('Erreur updateContact:', error);
      return undefined;
    }
  }

  async deleteContact(id: number): Promise<boolean> {
    try {
      const result = await db.delete(contacts).where(eq(contacts.IDCONTACT, id));
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteContact:', error);
      return false;
    }
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
    try {
      // Jointure entre VEHICULE et MACHINE_MNT via IDMACHINE
      const query = sql`
        SELECT 
          v.*,
          m.CD_MACHINE,
          m.LIB_MACHINE,
          m.ID2_ETATMACHINE,
          m.MARQUE,
          m.MODELE,
          m.TYPE_MACHINE,
          m.NUM_SERIE,
          m.PUISSANCEW,
          m.KILOMETRAGE,
          m.DT_MISEENFONCTION,
          m.DT_PROCH_MNT,
          m.DT_EXP_GARANTIE,
          m.DT_DBT_GARANTIE,
          m.ADRESSE1,
          m.ADRESSE2,
          m.CPOSTAL,
          m.VILLE,
          m.OBSERVATIONS
        FROM VEHICULE v
        LEFT JOIN MACHINE_MNT m ON v.IDMACHINE = m.IDMACHINE
        WHERE v.IDVEHICULE = ${id}
      `;
      const result = await db.execute(query);
      return (result[0] as any[])[0];
    } catch (error) {
      console.error('Erreur getVehicule avec jointure:', error);
      // Fallback sans jointure
      const result = await db.select().from(vehicules).where(eq(vehicules.IDVEHICULE, id)).limit(1);
      return result[0];
    }
  }

  async getAllVehicules(): Promise<Vehicule[]> {
    try {
      // Jointure entre VEHICULE et MACHINE_MNT via IDMACHINE
      const query = sql`
        SELECT 
          v.*,
          m.CD_MACHINE,
          m.LIB_MACHINE,
          m.ID2_ETATMACHINE,
          m.MARQUE,
          m.MODELE,
          m.TYPE_MACHINE,
          m.NUM_SERIE,
          m.PUISSANCEW,
          m.KILOMETRAGE,
          m.DT_MISEENFONCTION,
          m.DT_PROCH_MNT,
          m.DT_EXP_GARANTIE,
          m.DT_DBT_GARANTIE,
          m.ADRESSE1,
          m.ADRESSE2,
          m.CPOSTAL,
          m.VILLE,
          m.OBSERVATIONS
        FROM VEHICULE v
        LEFT JOIN MACHINE_MNT m ON v.IDMACHINE = m.IDMACHINE
        ORDER BY v.IDVEHICULE
      `;
      const result = await db.execute(query);
      return result[0] as Vehicule[];
    } catch (error) {
      console.error('Erreur getAllVehicules avec jointure:', error);
      // Fallback sans jointure
      return db.select().from(vehicules);
    }
  }

  async createVehicule(vehicule: InsertVehicule): Promise<Vehicule> {
    const result = await db.insert(vehicules).values(vehicule).returning();
    return result[0];
  }

  async createVehiculeWithMachine(vehicleData: Partial<InsertVehicule>, machineData: Partial<InsertMachineMnt>, customFields?: { [key: number]: string }): Promise<Vehicule> {
    try {
      // D'abord créer la machine
      const machineResult = await db.insert(machinesMnt).values(machineData as InsertMachineMnt);
      const machineId = machineResult[0].insertId as number;

      // Ensuite créer le véhicule avec l'ID de la machine
      const vehicleWithMachine = {
        ...vehicleData,
        IDMACHINE: machineId
      };
      
      const vehicleResult = await db.insert(vehicules).values(vehicleWithMachine as InsertVehicule);
      const vehicleId = vehicleResult[0].insertId as number;

      // Sauvegarder les champs personnalisés si fournis
      if (customFields) {
        for (const [fieldId, value] of Object.entries(customFields)) {
          if (value.trim() !== '') {
            await this.saveCustomFieldValue(machineId, parseInt(fieldId), value);
          }
        }
      }

      // Retourner le véhicule avec la jointure
      const newVehicle = await this.getVehicule(vehicleId);
      return newVehicle!;
    } catch (error) {
      console.error('Erreur createVehiculeWithMachine:', error);
      throw error;
    }
  }

  async updateVehicule(id: number, vehicleData: Partial<InsertVehicule>, machineData?: Partial<InsertMachineMnt>, customFields?: { [key: number]: string }): Promise<Vehicule | undefined> {
    try {
      // Mettre à jour la table VEHICULE
      if (Object.keys(vehicleData).length > 0) {
        await db.update(vehicules).set(vehicleData).where(eq(vehicules.IDVEHICULE, id));
      }

      // Si on a des données de machine et qu'on a l'IDMACHINE du véhicule
      let machineId: number | undefined;
      if (machineData && Object.keys(machineData).length > 0) {
        // D'abord récupérer l'IDMACHINE du véhicule
        const vehicleResult = await db.select({ IDMACHINE: vehicules.IDMACHINE }).from(vehicules).where(eq(vehicules.IDVEHICULE, id)).limit(1);
        if (vehicleResult[0]?.IDMACHINE) {
          machineId = vehicleResult[0].IDMACHINE;
          await db.update(machinesMnt).set(machineData).where(eq(machinesMnt.IDMACHINE, machineId));
        }
      }

      // Mettre à jour les champs personnalisés si fournis
      if (customFields && machineId) {
        for (const [fieldId, value] of Object.entries(customFields)) {
          if (value.trim() !== '') {
            await this.saveCustomFieldValue(machineId, parseInt(fieldId), value);
          } else {
            await this.deleteCustomFieldValue(machineId, parseInt(fieldId));
          }
        }
      }

      // Retourner le véhicule mis à jour avec la jointure
      return this.getVehicule(id);
    } catch (error) {
      console.error('Erreur updateVehicule:', error);
      return undefined;
    }
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

  async getCollaborators(companyName: string, currentContactId: number): Promise<Contact[]> {
    const result = await db.select().from(contacts)
      .where(sql`RAISON_SOCIALE = ${companyName} AND IDCONTACT != ${currentContactId}`);
    return result[0] as Contact[];
  }

  // Custom Fields
  async getCustomFieldsByEntityType(entityTypeId: number): Promise<CustomField[]> {
    try {
      const result = await db.select().from(customFields)
        .where(eq(customFields.entity_type_id, entityTypeId))
        .orderBy(customFields.ordre, customFields.id);
      return result;
    } catch (error) {
      console.error('Erreur getCustomFieldsByEntityType:', error);
      return [];
    }
  }

  async getCustomFieldValuesForEntity(entityId: number): Promise<CustomFieldValue[]> {
    try {
      const result = await db.select().from(customFieldsValues)
        .where(eq(customFieldsValues.entity_id, entityId));
      return result;
    } catch (error) {
      console.error('Erreur getCustomFieldValuesForEntity:', error);
      return [];
    }
  }

  async saveCustomFieldValue(entityId: number, customFieldId: number, valeur: string): Promise<CustomFieldValue> {
    try {
      // Vérifier si la valeur existe déjà
      const existing = await db.select().from(customFieldsValues)
        .where(sql`entity_id = ${entityId} AND custom_field_id = ${customFieldId}`)
        .limit(1);

      if (existing.length > 0) {
        // Mettre à jour
        await db.update(customFieldsValues)
          .set({ valeur, updated_at: new Date() })
          .where(sql`entity_id = ${entityId} AND custom_field_id = ${customFieldId}`);
        
        const updated = await db.select().from(customFieldsValues)
          .where(sql`entity_id = ${entityId} AND custom_field_id = ${customFieldId}`)
          .limit(1);
        return updated[0];
      } else {
        // Créer
        const result = await db.insert(customFieldsValues).values({
          entity_id: entityId,
          custom_field_id: customFieldId,
          valeur
        });
        const insertId = result[0].insertId as number;
        const newValue = await db.select().from(customFieldsValues)
          .where(eq(customFieldsValues.id, insertId))
          .limit(1);
        return newValue[0];
      }
    } catch (error) {
      console.error('Erreur saveCustomFieldValue:', error);
      throw error;
    }
  }

  async deleteCustomFieldValue(entityId: number, customFieldId: number): Promise<boolean> {
    try {
      const result = await db.delete(customFieldsValues)
        .where(sql`entity_id = ${entityId} AND custom_field_id = ${customFieldId}`);
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteCustomFieldValue:', error);
      return false;
    }
  }

  async createCustomField(field: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>): Promise<CustomField> {
    try {
      const result = await db.insert(customFields).values(field);
      const insertId = result[0].insertId as number;
      const newField = await db.select().from(customFields)
        .where(eq(customFields.id, insertId))
        .limit(1);
      return newField[0];
    } catch (error) {
      console.error('Erreur createCustomField:', error);
      throw error;
    }
  }

  async updateCustomField(id: number, field: Partial<CustomField>): Promise<void> {
    try {
      await db.update(customFields)
        .set({ ...field, updated_at: new Date() })
        .where(eq(customFields.id, id));
    } catch (error) {
      console.error('Erreur updateCustomField:', error);
      throw error;
    }
  }

  async deleteCustomField(id: number): Promise<boolean> {
    try {
      // Supprimer d'abord toutes les valeurs associées
      await db.delete(customFieldsValues)
        .where(eq(customFieldsValues.custom_field_id, id));
      
      // Puis supprimer le champ
      const result = await db.delete(customFields)
        .where(eq(customFields.id, id));
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteCustomField:', error);
      return false;
    }
  }

  async updateCustomFieldOrder(id: number, ordre: number): Promise<void> {
    try {
      await db.update(customFields)
        .set({ ordre, updated_at: new Date() })
        .where(eq(customFields.id, id));
    } catch (error) {
      console.error('Erreur updateCustomFieldOrder:', error);
      throw error;
    }
  }

  // Documents pour interventions
  async getDocumentsByIntervention(interventionId: number): Promise<Document[]> {
    try {
      const result = await db.execute(sql`
        SELECT d.*, u.NOMFAMILLE, u.PRENOM
        FROM DOCUMENT d
        LEFT JOIN USER u ON d.CDUSER = u.CDUSER
        WHERE d.TRGCIBLE = ${`INT${interventionId}`} OR d.TRGCIBLE LIKE ${`ACT%`}
        ORDER BY d.DHCRE DESC
      `);
             return (result[0] as any[]) || [];
    } catch (error) {
      console.error('Erreur getDocumentsByIntervention:', error);
      return [];
    }
  }

  async createInterventionDocument(interventionId: number, documentData: any): Promise<Document> {
    try {
      // Récupérer les informations IDPROJET et IDTACHE depuis l'intervention
      const intervention = await this.getIntervention(interventionId);
      let idprojet = 0;
      let idtache = 0;
      
      if (intervention) {
        idprojet = intervention.IDPROJET || 0;
        idtache = intervention.IDTACHE || 0;
        console.log(`📋 Récupération projet/tâche pour document intervention depuis intervention ${interventionId}:`, { idprojet, idtache });
      }

      // Générer un IDDOCUMENT unique basé sur timestamp + random
      const iddocument = Date.now() + Math.floor(Math.random() * 1000);

      const insertData = {
        IDDOCUMENT: iddocument,
        LIB100: documentData.LIB100 || 'Document',
        FILEREF: documentData.FILEREF || '',
        COMMENTAIRE: documentData.COMMENTAIRE || '',
        CDUSER: documentData.CDUSER || 'WEB',
        ID2GENRE_DOCUMENT: documentData.ID2GENRE_DOCUMENT || 2,
        TRGCIBLE: documentData.TRGCIBLE || `INT${interventionId}`,
        IDPROJET: idprojet, // Récupéré depuis INTERVENTION
        IDTACHE: idtache, // Récupéré depuis INTERVENTION
        DHCRE: new Date(),
        DHMOD: new Date(),
        USCRE: documentData.CDUSER || 'WEB',
        USMOD: documentData.CDUSER || 'WEB'
      };

      const result = await db.insert(documents).values(insertData);
      const newDocument = await this.getDocument(iddocument);
      return newDocument!;
    } catch (error) {
      console.error('Erreur createInterventionDocument:', error);
      throw error;
    }
  }

  // Commentaires d'intervention (utilisation de la table ACTION pour les rapports)
  async getInterventionComments(interventionId: number): Promise<Action[]> {
    try {
      const result = await db.execute(sql`
        SELECT a.*, u.NOMFAMILLE, u.PRENOM
        FROM ACTION a
        LEFT JOIN USER u ON a.CDUSER = u.CDUSER
        WHERE a.CLE_MACHINE_CIBLE = ${`INT${interventionId}`} 
        AND a.LIB100 = 'Commentaire intervention'
        ORDER BY a.DHCRE DESC
      `);
             return (result[0] as any[]) || [];
    } catch (error) {
      console.error('Erreur getInterventionComments:', error);
      return [];
    }
  }

  async createInterventionComment(interventionId: number, commentData: any): Promise<Action> {
    try {
      // Récupérer les informations IDPROJET et IDTACHE depuis l'intervention
      const intervention = await this.getIntervention(interventionId);
      let idprojet = 0;
      let idtache = 0;
      
      if (intervention) {
        idprojet = intervention.IDPROJET || 0;
        idtache = intervention.IDTACHE || 0;
        console.log(`📋 Récupération projet/tâche pour commentaire depuis intervention ${interventionId}:`, { idprojet, idtache });
      }

      const insertData = {
        LIB100: commentData.LIB100 || 'Commentaire intervention',
        COMMENTAIRE: commentData.COMMENTAIRE || '',
        CDUSER: commentData.CDUSER || 'WEB',
        CLE_MACHINE_CIBLE: `INT${interventionId}`,
        IDPROJET: idprojet, // Récupéré depuis INTERVENTION
        IDTACHE: idtache, // Récupéré depuis INTERVENTION
        DHCRE: new Date(),
        DHMOD: new Date(),
        USCRE: commentData.CDUSER || 'WEB',
        USMOD: commentData.CDUSER || 'WEB'
      };

      const result = await db.insert(actions).values(insertData);
      const insertId = result[0].insertId as number;
      const newAction = await this.getAction(insertId);
      return newAction!;
    } catch (error) {
      console.error('Erreur createInterventionComment:', error);
      throw error;
    }
  }

  // Chat d'intervention (utilisation de la table ACTION avec TRGCIBLE = INTxxx)
  async getChatMessages(interventionId: number): Promise<Action[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          a.*,
          u.NOMFAMILLE,
          u.PRENOM,
          pa.COMMENTAIRE as PARENT_COMMENTAIRE,
          pu.NOMFAMILLE as PARENT_USER_NOM,
          pu.PRENOM as PARENT_USER_PRENOM,
          GROUP_CONCAT(
            CASE WHEN d.IDDOCUMENT IS NOT NULL THEN
              CONCAT(d.IDDOCUMENT, '|', d.LIB100, '|', d.FILEREF, '|', d.ID2GENRE_DOCUMENT, '|', d.DHCRE)
            END
            SEPARATOR '###'
          ) as DOCUMENTS_STR
        FROM ACTION a
        LEFT JOIN USER u ON a.CDUSER = u.CDUSER
        LEFT JOIN ACTION pa ON a.IDACTION_PREC = pa.IDACTION
        LEFT JOIN USER pu ON pa.CDUSER = pu.CDUSER
        LEFT JOIN DOCUMENT d ON d.TRGCIBLE = CONCAT('ACT', a.IDACTION)
        WHERE a.CLE_PIECE_CIBLE = ${`INT${interventionId}`}
        AND a.TYPACT = 10
        GROUP BY a.IDACTION
        ORDER BY a.DHCRE ASC
      `);
      
      // Traiter les documents de façon plus sûre
      const messages = (result[0] as any[]) || [];
      return messages.map(message => ({
        ...message,
        DOCUMENTS: message.DOCUMENTS_STR ? 
          message.DOCUMENTS_STR.split('###').map((docStr: string) => {
            const [IDDOCUMENT, LIB100, FILEREF, ID2GENRE_DOCUMENT, DHCRE] = docStr.split('|');
            return { IDDOCUMENT, LIB100, FILEREF, ID2GENRE_DOCUMENT: parseInt(ID2GENRE_DOCUMENT), DHCRE };
          }).filter((doc: any) => doc.IDDOCUMENT) : []
      }));
    } catch (error) {
      console.error('Erreur getChatMessages:', error);
      return [];
    }
  }

  async createChatMessage(interventionId: number, messageData: any): Promise<Action> {
    try {
      // Récupérer les informations IDPROJET et IDTACHE depuis l'intervention
      const intervention = await this.getIntervention(interventionId);
      let idprojet = 0;
      let idtache = 0;
      
      if (intervention) {
        idprojet = intervention.IDPROJET || 0;
        idtache = intervention.IDTACHE || 0;
        console.log(`📋 Récupération projet/tâche depuis intervention ${interventionId}:`, { idprojet, idtache });
      }

      // Champs obligatoires pour les messages chat
      const insertData = {
        LIB100: messageData.LIB100 || 'Message chat',
        COMMENTAIRE: messageData.COMMENTAIRE || '',
        CDUSER: messageData.CDUSER || 'WEB',
        CLE_PIECE_CIBLE: messageData.CLE_PIECE_CIBLE || `INT${interventionId}`,
        TYPACT: 10, // Messages chat
        ID2GENRE_ACTION: 1, // Genre pour chat
        IDACTION_PREC: messageData.IDACTION_PREC || 0, // Message auquel on répond (0 si pas de réponse)
        IDPROJET: idprojet, // Récupéré depuis INTERVENTION
        IDTACHE: idtache, // Récupéré depuis INTERVENTION
        DHCRE: new Date(),
        DHMOD: new Date(),
        USCRE: messageData.CDUSER || 'WEB',
        USMOD: messageData.CDUSER || 'WEB'
      };

      console.log('Tentative d\'insertion ACTION avec data:', insertData);
      const result = await db.insert(actions).values(insertData);
      const insertId = result[0].insertId as number;
      console.log('Action créée avec ID:', insertId);
      const newAction = await this.getAction(insertId);
      return newAction!;
    } catch (error) {
      console.error('Erreur createChatMessage - détail:', error);
      throw error;
    }
  }

  // Gestion des fichiers physiques pour les interventions
  async saveFileToIntervention(interventionId: number, file: Express.Multer.File, cduser: string): Promise<Document> {
    try {
      // 0. Récupérer les informations IDPROJET et IDTACHE depuis l'intervention
      const intervention = await this.getIntervention(interventionId);
      let idprojet = 0;
      let idtache = 0;
      
      if (intervention) {
        idprojet = intervention.IDPROJET || 0;
        idtache = intervention.IDTACHE || 0;
        console.log(`📋 Récupération projet/tâche pour document depuis intervention ${interventionId}:`, { idprojet, idtache });
      }

      // 1. Créer le dossier racine et le dossier de l'intervention s'ils n'existent pas
      const baseDir = path.join(process.cwd(), 'dist', 'public', 'assets', 'photos');
      const interventionDir = path.join(baseDir, `INT${interventionId}`);
      
      // S'assurer que le dossier de base existe
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        console.log(`📁 Dossier de base créé: ${baseDir}`);
      }
      
      // S'assurer que le dossier d'intervention existe
      if (!fs.existsSync(interventionDir)) {
        fs.mkdirSync(interventionDir, { recursive: true });
        console.log(`📁 Dossier intervention créé: ${interventionDir}`);
      }

      // 2. Générer un nom de fichier unique avec extension
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(interventionDir, fileName);

      // 3. Sauvegarder le fichier physiquement
      fs.writeFileSync(filePath, file.buffer);
      console.log(`Fichier sauvegardé: ${filePath}`);

      // 4. Créer l'entrée en base de données
      const fileRef = `/photos/INT${interventionId}/${fileName}`;
      // Générer un IDDOCUMENT unique basé sur timestamp + random
      const iddocument = Date.now() + Math.floor(Math.random() * 1000);
      
      const insertData = {
        IDDOCUMENT: iddocument,
        LIB100: file.originalname,
        FILEREF: fileRef, // Chemin relatif pour l'accès web
        COMMENTAIRE: `Fichier uploadé: ${file.originalname}`,
        CDUSER: cduser,
        ID2GENRE_DOCUMENT: file.mimetype.startsWith('image/') ? 1 : 2,
        TRGCIBLE: '', // Sera défini par l'appelant (ACTxxx pour chat)
        IDPROJET: idprojet, // Récupéré depuis INTERVENTION
        IDTACHE: idtache, // Récupéré depuis INTERVENTION
        DHCRE: new Date(),
        DHMOD: new Date(),
        USCRE: cduser,
        USMOD: cduser
      };

      const result = await db.insert(documents).values(insertData);
      console.log('📄 Document inséré avec result:', result[0]);
      const newDocument = await this.getDocument(iddocument);
      
      console.log(`Document créé en BDD avec IDDOCUMENT: ${iddocument}, IDPROJET: ${idprojet}, IDTACHE: ${idtache}, FILEREF: ${fileRef}`);
      return newDocument!;
    } catch (error) {
      console.error('Erreur saveFileToIntervention:', error);
      throw error;
    }
  }

  // Gestion des fichiers physiques pour l'onglet Rapport/Photos (TRGCIBLE = INTxxx)
  async savePhotoToInterventionReport(interventionId: number, file: Express.Multer.File, cduser: string, comment?: string): Promise<Document> {
    try {
      // 0. Récupérer les informations complètes de l'intervention (IDPROJET, IDTACHE, IDCONTACT)
      const intervention = await this.getIntervention(interventionId);
      let idprojet = 0;
      let idtache = 0;
      let idcontact = 0;
      
      if (intervention) {
        idprojet = intervention.IDPROJET || 0;
        idtache = intervention.IDTACHE || 0;
        idcontact = intervention.IDCONTACT || 0;
        console.log(`📋 Récupération infos pour photo rapport depuis intervention ${interventionId}:`, { idprojet, idtache, idcontact });
      }

      // 1. Créer le dossier racine et le sous-dossier spécifique à l'intervention
      const baseDir = path.join(process.cwd(), 'dist', 'public', 'assets', 'photos');
      const interventionDir = path.join(baseDir, `INT${interventionId}`);
      
      // S'assurer que le dossier de base existe
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        console.log(`📁 Dossier de base créé: ${baseDir}`);
      }
      
      // S'assurer que le sous-dossier d'intervention existe
      if (!fs.existsSync(interventionDir)) {
        fs.mkdirSync(interventionDir, { recursive: true });
        console.log(`📁 Sous-dossier créé pour intervention: ${interventionDir}`);
      }

      // 2. Générer un nom de fichier unique avec extension
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(interventionDir, fileName);

      // 3. Sauvegarder le fichier physiquement dans le sous-dossier
      fs.writeFileSync(filePath, file.buffer);
      console.log(`📷 Photo sauvegardée dans sous-dossier: ${filePath}`);

      // 4. Créer l'entrée en base de données avec TRGCIBLE = INTxxx
      const fileRef = `/photos/INT${interventionId}/${fileName}`;
      const iddocument = Date.now() + Math.floor(Math.random() * 1000);
      
      const insertData = {
        IDDOCUMENT: iddocument,
        LIB100: file.originalname,
        FILEREF: fileRef, // Chemin relatif incluant le sous-dossier
        COMMENTAIRE: comment || `Photo rapport: ${file.originalname}`,
        CDUSER: cduser,
        ID2GENRE_DOCUMENT: file.mimetype.startsWith('image/') ? 1 : 2,
        TRGCIBLE: `INT${interventionId}`, // Lié directement à l'intervention (pas à une action)
        IDPROJET: idprojet,
        IDTACHE: idtache,
        IDCONTACT: idcontact, // Ajout de l'IDCONTACT depuis l'intervention
        DHCRE: new Date(),
        DHMOD: new Date(),
        USCRE: cduser,
        USMOD: cduser
      };

      const result = await db.insert(documents).values(insertData);
      console.log('📄 Document photo rapport inséré avec result:', result[0]);
      const newDocument = await this.getDocument(iddocument);
      
      console.log(`Photo rapport créée en BDD avec IDDOCUMENT: ${iddocument}, TRGCIBLE: INT${interventionId}, IDCONTACT: ${idcontact}, FILEREF: ${fileRef}`);
      return newDocument!;
    } catch (error) {
      console.error('Erreur savePhotoToInterventionReport:', error);
      throw error;
    }
  }

  // Z83_INTERVENTION - Instructions avancées
  async getZ83Intervention(interventionId: number): Promise<Z83Intervention | undefined> {
    try {
      const result = await db.select()
        .from(z83Interventions)
        .where(eq(z83Interventions.IDINTERVENTION, interventionId))
        .limit(1);
      
      return result[0];
    } catch (error) {
      console.error('Erreur lors de la récupération des instructions Z83:', error);
      throw error;
    }
  }

  async createOrUpdateZ83Intervention(interventionId: number, instructions: string, userId: string): Promise<Z83Intervention> {
    try {
      // Vérifier si une entrée existe déjà
      const existing = await this.getZ83Intervention(interventionId);
      
      if (existing) {
        // Mettre à jour
        const updateData = {
          INSTRUCTIONS: instructions,
          DHMOD: new Date().toISOString(),
          USMOD: userId.substring(0, 3), // Limiter à 3 caractères
          updated_at: new Date()
        };

        const result = await db.update(z83Interventions)
          .set(updateData)
          .where(eq(z83Interventions.IDINTERVENTION, interventionId));

        // Récupérer l'enregistrement mis à jour
        return await this.getZ83Intervention(interventionId) as Z83Intervention;
      } else {
        // Créer un nouveau
        const newData: InsertZ83Intervention = {
          IDINTERVENTION: interventionId,
          INSTRUCTIONS: instructions,
          DHCRE: new Date().toISOString(),
          USCRE: userId.substring(0, 50), // Limiter à 50 caractères
          DHMOD: new Date().toISOString(),
          USMOD: userId.substring(0, 3), // Limiter à 3 caractères
          created_at: new Date(),
          updated_at: new Date()
        };

        const result = await db.insert(z83Interventions).values(newData);
        
        // Récupérer l'enregistrement créé
        return await this.getZ83Intervention(interventionId) as Z83Intervention;
      }
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour des instructions Z83:', error);
      throw error;
    }
  }

  // Custom Forms
  async getFormsByEntityType(entityTypeId: number): Promise<Form[]> {
    try {
      const result = await db.select().from(forms)
        .where(eq(forms.entity_type_id, entityTypeId))
        .orderBy(forms.id);
      return result;
    } catch (error) {
      console.error('Erreur getFormsByEntityType:', error);
      return [];
    }
  }

  async getFormWithFields(formId: number): Promise<Form & { fields: FormField[] } | undefined> {
    try {
      // Récupérer le formulaire
      const formResult = await db.select().from(forms)
        .where(eq(forms.id, formId))
        .limit(1);
      
      if (formResult.length === 0) {
        return undefined;
      }
      
      // Récupérer les champs du formulaire
      const fieldsResult = await db.select().from(formsFields)
        .where(eq(formsFields.idforms, formId))
        .orderBy(formsFields.ordre_groupe, formsFields.ordre);
      
      return { 
        ...formResult[0], 
        fields: fieldsResult 
      };
    } catch (error) {
      console.error('Erreur getFormWithFields:', error);
      return undefined;
    }
  }

  async createForm(formData: Omit<Form, 'id' | 'created_at' | 'updated_at'>): Promise<Form> {
    try {
      const result = await db.insert(forms).values(formData);
      const insertId = result[0].insertId as number;
      const newForm = await db.select().from(forms)
        .where(eq(forms.id, insertId))
        .limit(1);
      return newForm[0];
    } catch (error) {
      console.error('Erreur createForm:', error);
      throw error;
    }
  }

  async updateForm(formId: number, formData: Partial<Form>): Promise<Form | undefined> {
    try {
      await db.update(forms)
        .set({ ...formData, updated_at: new Date() })
        .where(eq(forms.id, formId));
      
      const updated = await db.select().from(forms)
        .where(eq(forms.id, formId))
        .limit(1);
      return updated[0];
    } catch (error) {
      console.error('Erreur updateForm:', error);
      return undefined;
    }
  }

  async deleteForm(formId: number): Promise<boolean> {
    try {
      // Supprimer d'abord les valeurs des champs
      await db.delete(formsFieldsValues)
        .where(sql`forms_field_id IN (SELECT id FROM forms_fields WHERE idforms = ${formId})`);
      
      // Supprimer les champs du formulaire
      await db.delete(formsFields)
        .where(eq(formsFields.idforms, formId));
      
      // Supprimer le formulaire
      const result = await db.delete(forms)
        .where(eq(forms.id, formId));
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteForm:', error);
      return false;
    }
  }
  
  // Form Fields
  async getFormFields(formId: number): Promise<FormField[]> {
    try {
      const result = await db.select().from(formsFields)
        .where(eq(formsFields.idforms, formId))
        .orderBy(formsFields.ordre_groupe, formsFields.ordre);
      return result;
    } catch (error) {
      console.error('Erreur getFormFields:', error);
      return [];
    }
  }

  async createFormField(fieldData: Omit<FormField, 'id' | 'created_at' | 'updated_at'>): Promise<FormField> {
    try {
      const result = await db.insert(formsFields).values(fieldData);
      const insertId = result[0].insertId as number;
      const newField = await db.select().from(formsFields)
        .where(eq(formsFields.id, insertId))
        .limit(1);
      return newField[0];
    } catch (error) {
      console.error('Erreur createFormField:', error);
      throw error;
    }
  }

  async updateFormField(fieldId: number, fieldData: Partial<FormField>): Promise<FormField | undefined> {
    try {
      await db.update(formsFields)
        .set({ ...fieldData, updated_at: new Date() })
        .where(eq(formsFields.id, fieldId));
      
      const updated = await db.select().from(formsFields)
        .where(eq(formsFields.id, fieldId))
        .limit(1);
      return updated[0];
    } catch (error) {
      console.error('Erreur updateFormField:', error);
      return undefined;
    }
  }

  async deleteFormField(fieldId: number): Promise<boolean> {
    try {
      // Supprimer d'abord les valeurs de ce champ
      await db.delete(formsFieldsValues)
        .where(eq(formsFieldsValues.forms_field_id, fieldId));
      
      // Supprimer le champ
      const result = await db.delete(formsFields)
        .where(eq(formsFields.id, fieldId));
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteFormField:', error);
      return false;
    }
  }

  async reorderFormFields(formId: number, fieldOrders: { id: number; ordre: number; groupe?: string; ordre_groupe?: number }[]): Promise<boolean> {
    try {
      // Mettre à jour chaque champ individuellement
      for (const fieldOrder of fieldOrders) {
        await db.update(formsFields)
          .set({ 
            ordre: fieldOrder.ordre,
            groupe: fieldOrder.groupe || 'General',
            ordre_groupe: fieldOrder.ordre_groupe || 0,
            updated_at: new Date() 
          })
          .where(eq(formsFields.id, fieldOrder.id));
      }
      return true;
    } catch (error) {
      console.error('Erreur reorderFormFields:', error);
      return false;
    }
  }
  
  // Form Values
  async getFormValues(formId: number, entityId: number): Promise<{ [fieldId: number]: string }> {
    try {
      const result = await db.select().from(formsFieldsValues)
        .innerJoin(formsFields, eq(formsFieldsValues.forms_field_id, formsFields.id))
        .where(sql`${formsFields.idforms} = ${formId} AND ${formsFieldsValues.entity_id} = ${entityId}`);
      
      const values: { [fieldId: number]: string } = {};
      result.forEach((row) => {
        values[row.forms_fields_values.forms_field_id] = row.forms_fields_values.valeur || '';
      });
      return values;
    } catch (error) {
      console.error('Erreur getFormValues:', error);
      return {};
    }
  }

  async saveFormValues(formId: number, entityId: number, values: { [fieldId: number]: string }, createdBy: string): Promise<boolean> {
    try {
      // Supprimer les anciennes valeurs pour cette entité et ce formulaire
      await db.delete(formsFieldsValues)
        .where(sql`forms_field_id IN (SELECT id FROM forms_fields WHERE idforms = ${formId}) AND entity_id = ${entityId}`);
      
      // Insérer les nouvelles valeurs
      if (Object.keys(values).length > 0) {
        const valuesToInsert = Object.entries(values).map(([fieldId, valeur]) => ({
          forms_field_id: parseInt(fieldId),
          entity_id: entityId,
          valeur,
          created_by: createdBy
        }));
        
        await db.insert(formsFieldsValues).values(valuesToInsert);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur saveFormValues:', error);
      return false;
    }
  }

  async getFilledFormsForEntity(entityTypeId: number, entityId: number): Promise<Array<Form & { values: { [fieldId: number]: string } }>> {
    try {
      const formsResult = await db.select().from(forms)
        .where(eq(forms.entity_type_id, entityTypeId));
      
      const formsWithValues = [];
      for (const form of formsResult) {
        const values = await this.getFormValues(form.id, entityId);
        formsWithValues.push({
          ...form,
          values
        });
      }
      
      return formsWithValues;
    } catch (error) {
      console.error('Erreur getFilledFormsForEntity:', error);
      return [];
    }
  }

  // Intervention enrichment methods
  async getMachineByCleMachine(cleMachine: string): Promise<MachineMnt | undefined> {
    try {
      // Extraire l'IDMACHINE de CLE_MACHINE_CIBLE (format: R + IDMACHINE)
      if (!cleMachine || !cleMachine.startsWith('R')) {
        return undefined;
      }
      
      const idMachine = parseInt(cleMachine.substring(1));
      if (isNaN(idMachine)) {
        return undefined;
      }

      const result = await db.select().from(machinesMnt).where(eq(machinesMnt.IDMACHINE, idMachine)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Erreur lors de la récupération de la machine:', error);
      return undefined;
    }
  }

  async getContactById(contactId: number): Promise<Contact | undefined> {
    try {
      const result = await db.select().from(contacts).where(eq(contacts.IDCONTACT, contactId)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du contact:', error);
      return undefined;
    }
  }
}

export const storage = new MySQLStorage();
