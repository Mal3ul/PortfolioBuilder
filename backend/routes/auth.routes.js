import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = express.Router();
const DB_PATH = "./data/db.json";
const JWT_SECRET = "portfolio-builder-hopital-singe-2026";

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
  const token = jwt.sign(
    { id: user.id, email: user.email, role },
    JWT_SECRET,
    { expiresIn: "30m" }
  );

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
  const portfolioPath = "./data/portfolio.json";
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
router.get("/users", verifyToken, (req, res) => {
  const db = readDB();
  const users = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || "user"
  }));
  res.json(users);
});

export default router;
