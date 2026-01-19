import pool from "../config/database.js";

// Get activities
export const getActivities = async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  
  try {
    // Récupérer le portfolio_id depuis user_id
    const portfolioResult = await pool.query(
      'SELECT id FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    if (portfolioResult.rows.length === 0) {
      return res.json([]);
    }
    
    const portfolioId = portfolioResult.rows[0].id;
    
    const result = await pool.query(
      'SELECT * FROM activities WHERE portfolio_id = $1 ORDER BY created_at DESC LIMIT 50',
      [portfolioId]
    );
    
    res.json(result.rows.map(a => ({
      ...a,
      details: typeof a.details === 'string' ? JSON.parse(a.details) : a.details
    })));
  } catch (error) {
    console.error('[activities] getActivities error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Add activity
export const addActivity = async (req, res) => {
  const userId = req.user?.id;
  const { action, details } = req.body;
  
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  
  try {
    // Récupérer le portfolio_id depuis user_id
    const portfolioResult = await pool.query(
      'SELECT id FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    if (portfolioResult.rows.length === 0) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    const portfolioId = portfolioResult.rows[0].id;
    
    const result = await pool.query(
      `INSERT INTO activities (id, portfolio_id, action, details, created_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [Date.now(), portfolioId, action, JSON.stringify(details || {}), new Date().toISOString()]
    );
    
    const activity = result.rows[0];
    activity.details = JSON.parse(activity.details);
    
    res.status(201).json(activity);
  } catch (error) {
    console.error('[activities] addActivity error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { getActivities, addActivity };
