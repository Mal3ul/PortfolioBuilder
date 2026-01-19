import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./auth.routes.js";
import { requireRole } from "../middleware/roles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const DB_PATH = path.join(__dirname, "../data/db.json");

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Lister tous les utilisateurs (admin seulement)
router.get("/users", verifyToken, requireRole("admin"), (req, res) => {
  const db = readDB();
  const users = db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  res.json({ users });
});

// Mettre à jour le rôle d'un utilisateur (admin seulement)
router.patch("/users/:userId/role", verifyToken, requireRole("admin"), (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: "Role requis" });

  const db = readDB();
  const user = db.users.find(u => String(u.id) === String(userId));
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  user.role = role;
  writeDB(db);
  res.json({ message: "Role mis à jour", user: { id: user.id, role: user.role } });
});

// Supprimer un utilisateur (admin seulement)
router.delete("/users/:userId", verifyToken, requireRole("admin"), (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  const idx = db.users.findIndex(u => String(u.id) === String(userId));
  if (idx === -1) return res.status(404).json({ message: "Utilisateur non trouvé" });

  const removed = db.users.splice(idx, 1)[0];
  // Optionnel: supprimer portfolio associé
  if (db.portfolios && db.portfolios[removed.id]) delete db.portfolios[removed.id];
  writeDB(db);
  res.json({ message: "Utilisateur supprimé" });
});

export default router;
