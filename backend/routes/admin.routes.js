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

// Lister tous les portfolios (admin seulement)
router.get("/portfolios", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         p.id,
         p.user_id,
         p.first_name,
         p.last_name,
         p.title,
         p.bio,
         p.email AS portfolio_email,
         p.updated_at,
         u.name AS user_name,
         u.email AS user_email
       FROM portfolios p
       LEFT JOIN users u ON u.id = p.user_id
       ORDER BY p.updated_at DESC NULLS LAST, p.id DESC`
    );
    console.log(`[admin] Found ${result.rows.length} portfolios in database`);
    res.json({ portfolios: result.rows });
  } catch (error) {
    console.error('[admin] Error fetching portfolios:', error);
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

// Supprimer un portfolio (admin seulement)
// Cascade: websites/links -> media -> projects/experiences/education/certifications/skills -> portfolio
router.delete("/portfolios/:portfolioId", verifyToken, requireRole("admin"), async (req, res) => {
  const { portfolioId } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Supprimer websites/links liés via media
    await client.query(
      'DELETE FROM websites WHERE media_id IN (SELECT id FROM media WHERE portfolio_id = $1)',
      [portfolioId]
    );
    await client.query(
      'DELETE FROM links WHERE media_id IN (SELECT id FROM media WHERE portfolio_id = $1)',
      [portfolioId]
    );

    // Supprimer tables liées directement au portfolio
    await client.query('DELETE FROM media WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM projects WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM experiences WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM education WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM certifications WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM skills WHERE portfolio_id = $1', [portfolioId]);

    // Supprimer le portfolio lui-même
    const result = await client.query(
      'DELETE FROM portfolios WHERE id = $1 RETURNING id',
      [portfolioId]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Portfolio introuvable' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Portfolio supprimé', id: result.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[admin] Error deleting portfolio:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    client.release();
  }
});

export default router;
