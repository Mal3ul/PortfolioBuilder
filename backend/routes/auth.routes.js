import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import pool from "../config/database.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

const router = express.Router();

// Middleware pour vérifier JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  console.log('[auth] verifyToken middleware - Authorization header:', req.headers.authorization ? 'présent' : 'manquant');
  console.log('[auth] verifyToken middleware - Token:', token ? `${token.substring(0, 20)}...` : 'undefined');

  if (!token) {
    console.log('[auth] verifyToken - 401: Token manquant');
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[auth] verifyToken - Token valide pour user:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('[auth] verifyToken - 401: Token invalide', error.message);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier le password avec bcryptjs
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const role = user.role || 'user';

    // Mettre à jour le rôle si manquant
    if (!user.role) {
      await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, user.id]);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role
    });
  } catch (error) {
    console.error('[auth] login error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("[AUTH] Register request received:", { name, email, password });

  // Validation des champs requis
  if (!name || !email || !password) {
    console.log("[ERROR] Validation failed - missing fields");
    return res.status(400).json({ message: "Tous les champs sont requis (name, email, password)" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit faire au moins 6 caractères" });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const [firstName = "", ...rest] = (name || "").trim().split(" ");
    const lastName = rest.join(" ").trim();
    const userId = Date.now().toString();

    // Hasher le password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Créer l'utilisateur
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, name, email, hashedPassword, 'user', new Date().toISOString()]
    );

    // Créer le portfolio associé
    await pool.query(
      `INSERT INTO portfolios (id, user_id, first_name, last_name, title, bio, email, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId, // L'id du portfolio = l'id de l'utilisateur
        userId,
        firstName || 'User',
        lastName || '',
        '',
        '',
        email,
        new Date().toISOString()
      ]
    );

    const token = jwt.sign(
      { id: userId, email, role: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      userId,
      name,
      email,
      role: 'user'
    });
  } catch (error) {
    console.error('[auth] register error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log('[auth] forgot-password request for:', email);

  if (!email) {
    return res.status(400).json({ message: "Email requis" });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1h de validité

    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpires, user.id]
    );

    // Ne pas envoyer d'email, juste retourner le token en dev
    // console.log('[auth] Token de réinitialisation généré:', resetToken);
    console.log('[auth] URL:', `http://localhost:5173/reset-password/${resetToken}`);

    const responseData = { 
      message: "Token de réinitialisation généré (voir console)",
      devToken: resetToken,
      devUrl: `http://localhost:5173/reset-password/${resetToken}`
    };

    res.json(responseData);
  } catch (error) {
    console.error('[auth] forgot-password error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token et mot de passe requis" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expiry > $2',
      [token, Date.now()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    // Hash le nouveau mot de passe avant de le sauvegarder
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error('[auth] reset-password error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user);
  } catch (error) {
    console.error('[auth] me error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Change email
router.post("/change-email", async (req, res) => {
  const { newEmail, userId } = req.body;

  if (!newEmail || !userId) {
    return res.status(400).json({ message: "Email et userId requis" });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [newEmail, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Mettre à jour l'email dans users
    await pool.query(
      'UPDATE users SET email = $1 WHERE id = $2',
      [newEmail, userId]
    );

    // Mettre à jour aussi dans portfolios si existe
    await pool.query(
      'UPDATE portfolios SET email = $1 WHERE user_id = $2',
      [newEmail, userId]
    );

    res.json({ message: "Email modifié avec succès" });
  } catch (error) {
    console.error('[auth] change-email error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Change password
router.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;

  if (!currentPassword || !newPassword || !userId) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const result = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hash le nouveau mot de passe
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error('[auth] change-password error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
