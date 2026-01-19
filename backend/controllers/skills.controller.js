import pool from "../config/database.js";

// Get skills
export const getSkills = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const portfolioResult = await pool.query(
      'SELECT id FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    if (portfolioResult.rows.length === 0) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    const portfolioId = portfolioResult.rows[0].id;
    
    const result = await pool.query(
      'SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC',
      [portfolioId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('[skills] getSkills error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Add skill
export const addSkill = async (req, res) => {
  const { userId } = req.params;
  const { name, level, category } = req.body;
  
  try {
    const portfolioResult = await pool.query(
      'SELECT id FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    if (portfolioResult.rows.length === 0) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    const portfolioId = portfolioResult.rows[0].id;
    
    const result = await pool.query(
      `INSERT INTO skills (portfolio_id, skill_name, created_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [portfolioId, name, new Date().toISOString()]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('[skills] addSkill error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update skill
export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, level, category } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE skills
       SET skill_name = $1
       WHERE id = $2
       RETURNING *`,
      [name, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Compétence introuvable" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('[skills] updateSkill error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Compétence introuvable" });
    }
    
    res.json({ message: "Compétence supprimée" });
  } catch (error) {
    console.error('[skills] deleteSkill error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { getSkills, addSkill, updateSkill, deleteSkill };
