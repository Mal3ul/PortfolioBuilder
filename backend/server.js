import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import activitiesRoutes from "./routes/activities.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/admin", adminRoutes);

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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur" });
});

// Gestionnaire d'erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📍 Test URL: http://localhost:${PORT}/api/portfolio/user/1768672901622`);
  }
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Garder le process actif
setInterval(() => {
  // Rien, juste garder le serveur actif
}, 1000);
