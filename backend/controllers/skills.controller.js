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

// Update all skills for current user
export const updateAllSkills = async (req, res) => {
  const userId = req.user?.id;
  const { skills } = req.body;
  
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  
  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: "Skills doit être un array" });
  }
  
  try {
    // Récupérer le portfolio_id
    const portfolioResult = await pool.query(
      'SELECT id FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    if (portfolioResult.rows.length === 0) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    const portfolioId = portfolioResult.rows[0].id;
    
    // Supprimer toutes les compétences existantes
    await pool.query(
      'DELETE FROM skills WHERE portfolio_id = $1',
      [portfolioId]
    );
    
    // Ajouter les nouvelles compétences
    for (const skillName of skills) {
      await pool.query(
        `INSERT INTO skills (portfolio_id, skill_name, created_at)
         VALUES ($1, $2, $3)`,
        [portfolioId, skillName, new Date().toISOString()]
      );
    }
    
    // Retourner les compétences
    const result = await pool.query(
      'SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC',
      [portfolioId]
    );
    
    res.json({
      skills: result.rows.map(s => s.skill_name)
    });
  } catch (error) {
    console.error('[skills] updateAllSkills error:', error);
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

export default { getSkills, addSkill, updateSkill, updateAllSkills, deleteSkill };
