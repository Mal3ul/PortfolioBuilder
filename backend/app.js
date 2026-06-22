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
import mediaRoutes from "./routes/media.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Application Express configurée, sans démarrage du serveur (testable via supertest).
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
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Hors production, afficher 404 pour les routes non trouvées
  app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
  });
}

// Error handler
app.use(errorHandler);

export default app;
