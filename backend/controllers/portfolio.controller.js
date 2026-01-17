import fs from "fs-extra";
const PORTFOLIO_FILE = "./data/portfolio.json";

export const getPortfolio = async (req, res) => {
  const portfolio = await fs.readJSON(PORTFOLIO_FILE).catch(() => null);
  if (!portfolio) return res.status(404).json({ message: "Portfolio introuvable" });
  res.json(portfolio);
};

export const savePortfolio = async (req, res) => {
  const data = req.body || {};
  const next = { ...data, updatedAt: new Date() };
  await fs.writeJSON(PORTFOLIO_FILE, next, { spaces: 2 });
  res.json(next);
};

export const updatePortfolio = async (req, res) => {
  const { profile, ...otherData } = req.body || {};
  const portfolio = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  const next = {
    ...portfolio,
    ...otherData,
    ...(profile && { profile: { ...portfolio.profile, ...profile } }),
    updatedAt: new Date()
  };
  await fs.writeJSON(PORTFOLIO_FILE, next, { spaces: 2 });
  res.json(next);
};
