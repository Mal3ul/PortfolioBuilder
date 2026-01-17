// /backend/controllers/skills.controller.js
import fs from "fs-extra";
const PORTFOLIO_FILE = "./data/portfolio.json";

// Récupérer toutes les compétences d'un utilisateur
export const getSkills = async (req, res) => {
  const { userId } = req.params;
  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  if (!portfolios[userId]) return res.status(404).json({ message: "Portfolio introuvable" });
  res.json(portfolios[userId].skills || []);
};

// Ajouter une compétence
export const addSkill = async (req, res) => {
  const { userId, skill, description } = req.body;
  if (!userId || !skill) return res.status(400).json({ message: "Champs manquants" });

  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  portfolios[userId].skills = portfolios[userId].skills || [];

  const newSkill = { id: Date.now(), skill, description };
  portfolios[userId].skills.push(newSkill);

  await fs.writeJSON(PORTFOLIO_FILE, portfolios);
  res.status(201).json(newSkill);
};

// Mettre à jour une compétence
export const updateSkill = async (req, res) => {
  const { skillId } = req.params;
  const data = req.body;

  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  let updated = null;

  for (const userId in portfolios) {
    portfolios[userId].skills = portfolios[userId].skills.map(s => {
      if (s.id == skillId) {
        updated = { ...s, ...data };
        return updated;
      }
      return s;
    });
  }

  if (!updated) return res.status(404).json({ message: "Compétence introuvable" });

  await fs.writeJSON(PORTFOLIO_FILE, portfolios);
  res.json(updated);
};

// Supprimer une compétence
export const deleteSkill = async (req, res) => {
  const { skillId } = req.params;
  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  let found = false;

  for (const userId in portfolios) {
    const skills = portfolios[userId].skills || [];
    const newSkills = skills.filter(s => s.id != skillId);
    if (newSkills.length !== skills.length) {
      portfolios[userId].skills = newSkills;
      found = true;
    }
  }

  if (!found) return res.status(404).json({ message: "Compétence introuvable" });

  await fs.writeJSON(PORTFOLIO_FILE, portfolios);
  res.status(204).send();
};
