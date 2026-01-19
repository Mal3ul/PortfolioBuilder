import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORTFOLIO_FILE = path.join(__dirname, "../data/portfolio.json");

// Récupérer toutes les activités
export const getActivities = async (req, res) => {
  try {
    // console.log("GET /api/activities appelé");
    const portfolio = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
    // console.log("Portfolio chargé:", portfolio);
    res.json(portfolio.activities || []);
  } catch (err) {
    console.error("Erreur dans getActivities:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une nouvelle activité
export const addActivity = async (req, res) => {
  try {
    const { action, name } = req.body;
    if (!action || !name) {
      return res.status(400).json({ message: "Action et nom requis" });
    }

    const portfolio = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
    const activities = portfolio.activities || [];

    const newActivity = {
      id: Date.now(),
      action,
      name,
      timestamp: Date.now()
    };

    activities.unshift(newActivity); // Ajouter au début
    portfolio.activities = activities.slice(0, 50); // Garder max 50 activités

    await fs.writeJSON(PORTFOLIO_FILE, portfolio, { spaces: 2 });
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
