import * as userRepository from "../repositories/user.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { badRequest, notFound } from "../utils/httpError.js";

/**
 * Liste tous les utilisateurs (réservé aux administrateurs).
 * @returns {Promise<{users: object[]}>} La liste des utilisateurs.
 */
export const listUsers = async () => {
  const users = await userRepository.findAll();
  return { users };
};

/**
 * Liste tous les portfolios avec les infos utilisateur associées (admin).
 * @returns {Promise<{portfolios: object[]}>} La liste des portfolios.
 */
export const listPortfolios = async () => {
  const portfolios = await portfolioRepository.findAllWithUser();
  return { portfolios };
};

/**
 * Modifie le rôle d'un utilisateur (admin).
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {string} role - Nouveau rôle ('user' ou 'admin').
 * @returns {Promise<{message: string, user: object}>} L'utilisateur mis à jour.
 * @throws {HttpError} 400 si le rôle est absent, 404 si l'utilisateur est introuvable.
 */
export const updateUserRole = async (userId, role) => {
  if (!role) throw badRequest("Role requis");

  const user = await userRepository.updateRole(userId, role);
  if (!user) throw notFound("Utilisateur non trouvé");
  return { message: "Role mis à jour", user };
};

/**
 * Supprime un utilisateur et son portfolio (admin).
 * @param {string} userId - Identifiant de l'utilisateur.
 * @returns {Promise<{message: string, user: object}>} L'utilisateur supprimé.
 * @throws {HttpError} 404 si l'utilisateur est introuvable.
 */
export const deleteUser = async (userId) => {
  await portfolioRepository.deleteByUserId(userId);

  const user = await userRepository.remove(userId);
  if (!user) throw notFound("Utilisateur non trouvé");
  return { message: "Utilisateur supprimé", user };
};

/**
 * Supprime un portfolio et toutes ses relations (admin).
 * @param {string} portfolioId - Identifiant du portfolio.
 * @returns {Promise<{message: string, id: string}>} Confirmation + id supprimé.
 * @throws {HttpError} 404 si le portfolio est introuvable.
 */
export const deletePortfolio = async (portfolioId) => {
  const id = await portfolioRepository.deleteWithRelations(portfolioId);
  if (!id) throw notFound("Portfolio introuvable");
  return { message: "Portfolio supprimé", id };
};
