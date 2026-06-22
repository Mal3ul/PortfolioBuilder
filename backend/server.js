import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

// Charger le .env seulement s'il existe (en dev local)
if (fs.existsSync(envPath)) {
  console.log('[env] Loading .env from:', envPath);
  const result = dotenv.config({ path: envPath, quiet: true });
  console.log('[env] dotenv result:', result.error ? `ERROR: ${result.error.message}` : `loaded ${Object.keys(result.parsed || {}).length} vars`);
} else {
  console.log('[env] .env not found at', envPath, '- using system environment variables (production mode)');
}

// console.log('[env] DATABASE_URL:', process.env.DATABASE_URL ? `présent (${process.env.DATABASE_URL.substring(0, 50)}...)` : 'undefined');

import app from "./app.js";
import { startScheduledJobs } from "./services/scheduler.service.js";

// Gestionnaire d'erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Server running on port ${PORT}`);
  // Démarre les tâches planifiées (nettoyage des comptes inactifs).
  startScheduledJobs();
});

server.on('error', (err) => {
  console.error('[ERROR] Server error:', err);
  process.exit(1);
});

// Garder le process actif
setInterval(() => {
  // Rien, juste garder le serveur actif
}, 1000);
