import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { sendPasswordResetEmail } from "../utils/email.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const DB_PATH = path.join(__dirname, "../data/db.json");

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDB = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Middleware pour vérifier JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  // Déterminer le rôle (fallback si manquant)
  const role = user.role ? user.role : (user.email === "admin@test.com" ? "admin" : "user");

  // Persister le rôle si manquant ou différent
  if (!user.role || user.role !== role) {
    user.role = role;
    writeDB(db);
  }

  // ✅ Générer JWT
  const token = jwt.sign({ id: user.id, email: user.email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.json({
    token,
    userId: user.id,
    name: user.name,
    email: user.email,
    role
  });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (db.users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email déjà utilisé" });
  }

  const [firstName = "", ...rest] = (name || "").trim().split(" ");
  const lastName = rest.join(" ").trim();

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: "user"
  };

  db.users.push(newUser);
  db.portfolios[newUser.id] = {
    profile: {
      firstName,
      lastName,
      title: "",
      bio: "",
      email,
      phone: "",
      location: ""
    },
    skills: [],
    projects: [],
    experiences: [],
    education: [],
    certifications: [],
    media: {
      linkedin: "",
      github: "",
      twitter: "",
      websites: [],
      links: []
    }
  };

  writeDB(db);

  // Met à jour le portfolio global (unicité actuelle du projet)
  const portfolioPath = path.join(__dirname, "../data/portfolio.json");
  const basePortfolio = {
    updatedAt: new Date(),
    profile: {
      firstName,
      lastName,
      title: "",
      bio: "",
      email,
      phone: "",
      location: ""
    },
    skills: [],
    projects: [],
    experiences: [],
    education: [],
    certifications: [],
    media: {
      linkedin: "",
      github: "",
      twitter: "",
      websites: [],
      links: []
    }
  };
  fs.writeFileSync(portfolioPath, JSON.stringify(basePortfolio, null, 2));

  res.status(201).json({ userId: newUser.id });
});

// Changer l'email
router.post("/change-email", (req, res) => {
  const { newEmail } = req.body;
  const userId = req.headers["x-user-id"] || req.body.userId;
  
  if (!newEmail) {
    return res.status(400).json({ message: "Email requis" });
  }

  const db = readDB();
  const user = db.users.find(u => u.id == userId);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  if (db.users.find(u => u.email === newEmail && u.id != userId)) {
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
  }

  user.email = newEmail;
  writeDB(db);

  res.json({ message: "Email modifié avec succès" });
});

// Changer le mot de passe
router.post("/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.headers["x-user-id"] || req.body.userId;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Mots de passe requis" });
  }

  const db = readDB();
  const user = db.users.find(u => u.id == userId);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  if (user.password !== currentPassword) {
    return res.status(401).json({ message: "Mot de passe actuel incorrect" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  user.password = newPassword;
  writeDB(db);

  res.json({ message: "Mot de passe modifié avec succès" });
});

// Récupérer tous les utilisateurs (protégé par JWT)
import { requireRole } from "../middleware/roles.js";

router.get("/users", verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB();
  const users = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || "user"
  }));
  res.json(users);
});

// Demander la réinitialisation du mot de passe
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log('[auth] forgot-password request for', email);
  
  if (!email) {
    return res.status(400).json({ message: "Email requis" });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email === email);

  if (!user) {
    // Pour des raisons de sécurité, ne pas révéler si l'email existe
    return res.json({ 
      message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
    });
  }

  // Générer un token sécurisé
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 heure

  // Stocker le token dans l'utilisateur
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = resetTokenExpiry;
  writeDB(db);

  // Envoyer l'email
  const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);
  console.log('[auth] email result', emailResult);
  if (!emailResult?.success) {
    return res.status(502).json({
      message: "Échec de l'envoi de l'email de réinitialisation",
      error: emailResult?.error || 'unknown'
    });
  }

  res.status(200).json({ 
    message: "Un email de réinitialisation a été envoyé",
    // En développement, retourner le token et l'URL pour tester
    ...(process.env.NODE_ENV !== 'production' && emailResult.resetUrl && { 
      devToken: resetToken,
      devResetUrl: emailResult.resetUrl
    })
  });
});

// Réinitialiser le mot de passe avec le token
router.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ 
      message: "Token et nouveau mot de passe requis" 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      message: "Le mot de passe doit contenir au moins 6 caractères" 
    });
  }

  const db = readDB();
  const user = db.users.find(
    (u) => u.resetPasswordToken === token && 
           u.resetPasswordExpiry > Date.now()
  );

  if (!user) {
    return res.status(400).json({ 
      message: "Token invalide ou expiré" 
    });
  }

  // Mettre à jour le mot de passe
  user.password = newPassword;
  
  // Supprimer le token de réinitialisation
  delete user.resetPasswordToken;
  delete user.resetPasswordExpiry;
  
  writeDB(db);

  res.json({ 
    message: "Mot de passe réinitialisé avec succès" 
  });
});

export default router;
