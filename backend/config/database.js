import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

// Charger les variables d'environnement du backend si le fichier existe
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, quiet: true });
} else {
  dotenv.config({ quiet: true });
}

const { Pool } = pg;

console.log('[database] DATABASE_URL:', process.env.DATABASE_URL ? `présent (${process.env.DATABASE_URL.substring(0, 50)}...)` : 'undefined');
console.log('[database] NODE_ENV:', process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
  throw new Error('[database] DATABASE_URL manquant. Vérifie backend/.env');
}

// Configuration du pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false
});

// Test de connexion
pool.on('connect', () => {
  console.log('[DATABASE] Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('[ERROR] Unexpected PostgreSQL error:', err);
});

// , ROLLBACK sinon.
export const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch { /* ignore */ }
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
