import { HttpError } from "../utils/httpError.js";

// Gestionnaire d'erreurs central : traduit les HttpError métier en réponse,
// et renvoie 500 pour toute erreur inattendue.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err.stack || err);
  res.status(500).json({ message: "Erreur serveur" });
};
