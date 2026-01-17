import express from "express";
import fs from "fs";

const router = express.Router();
const DB_PATH = "./data/db.json";

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDB = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  res.json({
    token: "fake-jwt-token",
    userId: user.id,
    name: user.name,
    email: user.email
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
    password
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

export default router;
