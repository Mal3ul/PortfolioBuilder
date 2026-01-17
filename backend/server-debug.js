// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";

// // Routes
// import authRoutes from "./routes/auth.routes.js";
// import portfolioRoutes from "./routes/portfolio.routes.js";
// import projectsRoutes from "./routes/projects.routes.js";
// import skillsRoutes from "./routes/skills.routes.js";
// import activitiesRoutes from "./routes/activities.routes.js";

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/portfolio", portfolioRoutes);
// app.use("/api/projects", projectsRoutes);
// app.use("/api/skills", skillsRoutes);
// app.use("/api/activities", (req, res, next) => {
//   console.log(`[ACTIVITIES ROUTE] ${req.method} ${req.url}`);
//   next();
// });
// app.use("/api/activities", activitiesRoutes);

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("Erreur globale:", err.stack);
//   res.status(500).json({ message: "Erreur serveur" });
// });

// // 404 handler
// app.use((req, res) => {
//   console.log(`404 - Route not found: ${req.method} ${req.url}`);
//   res.status(404).json({ message: "Route non trouvée" });
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
