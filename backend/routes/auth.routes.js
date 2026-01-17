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
    name: user.name
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

export default router;
