import dotenv from "dotenv";

// Charger les variables d'environnement depuis un fichier .env si présent
dotenv.config();

// Secret JWT centralisé
export const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_DEV";

// Durée d'expiration par défaut
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
