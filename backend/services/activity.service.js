import * as activityRepository from "../repositories/activity.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { unauthorized, notFound } from "../utils/httpError.js";

/**
 * Normalise une activité : le champ `details` est stocké en JSON (texte) et
 * renvoyé sous forme d'objet.
 * @param {object} activity - Ligne d'activité issue de la base.
 * @returns {object} L'activité avec `details` désérialisé.
 */
const parseDetails = (activity) => ({
  ...activity,
  details: typeof activity.details === 'string' ? JSON.parse(activity.details) : activity.details
});

/**
 * Liste les dernières activités de l'utilisateur connecté.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @returns {Promise<object[]>} Les activités (vide si aucun portfolio).
 * @throws {HttpError} 401 si non authentifié.
 */
export const getActivities = async (userId) => {
  if (!userId) throw unauthorized("Non authentifié");

  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) return [];

  const activities = await activityRepository.findByPortfolioId(portfolioId);
  return activities.map(parseDetails);
};

/**
 * Enregistre une nouvelle activité pour l'utilisateur connecté.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {{action: string, details?: object}} activity - Action et détails.
 * @returns {Promise<object>} L'activité créée.
 * @throws {HttpError} 401 si non authentifié, 404 si l'utilisateur n'a pas de portfolio.
 */
export const addActivity = async (userId, { action, details }) => {
  if (!userId) throw unauthorized("Non authentifié");

  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const created = await activityRepository.create(portfolioId, { action, details });
  return parseDetails(created);
};
