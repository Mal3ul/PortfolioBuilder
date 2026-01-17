// /backend/controllers/activities.controller.js
import fs from "fs-extra";
const PORTFOLIO_FILE = "./data/portfolio.json";

// Récupérer l'historique d'activité d'un utilisateur
export const getActivities = async (req, res) => {
  const { userId } = req.params;
  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));

  if (!portfolios[userId]) return res.status(404).json({ message: "Portfolio introuvable" });

  // On retourne un tableau d'activités (ex: date + action)
  res.json(portfolios[userId].activities || []);
};
