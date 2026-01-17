import fs from "fs-extra";
const PORTFOLIO_FILE = "./data/portfolio.json";
const DB_FILE = "./data/db.json";

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
  const { profile, userId, ...otherData } = req.body || {};
  const portfolio = await fs.readJSON(PORTFOLIO_FILE).catch(() => ({}));
  
  // Debug logs
  console.log("📝 UpdatePortfolio - Données reçues:", { 
    hasProfile: !!profile, 
    userId, 
    firstName: profile?.firstName, 
    lastName: profile?.lastName 
  });
  
  // Si profile contient firstName et lastName, mettre à jour aussi l'utilisateur dans db.json
  if (profile && (profile.firstName || profile.lastName) && userId) {
    try {
      const db = await fs.readJSON(DB_FILE).catch(() => ({ users: [] }));
      console.log("👤 Recherche utilisateur avec ID:", userId);
      console.log("📊 Utilisateurs dans la base:", db.users.map(u => ({ id: u.id, name: u.name })));
      
      const userIndex = db.users.findIndex(u => u.id == userId);
      console.log("🔍 Index trouvé:", userIndex);
      
      if (userIndex !== -1) {
        const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
        console.log("✅ Mise à jour du nom:", db.users[userIndex].name, "→", fullName);
        db.users[userIndex].name = fullName;
        await fs.writeJSON(DB_FILE, db, { spaces: 2 });
        console.log("💾 Nom sauvegardé dans db.json");
      } else {
        console.log("❌ Utilisateur non trouvé avec l'ID:", userId);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
    }
  } else {
    console.log("⚠️ Conditions non remplies - profile:", !!profile, "userId:", userId);
  }
  
  const next = {
    ...portfolio,
    ...otherData,
    ...(profile && { profile: { ...portfolio.profile, ...profile } }),
    updatedAt: new Date()
  };
  await fs.writeJSON(PORTFOLIO_FILE, next, { spaces: 2 });
  res.json(next);
};
