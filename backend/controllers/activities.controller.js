import pool from "../config/database.js";

// Get activities
export const getActivities = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
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
  const { userId } = req.params;
  const { action, details } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO activities (user_id, action, details, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, action, JSON.stringify(details || {}), new Date().toISOString()]
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
