import express from "express";
import { verifyToken } from "./auth.routes.js";
import { requireRole } from "../middleware/roles.js";
import pool from "../config/database.js";

const router = express.Router();

// Lister tous les utilisateurs (admin seulement)
router.get("/users", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    console.log(`[admin] Found ${result.rows.length} users in database`);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('[admin] Error fetching users:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour le rôle d'un utilisateur (admin seulement)
router.patch("/users/:userId/role", verifyToken, requireRole("admin"), async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: "Role requis" });

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    res.json({ message: "Role mis à jour", user: result.rows[0] });
  } catch (error) {
    console.error('[admin] Error updating role:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un utilisateur (admin seulement)
router.delete("/users/:userId", verifyToken, requireRole("admin"), async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Supprimer d'abord le portfolio associé
    await pool.query('DELETE FROM portfolios WHERE user_id = $1', [userId]);
    
    // Puis supprimer l'utilisateur
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    res.json({ message: "Utilisateur supprimé", user: result.rows[0] });
  } catch (error) {
    console.error('[admin] Error deleting user:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
