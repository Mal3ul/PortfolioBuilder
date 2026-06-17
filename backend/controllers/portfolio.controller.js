import * as portfolioService from "../services/portfolio.service.js";

// Couche HTTP : lit la requête, appelle le service, renvoie la réponse.

export const getPortfolio = async (req, res) => {
  const result = await portfolioService.getOwnPortfolio(req.user?.id);
  res.json(result);
};

export const getUserPortfolio = async (req, res) => {
  const result = await portfolioService.getPublicPortfolio(req.params.userId);
  res.json(result);
};

export const updatePortfolio = async (req, res) => {
  const result = await portfolioService.updatePortfolio(req.user?.id, req.body);
  res.json(result);
};

export const savePortfolio = async (req, res) => {
  const { userId, profile } = req.body;
  const result = await portfolioService.savePortfolio(userId, profile);
  res.json(result);
};

export default { getPortfolio, getUserPortfolio, updatePortfolio, savePortfolio };
