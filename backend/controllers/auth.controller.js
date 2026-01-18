import fs from "fs-extra";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

const USERS_FILE = "./data/users.json";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Champs manquants" });

  const users = await fs.readJSON(USERS_FILE).catch(() => []);
  if (users.find(u => u.email === email))
    return res.status(400).json({ message: "Email déjà utilisé" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashed };
  users.push(newUser);
  await fs.writeJSON(USERS_FILE, users);

  res.status(201).json({ message: "Utilisateur créé", user: { id: newUser.id, name, email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const users = await fs.readJSON(USERS_FILE).catch(() => []);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role || "user" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role || "user" } });
};
