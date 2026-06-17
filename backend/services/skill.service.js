import { withTransaction } from "../config/database.js";
import * as skillRepository from "../repositories/skill.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { unauthorized, badRequest, notFound } from "../utils/httpError.js";

export const getSkills = async (userId) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  return skillRepository.findByPortfolioId(portfolioId);
};

export const addSkill = async (userId, skillName) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  return skillRepository.create(portfolioId, skillName);
};

export const updateSkill = async (id, skillName) => {
  const updated = await skillRepository.updateName(id, skillName);
  if (!updated) throw notFound("Compétence introuvable");
  return updated;
};

// Remplace l'ensemble des compétences de l'utilisateur connecté.
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

export const deleteSkill = async (id) => {
  const deleted = await skillRepository.remove(id);
  if (!deleted) throw notFound("Compétence introuvable");
  return { message: "Compétence supprimée" };
};
