import * as authService from "../services/auth.service.js";

// Couche HTTP

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });
  res.status(201).json(result);
};

export const forgotPassword = async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.json(result);
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  res.json(result);
};

export const me = async (req, res) => {
  const result = await authService.getMe(req.user.id);
  res.json(result);
};

export const changeEmail = async (req, res) => {
  const { newEmail, userId } = req.body;
  const result = await authService.changeEmail(userId, newEmail);
  res.json(result);
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;
  const result = await authService.changePassword(userId, currentPassword, newPassword);
  res.json(result);
};
