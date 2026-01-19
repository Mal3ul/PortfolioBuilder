import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/database.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

const router = express.Router();

// Middleware pour vérifier JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  console.log('[auth] verifyToken middleware - Authorization header:', req.headers.authorization ? '✅ présent' : '❌ manquant');
  console.log('[auth] verifyToken middleware - Token:', token ? `✅ ${token.substring(0, 20)}...` : '❌ undefined');

  if (!token) {
    console.log('[auth] verifyToken - 401: Token manquant');
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[auth] verifyToken - ✅ Token valide pour user:', decoded.id);
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
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    const user = result.rows[0];

    if (!user) {
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

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const [firstName = "", ...rest] = (name || "").trim().split(" ");
    const lastName = rest.join(" ").trim();
    const userId = Date.now().toString();

    // Créer l'utilisateur
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, name, email, password, 'user', new Date().toISOString()]
    );

    // Créer le portfolio associé
    await pool.query(
      `INSERT INTO portfolios (user_id, first_name, last_name, title, bio, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        firstName || 'User',
        lastName || '',
        `${firstName || 'User'}'s Portfolio`,
        '',
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
    const resetTokenExpires = Date.now() + 3600000; // 1h en timestamp

    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpires, user.id]
    );

    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);
    console.log('[auth] email result', emailResult);

    if (!emailResult.success) {
      return res.status(502).json({
        message: "Erreur lors de l'envoi de l'email",
        error: emailResult.error
      });
    }

    const responseData = { message: "Email de réinitialisation envoyé" };
    
    if (process.env.NODE_ENV !== 'production') {
      responseData.devInfo = {
        resetToken,
        resetUrl: `http://localhost:5173/reset-password?token=${resetToken}`
      };
    }

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

    await pool.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiry = NULL WHERE id = $2',
      [newPassword, user.id]
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

export default router;
