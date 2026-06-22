import { withTransaction } from "../config/database.js";
import * as skillRepository from "../repositories/skill.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { unauthorized, badRequest, notFound } from "../utils/httpError.js";

/**
 * Liste les compétences du portfolio d'un utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @returns {Promise<object[]>} Les compétences.
 * @throws {HttpError} 404 si l'utilisateur n'a pas de portfolio.
 */
export const getSkills = async (userId) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  return skillRepository.findByPortfolioId(portfolioId);
};

/**
 * Ajoute une compétence au portfolio d'un utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {string} skillName - Nom de la compétence.
 * @returns {Promise<object>} La compétence créée.
 * @throws {HttpError} 404 si l'utilisateur n'a pas de portfolio.
 */
export const addSkill = async (userId, skillName) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  return skillRepository.create(portfolioId, skillName);
};

/**
 * Renomme une compétence.
 * @param {string} id - Identifiant de la compétence.
 * @param {string} skillName - Nouveau nom.
 * @returns {Promise<object>} La compétence mise à jour.
 * @throws {HttpError} 404 si la compétence est introuvable.
 */
export const updateSkill = async (id, skillName) => {
  const updated = await skillRepository.updateName(id, skillName);
  if (!updated) throw notFound("Compétence introuvable");
  return updated;
};

/**
 * Remplace l'ensemble des compétences de l'utilisateur connecté (transaction).
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {string[]} skills - Liste complète des compétences.
 * @returns {Promise<{skills: string[]}>} Les compétences enregistrées.
 * @throws {HttpError} 401 si non authentifié, 400 si `skills` n'est pas un tableau,
 *   404 si l'utilisateur n'a pas de portfolio.
 */
export const updateAllSkills = async (userId, skills) => {
  if (!userId) throw unauthorized("Non authentifié");
  if (!Array.isArray(skills)) throw badRequest("Skills doit être un array");

  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const rows = await withTransaction(async (client) => {
    await skillRepository.deleteByPortfolio(portfolioId, client);
    for (const skillName of skills) {
      await skillRepository.create(portfolioId, skillName, client);
    }
    return skillRepository.findByPortfolioId(portfolioId, client);
  });

  return { skills: rows.map((s) => s.skill_name) };
};

/**
 * Supprime une compétence.
 * @param {string} id - Identifiant de la compétence.
 * @returns {Promise<{message: string}>} Message de confirmation.
 * @throws {HttpError} 404 si la compétence est introuvable.
 */
export const deleteSkill = async (id) => {
  const deleted = await skillRepository.remove(id);
  if (!deleted) throw notFound("Compétence introuvable");
  return { message: "Compétence supprimée" };
};
