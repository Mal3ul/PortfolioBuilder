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

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Routes
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import activitiesRoutes from "./routes/activities.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/media", mediaRoutes);

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));
  
  // SPA fallback: rediriger les routes non-API vers index.html
  app.use((req, res, next) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // En développement, afficher 404 pour les routes non trouvées
  app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
  });
}

// Error handler
app.use(errorHandler);

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
});

server.on('error', (err) => {
  console.error('[ERROR] Server error:', err);
  process.exit(1);
});

// Garder le process actif
setInterval(() => {
  // Rien, juste garder le serveur actif
}, 1000);
