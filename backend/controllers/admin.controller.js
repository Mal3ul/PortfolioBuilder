import * as adminService from "../services/admin.service.js";

// Couche HTTP

export const listUsers = async (req, res) => {
  const result = await adminService.listUsers();
  res.json(result);
};

export const listPortfolios = async (req, res) => {
  const result = await adminService.listPortfolios();
  res.json(result);
};

export const updateUserRole = async (req, res) => {
  const result = await adminService.updateUserRole(req.params.userId, req.body.role);
  res.json(result);
};

export const deleteUser = async (req, res) => {
  const result = await adminService.deleteUser(req.params.userId);
  res.json(result);
};

export const deletePortfolio = async (req, res) => {
  const result = await adminService.deletePortfolio(req.params.portfolioId);
  res.json(result);
};
