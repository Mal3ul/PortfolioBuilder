import pool from "../config/database.js";

// Get projects
export const getProjects = async (req, res) => {
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
      'SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC',
      [portfolioId]
    );
    
    res.json(result.rows.map(p => ({
      ...p,
      technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
    })));
  } catch (error) {
    console.error('[projects] getProjects error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Add project
export const addProject = async (req, res) => {
  const { userId } = req.params;
  const { title, description, technologies, githubUrl, liveUrl, imageUrl } = req.body;
  
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
      `INSERT INTO projects (portfolio_id, title, description, technologies, github_url, live_url, image_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        portfolioId,
        title,
        description || '',
        JSON.stringify(technologies || []),
        githubUrl || null,
        liveUrl || null,
        imageUrl || null,
        new Date().toISOString()
      ]
    );
    
    const project = result.rows[0];
    project.technologies = JSON.parse(project.technologies);
    
    res.status(201).json(project);
  } catch (error) {
    console.error('[projects] addProject error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update project
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, technologies, githubUrl, liveUrl, imageUrl } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE projects
       SET title = $1, description = $2, technologies = $3, github_url = $4, live_url = $5, image_url = $6
       WHERE id = $7
       RETURNING *`,
      [title, description, JSON.stringify(technologies), githubUrl, liveUrl, imageUrl, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet introuvable" });
    }
    
    const project = result.rows[0];
    project.technologies = JSON.parse(project.technologies);
    
    res.json(project);
  } catch (error) {
    console.error('[projects] updateProject error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet introuvable" });
    }
    
    res.json({ message: "Projet supprimé" });
  } catch (error) {
    console.error('[projects] deleteProject error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { getProjects, addProject, updateProject, deleteProject };
