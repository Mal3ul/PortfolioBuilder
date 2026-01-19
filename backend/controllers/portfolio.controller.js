import pool from "../config/database.js";

// Get user portfolio with all relations
export const getUserPortfolio = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Récupérer l'utilisateur
    const userResult = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    
    const user = userResult.rows[0];
    
    // Récupérer le portfolio
    const portfolioResult = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    const portfolio = portfolioResult.rows[0];
    
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    // Récupérer tous les éléments associés en parallèle
    const [skills, projects, experiences, education, certifications, websites, links, media] = await Promise.all([
      pool.query('SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM experiences WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolio.id]),
      pool.query('SELECT * FROM education WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolio.id]),
      pool.query('SELECT * FROM certifications WHERE portfolio_id = $1 ORDER BY date DESC', [portfolio.id]),
      pool.query('SELECT * FROM websites WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM links WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM media WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id])
    ]);
    
    res.json({
      profile: {
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        title: portfolio.title || '',
        bio: portfolio.description || '',
        email: user.email,
        avatarUrl: portfolio.avatar_url
      },
      skills: skills.rows,
      projects: projects.rows.map(p => ({
        ...p,
        technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
      })),
      experiences: experiences.rows,
      education: education.rows,
      certifications: certifications.rows,
      websites: websites.rows,
      links: links.rows,
      media: media.rows
    });
  } catch (error) {
    console.error('[portfolio] getUserPortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update portfolio profile
export const updatePortfolio = async (req, res) => {
  const { userId } = req.params;
  const { title, description, tagline, avatarUrl } = req.body;
  
  try {
    await pool.query(
      `UPDATE portfolios
       SET title = $1, description = $2, tagline = $3, avatar_url = $4, updated_at = $5
       WHERE user_id = $6`,
      [title, description, tagline, avatarUrl, new Date().toISOString(), userId]
    );
    
    res.json({ message: "Portfolio mis à jour" });
  } catch (error) {
    console.error('[portfolio] updatePortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { getUserPortfolio, updatePortfolio };
