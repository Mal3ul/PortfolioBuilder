import * as activityRepository from "../repositories/activity.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { unauthorized, notFound } from "../utils/httpError.js";

const parseDetails = (activity) => ({
  ...activity,
  details: typeof activity.details === 'string' ? JSON.parse(activity.details) : activity.details
});

export const getActivities = async (userId) => {
  if (!userId) throw unauthorized("Non authentifié");

  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) return [];

  const activities = await activityRepository.findByPortfolioId(portfolioId);
  return activities.map(parseDetails);
};

export const addActivity = async (userId, { action, details }) => {
  if (!userId) throw unauthorized("Non authentifié");

  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const created = await activityRepository.create(portfolioId, { action, details });
  return parseDetails(created);
};
