import fs from "fs-extra";
const PORTFOLIO_FILE = "./data/portfolio.json";

export const getProjects = async (req, res) => {
  const { userId } = req.params;
  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  if (!portfolios[userId]) return res.status(404).json({ message: "Portfolio introuvable" });
  res.json(portfolios[userId].projects || []);
};

export const addProject = async (req, res) => {
  const { userId, title, description, technologies } = req.body;
  if (!userId || !title) return res.status(400).json({ message: "Champs manquants" });

  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  const projects = portfolios[userId]?.projects || [];
  const newProject = { id: Date.now(), title, description, technologies };
  portfolios[userId].projects = [...projects, newProject];
  await fs.writeJSON(PORTFOLIO_FILE, portfolios);
  res.status(201).json(newProject);
};

export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const data = req.body;
  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));

  let updated = null;
  for (const userId in portfolios) {
    portfolios[userId].projects = portfolios[userId].projects.map(p => {
      if (p.id == projectId) {
        updated = { ...p, ...data };
        return updated;
      }
      return p;
    });
  }
  if (!updated) return res.status(404).json({ message: "Projet introuvable" });
  await fs.writeJSON(PORTFOLIO_FILE, portfolios);
  res.json(updated);
};

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const portfolios = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));

  let found = false;
  for (const userId in portfolios) {
    const projects = portfolios[userId].projects || [];
    const newProjects = projects.filter(p => p.id != projectId);
    if (newProjects.length !== projects.length) {
      portfolios[userId].projects = newProjects;
      found = true;
    }
  }
  if (!found) return res.status(404).json({ message: "Projet introuvable" });
  await fs.writeJSON(PORTFOLIO_FILE, portfolios);
  res.status(204).send();
};
