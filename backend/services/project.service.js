import * as projectRepository from "../repositories/project.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { notFound } from "../utils/httpError.js";

const withParsedTechnologies = (project) => ({
  ...project,
  technologies: typeof project.technologies === 'string'
    ? JSON.parse(project.technologies)
    : project.technologies
});

export const getProjects = async (userId) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const projects = await projectRepository.findByPortfolioId(portfolioId);
  return projects.map(withParsedTechnologies);
};

export const addProject = async (userId, project) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const created = await projectRepository.create(portfolioId, project);
  return withParsedTechnologies(created);
};

// Vérifie que le projet existe et appartient bien à l'utilisateur (anti-IDOR).
const checkOwnership = async (userId, projectId) => {
  const portfolioId = await portfolioRepository.findIdByUserId(userId);
  if (!portfolioId) throw notFound("Portfolio introuvable");

  const project = await projectRepository.findById(projectId);
  if (!project || String(project.portfolio_id) !== String(portfolioId)) {
    throw notFound("Projet introuvable");
  }
};

export const updateProject = async (userId, id, project) => {
  await checkOwnership(userId, id);

  const updated = await projectRepository.update(id, project);
  return withParsedTechnologies(updated);
};

export const deleteProject = async (userId, id) => {
  await checkOwnership(userId, id);

  await projectRepository.remove(id);
  return { message: "Projet supprimé" };
};
