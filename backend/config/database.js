import dotenv from 'dotenv';
import pg from 'pg';

// Charger les variables d'environnement
dotenv.config({ quiet: true });

const { Pool } = pg;

console.log('[database] DATABASE_URL:', process.env.DATABASE_URL ? `présent (${process.env.DATABASE_URL.substring(0, 50)}...)` : 'undefined');
console.log('[database] NODE_ENV:', process.env.NODE_ENV);

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

export default pool;
