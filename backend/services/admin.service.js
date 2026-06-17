import * as userRepository from "../repositories/user.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { badRequest, notFound } from "../utils/httpError.js";

export const listUsers = async () => {
  const users = await userRepository.findAll();
  return { users };
};

export const listPortfolios = async () => {
  const portfolios = await portfolioRepository.findAllWithUser();
  return { portfolios };
};

export const updateUserRole = async (userId, role) => {
  if (!role) throw badRequest("Role requis");

  const user = await userRepository.updateRole(userId, role);
  if (!user) throw notFound("Utilisateur non trouvé");
  return { message: "Role mis à jour", user };
};

export const deleteUser = async (userId) => {
  await portfolioRepository.deleteByUserId(userId);

  const user = await userRepository.remove(userId);
  if (!user) throw notFound("Utilisateur non trouvé");
  return { message: "Utilisateur supprimé", user };
};

export const deletePortfolio = async (portfolioId) => {
  const id = await portfolioRepository.deleteWithRelations(portfolioId);
  if (!id) throw notFound("Portfolio introuvable");
  return { message: "Portfolio supprimé", id };
};
