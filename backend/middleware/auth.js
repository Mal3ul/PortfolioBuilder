import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

// Vérifie le JWT présent dans l'en-tête Authorization et expose req.user.
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
