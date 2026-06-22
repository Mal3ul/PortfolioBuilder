import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import * as userRepository from "../repositories/user.repository.js";
import * as portfolioRepository from "../repositories/portfolio.repository.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";
import { badRequest, unauthorized, notFound } from "../utils/httpError.js";

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw unauthorized("Identifiants invalides");

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) throw unauthorized("Identifiants invalides");

  const role = user.role || 'user';
  if (!user.role) {
    await userRepository.updateRole(user.id, role);
  }

  // Enregistre la connexion (sert au suivi d'inactivité / conservation des données).
  await userRepository.updateLastLogin(user.id);

  const token = signToken({ id: user.id, email: user.email, role });
  return { token, userId: user.id, name: user.name, email: user.email, role };
};

export const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw badRequest("Tous les champs sont requis (name, email, password)");
  }
  if (password.length < 6) {
    throw badRequest("Le mot de passe doit faire au moins 6 caractères");
  }

  if (await userRepository.existsByEmail(email)) {
    throw badRequest("Email déjà utilisé");
  }

  const [firstName = "", ...rest] = (name || "").trim().split(" ");
  const lastName = rest.join(" ").trim();
  const userId = Date.now().toString();
  const hashedPassword = await bcryptjs.hash(password, 10);
  const createdAt = new Date().toISOString();

  await userRepository.create({ id: userId, name, email, password: hashedPassword, role: 'user', createdAt });
  await portfolioRepository.createWithId({ id: userId, userId, firstName, lastName, email });

  const token = signToken({ id: userId, email, role: 'user' });
  return { token, userId, name, email, role: 'user' };
};

const RESET_MESSAGE = "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.";

export const forgotPassword = async (email) => {
  if (!email) throw badRequest("Email requis");

  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { message: RESET_MESSAGE };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = Date.now() + 3600000; // 1h de validité

  await userRepository.setResetToken(user.id, resetToken, resetTokenExpires);

  const emailResult = await sendPasswordResetEmail(email, resetToken, user.name || 'Utilisateur');
  if (!emailResult.success) {
    throw new Error(emailResult.error || "Impossible d'envoyer l'email de réinitialisation");
  }

  const response = { message: RESET_MESSAGE };
  if (emailResult.resetUrl) {
    response.devUrl = emailResult.resetUrl;
    response.devToken = resetToken;
  }
  return response;
};

export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) throw badRequest("Token et mot de passe requis");

  const user = await userRepository.findByResetToken(token, Date.now());
  if (!user) throw badRequest("Token invalide ou expiré");

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await userRepository.updatePasswordAndClearReset(user.id, hashedPassword);

  return { message: "Mot de passe réinitialisé avec succès" };
};

export const getMe = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw notFound("Utilisateur introuvable");
  return user;
};

export const changeEmail = async (userId, newEmail) => {
  if (!newEmail || !userId) throw badRequest("Email et userId requis");

  if (await userRepository.existsByEmail(newEmail, userId)) {
    throw badRequest("Cet email est déjà utilisé");
  }

  await userRepository.updateEmail(userId, newEmail);
  await portfolioRepository.updateEmailByUserId(userId, newEmail);
  return { message: "Email modifié avec succès" };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword || !userId) throw badRequest("Tous les champs sont requis");

  const user = await userRepository.findPasswordById(userId);
  if (!user) throw notFound("Utilisateur introuvable");

  const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
  if (!isPasswordValid) throw unauthorized("Mot de passe actuel incorrect");

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await userRepository.updatePassword(userId, hashedPassword);
  return { message: "Mot de passe modifié avec succès" };
};
