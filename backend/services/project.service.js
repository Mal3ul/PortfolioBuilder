import * as projectRepository from "../repositories/project.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { notFound } from "../utils/httpError.js";

/**
 * Normalise un projet pour l'API : les technologies sont stockées en JSON
 * (texte) en base et renvoyées sous forme de tableau.
 * @param {object} project - Ligne projet issue de la base.
 * @returns {object} Le projet avec `technologies` sous forme de tableau.
 */
const withParsedTechnologies = (project) => ({
  ...project,
  technologies: typeof project.technologies === 'string'
    ? JSON.parse(project.technologies)
    : project.technologies
});

/**
 * Liste les projets du portfolio d'un utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @returns {Promise<object[]>} Les projets, technologies parsées.
 * @throws {HttpError} 404 si l'utilisateur n'a pas de portfolio.
 */
export const getProjects = async (userId) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const projects = await projectRepository.findByPortfolioId(portfolioId);
  return projects.map(withParsedTechnologies);
};

/**
 * Ajoute un projet au portfolio d'un utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {object} project - Données du projet (title, description, technologies…).
 * @returns {Promise<object>} Le projet créé.
 * @throws {HttpError} 404 si l'utilisateur n'a pas de portfolio.
 */
export const addProject = async (userId, project) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const created = await projectRepository.create(portfolioId, project);
  return withParsedTechnologies(created);
};

/**
 * Vérifie que le projet existe et appartient bien à l'utilisateur (anti-IDOR).
 * @param {string} userId - Identifiant de l'utilisateur demandeur.
 * @param {string} projectId - Identifiant du projet ciblé.
 * @throws {HttpError} 404 si le portfolio ou le projet n'appartient pas à l'utilisateur.
 */
const checkOwnership = async (userId, projectId) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const project = await projectRepository.findById(projectId);
  if (!project || String(project.portfolio_id) !== String(portfolioId)) {
    throw notFound("Projet introuvable");
  }
};

/**
 * Modifie un projet appartenant à l'utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {string} id - Identifiant du projet.
 * @param {object} project - Nouvelles données du projet.
 * @returns {Promise<object>} Le projet mis à jour.
 * @throws {HttpError} 404 si le projet n'appartient pas à l'utilisateur.
 */
export const updateProject = async (userId, id, project) => {
  await checkOwnership(userId, id);

  const updated = await projectRepository.update(id, project);
  return withParsedTechnologies(updated);
};

/**
 * Supprime un projet appartenant à l'utilisateur.
 * @param {string} userId - Identifiant de l'utilisateur.
 * @param {string} id - Identifiant du projet.
 * @returns {Promise<{message: string}>} Message de confirmation.
 * @throws {HttpError} 404 si le projet n'appartient pas à l'utilisateur.
 */
export const deleteProject = async (userId, id) => {
  await checkOwnership(userId, id);

  await projectRepository.remove(id);
  return { message: "Projet supprimé" };
};
