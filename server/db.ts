import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

// Configuration MySQL distante
const connection = mysql.createPool({
  host: process.env.DB_HOST || "85.31.239.121",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "tp_admin",
  password: process.env.DB_PASSWORD || "Techn1p@rk04",
  database: process.env.DB_DATABASE || "gestinter_test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false,
});

// Test de connexion au démarrage
connection.getConnection()
  .then(conn => {
    console.log('✓ Connexion MySQL réussie à', process.env.DB_HOST || "85.31.239.121");
    conn.release();
  })
  .catch(err => {
    console.error('✗ Erreur de connexion MySQL:', err.message);
    console.error('Vérifiez les paramètres de connexion dans .env');
  });

export const db = drizzle(connection, { schema, mode: "default" });
export { schema };