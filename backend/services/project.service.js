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

export const updateProject = async (id, project) => {
  const updated = await projectRepository.update(id, project);
  if (!updated) throw notFound("Projet introuvable");
  return withParsedTechnologies(updated);
};

export const deleteProject = async (id) => {
  const deleted = await projectRepository.remove(id);
  if (!deleted) throw notFound("Projet introuvable");
  return { message: "Projet supprimé" };
};
