import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORTFOLIO_FILE = path.join(__dirname, "../data/portfolio.json");
const DB_FILE = path.join(__dirname, "../data/db.json");

export const getPortfolio = async (req, res) => {
  const portfolio = await fs.readJSON(PORTFOLIO_FILE).catch(() => null);
  if (!portfolio) return res.status(404).json({ message: "Portfolio introuvable" });
  res.json(portfolio);
};

export const getUserPortfolio = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const db = await fs.readJSON(DB_FILE).catch(() => ({ users: [], portfolios: {} }));
    
    console.log("📋 getUserPortfolio - Recherche userId:", userId);
    console.log("📋 Utilisateurs disponibles:", db.users.map(u => ({ id: u.id, type: typeof u.id })));
    console.log("📋 Portfolios disponibles:", Object.keys(db.portfolios));
    
    // Vérifier si l'utilisateur existe (conversion en nombre pour comparaison)
    const userIdNum = parseInt(userId);
    const user = db.users.find(u => u.id === userIdNum || u.id == userId);
    
    console.log("👤 Utilisateur trouvé:", user ? user.name : "NON");
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    
    // Récupérer le portfolio de l'utilisateur depuis db.json
    // Essayer avec userId en tant que chaîne ET en tant que nombre
    const userPortfolio = db.portfolios[userId] || db.portfolios[userIdNum] || {
      profile: {
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        title: '',
        bio: '',
        email: user.email,
        phone: '',
        location: ''
      },
      skills: [],
      projects: [],
      experiences: [],
      education: [],
      certifications: [],
      media: {
        linkedin: '',
        github: '',
        twitter: '',
        websites: [],
        links: []
      }
    };
    
    console.log("✅ Portfolio retourné:", !!userPortfolio);
    res.json(userPortfolio);
  } catch (error) {
    console.error("Erreur lors de la récupération du portfolio:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const savePortfolio = async (req, res) => {
  const { userId, ...data } = req.body || {};
  const next = { ...data, updatedAt: new Date() };

  // Si un userId est fourni, persister dans db.json dans la clé portfolios[userId]
  if (userId) {
    try {
      const db = await fs.readJSON(DB_FILE).catch(() => ({ users: [], portfolios: {} }));
      db.portfolios = db.portfolios || {};
      db.portfolios[userId] = {
        ...db.portfolios[userId],
        ...next,
      };
      await fs.writeJSON(DB_FILE, db, { spaces: 2 });
      return res.json(db.portfolios[userId]);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du portfolio utilisateur:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Fallback legacy: sans userId, on conserve l'ancien fichier portfolio.json
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

  // Si userId est fourni, mettre à jour db.json dans portfolios[userId]
  if (userId) {
    try {
      const db = await fs.readJSON(DB_FILE).catch(() => ({ users: [], portfolios: {} }));
      db.portfolios = db.portfolios || {};
      db.portfolios[userId] = {
        ...db.portfolios[userId],
        ...next,
      };
      await fs.writeJSON(DB_FILE, db, { spaces: 2 });
      return res.json(db.portfolios[userId]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du portfolio utilisateur:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Fallback legacy
  await fs.writeJSON(PORTFOLIO_FILE, next, { spaces: 2 });
  res.json(next);
};
