import dotenv from "dotenv";

// Charger les variables d'environnement depuis un fichier .env si présent
dotenv.config({ quiet: true });

// Secret JWT centralisé
export const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_DEV";

// Durée d'expiration par défaut
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Politique de conservation des comptes inactifs.
// Un compte sans connexion depuis INACTIVITY_DAYS jours reçoit un e-mail
// d'avertissement, puis est supprimé après un délai de grâce de
// INACTIVITY_GRACE_DAYS jours s'il n'y a toujours pas eu de reconnexion.
const toInt = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const INACTIVITY_DAYS = toInt(process.env.INACTIVITY_DAYS, 90);
export const INACTIVITY_GRACE_DAYS = toInt(process.env.INACTIVITY_GRACE_DAYS, 7);
