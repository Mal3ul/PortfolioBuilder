import pool from "../config/database.js";

// Get current user's portfolio
export const getPortfolio = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const portfolioResult = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    const portfolio = portfolioResult.rows[0];
    
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('[portfolio] getPortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

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
        bio: portfolio.bio || '',
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
  const { firstName, lastName, title, bio, email, phone, location } = req.body;
  
  try {
    await pool.query(
      `UPDATE portfolios
       SET first_name = $1, last_name = $2, title = $3, bio = $4, email = $5, phone = $6, location = $7, updated_at = $8
       WHERE user_id = $9`,
      [firstName, lastName, title, bio, email, phone, location, new Date().toISOString(), userId]
    );
    
    res.json({ message: "Portfolio mis à jour" });
  } catch (error) {
    console.error('[portfolio] updatePortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Save/Create portfolio (alias for updatePortfolio)
export const savePortfolio = async (req, res) => {
  const { userId, profile } = req.body;
  
  try {
    // Upsert portfolio
    await pool.query(
      `INSERT INTO portfolios (user_id, first_name, last_name, title, bio, email, phone, location, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) DO UPDATE
       SET first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           title = EXCLUDED.title,
           bio = EXCLUDED.bio,
           email = EXCLUDED.email,
           phone = EXCLUDED.phone,
           location = EXCLUDED.location,
           updated_at = EXCLUDED.updated_at`,
      [
        userId,
        profile?.firstName || '',
        profile?.lastName || '',
        profile?.title || '',
        profile?.bio || '',
        profile?.email || '',
        profile?.phone || '',
        profile?.location || '',
        new Date().toISOString()
      ]
    );
      `INSERT INTO portfolios (user_id, title, description, tagline, avatar_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         tagline = EXCLUDED.tagline,
         avatar_url = EXCLUDED.avatar_url,
         updated_at = EXCLUDED.updated_at`,
      [
        userId,
        profile?.title || '',
        profile?.bio || '',
        profile?.tagline || '',
        profile?.avatarUrl || null,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    
    res.json({ message: "Portfolio sauvegardé" });
  } catch (error) {
    console.error('[portfolio] savePortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { getPortfolio, getUserPortfolio, updatePortfolio, savePortfolio };
