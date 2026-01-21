import pool from "../config/database.js";
import crypto from "crypto";

// Helper pour capitaliser la première lettre
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Crée un portfolio vide si absent pour l'utilisateur donné
const ensurePortfolioExists = async ({ userId, email, name }) => {
  if (!userId) return null;

  const [firstName = "", ...rest] = (name || "").trim().split(" ");
  const lastName = rest.join(" ").trim();

  const insertQuery = `
    INSERT INTO portfolios (user_id, first_name, last_name, title, bio, email, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING *;
  `;

  const nowIso = new Date().toISOString();

  const inserted = await pool.query(insertQuery, [
    userId,
    firstName || "User",
    lastName || "",
    "",
    "",
    email || "",
    nowIso
  ]);

  if (inserted.rows[0]) return inserted.rows[0];

  const existing = await pool.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
  return existing.rows[0] || null;
};

// Get current user's portfolio
export const getPortfolio = async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  
  try {
    // Récupérer le portfolio
    const portfolioResult = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    let portfolio = portfolioResult.rows[0];
    
    if (!portfolio) {
      const created = await ensurePortfolioExists({ userId, email: '', name: '' });
      if (!created) {
        return res.status(404).json({ message: "Portfolio introuvable" });
      }
      portfolio = created;
    }
    
    // Récupérer tous les éléments associés en parallèle
    const [skills, projects, experiences, education, certifications, media] = await Promise.all([
      pool.query('SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM experiences WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolio.id]),
      pool.query('SELECT * FROM education WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolio.id]),
      pool.query('SELECT * FROM certifications WHERE portfolio_id = $1 ORDER BY date DESC', [portfolio.id]),
      pool.query('SELECT * FROM media WHERE portfolio_id = $1', [portfolio.id])
    ]);
    
    // Récupérer websites et links si media existe
    let websites = { rows: [] };
    let links = { rows: [] };
    if (media.rows.length > 0) {
      const mediaId = media.rows[0].id;
      [websites, links] = await Promise.all([
        pool.query('SELECT * FROM websites WHERE media_id = $1 ORDER BY created_at DESC', [mediaId]),
        pool.query('SELECT * FROM links WHERE media_id = $1 ORDER BY created_at DESC', [mediaId])
      ]);
    }
    
    res.json({
      profile: {
        firstName: portfolio.first_name || '',
        lastName: portfolio.last_name || '',
        title: portfolio.title || '',
        bio: portfolio.bio || '',
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        location: portfolio.location || ''
      },
      skills: skills.rows.map(s => s.skill_name),
      projects: projects.rows.map(p => ({
        ...p,
        technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
      })),
      experiences: experiences.rows,
      education: education.rows,
      certifications: certifications.rows,
      media: {
        linkedin: media.rows[0]?.linkedin || '',
        github: media.rows[0]?.github || '',
        twitter: media.rows[0]?.twitter || '',
        profile_image: media.rows[0]?.profile_image || '',
        profileImage: media.rows[0]?.profile_image || '',
        cvFile: media.rows[0]?.cv_file || '',
        cvFileName: media.rows[0]?.cv_file_name || '',
        websites: websites.rows.map(w => w.url || ''),
        links: links.rows.map(l => l.url || '')
      }
    });
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
    
    // Récupérer le portfolio (ou le créer s'il manque)
    let portfolioResult = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    let portfolio = portfolioResult.rows[0];
    
    if (!portfolio) {
      portfolio = await ensurePortfolioExists({ userId, email: user.email, name: user.name });
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio introuvable" });
      }
    }
    
    // Récupérer tous les éléments associés en parallèle
    const [skills, projects, experiences, education, certifications, media] = await Promise.all([
      pool.query('SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolio.id]),
      pool.query('SELECT * FROM experiences WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolio.id]),
      pool.query('SELECT * FROM education WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolio.id]),
      pool.query('SELECT * FROM certifications WHERE portfolio_id = $1 ORDER BY date DESC', [portfolio.id]),
      pool.query('SELECT * FROM media WHERE portfolio_id = $1', [portfolio.id])
    ]);
    
    // Récupérer websites et links si media existe
    let websites = { rows: [] };
    let links = { rows: [] };
    if (media.rows.length > 0) {
      const mediaId = media.rows[0].id;
      [websites, links] = await Promise.all([
        pool.query('SELECT * FROM websites WHERE media_id = $1 ORDER BY created_at DESC', [mediaId]),
        pool.query('SELECT * FROM links WHERE media_id = $1 ORDER BY created_at DESC', [mediaId])
      ]);
    }
    
    res.json({
      profile: {
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        title: portfolio.title || '',
        bio: portfolio.bio || '',
        email: user.email,
        phone: portfolio.phone || '',
        location: portfolio.location || ''
      },
      skills: skills.rows.map(s => s.skill_name),
      projects: projects.rows.map(p => ({
        ...p,
        technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
      })),
      experiences: experiences.rows,
      education: education.rows,
      certifications: certifications.rows,
      media: {
        linkedin: media.rows[0]?.linkedin || '',
        github: media.rows[0]?.github || '',
        twitter: media.rows[0]?.twitter || '',
        profile_image: media.rows[0]?.profile_image || '',
        profileImage: media.rows[0]?.profile_image || '',
        cvFile: media.rows[0]?.cv_file || '',
        cvFileName: media.rows[0]?.cv_file_name || '',
        websites: websites.rows.map(w => w.url || ''),
        links: links.rows.map(l => l.url || '')
      }
    });
  } catch (error) {
    console.error('[portfolio] getUserPortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update portfolio profile
export const updatePortfolio = async (req, res) => {
  const userId = req.user?.id;
  const { firstName, lastName, title, bio, email, phone, location, projects, experiences, education, certifications } = req.body;
  
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Récupérer ou créer le portfolio
      let portfolioRes = await client.query(
        'SELECT * FROM portfolios WHERE user_id = $1',
        [userId]
      );
      let portfolioRow = portfolioRes.rows[0];
      if (!portfolioRow) {
        portfolioRow = await ensurePortfolioExists({ userId, email: '', name: '' });
      }
      if (!portfolioRow) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: "Portfolio introuvable" });
      }

      const portfolioId = portfolioRow.id;

      // Mise à jour du profil si fourni
      if (firstName !== undefined || lastName !== undefined || title !== undefined || bio !== undefined || email !== undefined || phone !== undefined || location !== undefined) {
        const updatedFirstName = capitalize(firstName !== undefined ? firstName : portfolioRow.first_name);
        const updatedLastName = capitalize(lastName !== undefined ? lastName : portfolioRow.last_name);
        
        // Mettre à jour le portfolio
        await client.query(
          `UPDATE portfolios
           SET first_name = $1, last_name = $2, title = $3, bio = $4, email = $5, phone = $6, location = $7, updated_at = $8
           WHERE user_id = $9`,
          [
            updatedFirstName,
            updatedLastName,
            title !== undefined ? title : portfolioRow.title,
            bio !== undefined ? bio : portfolioRow.bio,
            email !== undefined ? email : portfolioRow.email,
            phone !== undefined ? phone : portfolioRow.phone,
            location !== undefined ? location : portfolioRow.location,
            new Date().toISOString(),
            userId
          ]
        );
        
        // Mettre à jour aussi la table users avec le nouveau nom
        if (firstName !== undefined || lastName !== undefined) {
          const fullName = `${updatedFirstName} ${updatedLastName}`.trim();
          await client.query(
            'UPDATE users SET name = $1 WHERE id = $2',
            [fullName, userId]
          );
        }
      }

      // Projets (remplacement complet si fourni)
      if (Array.isArray(projects)) {
        await client.query('DELETE FROM projects WHERE portfolio_id = $1', [portfolioId]);
        for (let i = 0; i < projects.length; i++) {
          const p = projects[i];
          await client.query(
            `INSERT INTO projects (portfolio_id, title, description, technologies, github_url, live_url, image_url, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              portfolioId,
              capitalize(p.title || ''),
              p.description || '',
              JSON.stringify(p.technologies || []),
              p.githubUrl || null,
              p.liveUrl || null,
              p.imageUrl || null,
              new Date().toISOString()
            ]
          );
        }
      }

      // Expériences (remplacement complet si fourni)
      if (Array.isArray(experiences)) {
        await client.query('DELETE FROM experiences WHERE portfolio_id = $1', [portfolioId]);
        for (let i = 0; i < experiences.length; i++) {
          const exp = experiences[i];
          await client.query(
            `INSERT INTO experiences (portfolio_id, position, company, start_date, end_date, description, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              portfolioId,
              capitalize(exp.position || ''),
              capitalize(exp.company || ''),
              exp.startDate || null,
              exp.endDate || null,
              exp.description || '',
              new Date().toISOString()
            ]
          );
        }
      }

      // Formations (remplacement complet si fourni)
      if (Array.isArray(education)) {
        await client.query('DELETE FROM education WHERE portfolio_id = $1', [portfolioId]);
        for (let i = 0; i < education.length; i++) {
          const edu = education[i];
          await client.query(
            `INSERT INTO education (portfolio_id, diploma, school, start_date, end_date, description, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              portfolioId,
              edu.diploma || '',
              edu.school || '',
              edu.startDate || null,
              edu.endDate || null,
              edu.description || '',
              new Date().toISOString()
            ]
          );
        }
      }

      // Certifications (remplacement complet si fourni)
      if (Array.isArray(certifications)) {
        await client.query('DELETE FROM certifications WHERE portfolio_id = $1', [portfolioId]);
        for (let i = 0; i < certifications.length; i++) {
          const cert = certifications[i];
          await client.query(
            `INSERT INTO certifications (portfolio_id, title, organization, date, description, created_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              portfolioId,
              cert.title || '',
              cert.organization || cert.issuer || '',
              cert.date || null,
              cert.description || '',
              new Date().toISOString()
            ]
          );
        }
      }

      await client.query('COMMIT');

      // Retourner les données mises à jour
      const [portfolioFinalRes, skillsRes, projectsRes, experiencesRes, educationRes, certificationsRes] = await Promise.all([
        client.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]),
        client.query('SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolioId]),
        client.query('SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolioId]),
        client.query('SELECT * FROM experiences WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolioId]),
        client.query('SELECT * FROM education WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolioId]),
        client.query('SELECT * FROM certifications WHERE portfolio_id = $1 ORDER BY date DESC', [portfolioId])
      ]);

      const portfolioFinal = portfolioFinalRes.rows[0] || portfolioRow;

      res.json({
        message: "Portfolio mis à jour",
        profile: {
          firstName: portfolioFinal?.first_name || '',
          lastName: portfolioFinal?.last_name || '',
          title: portfolioFinal?.title || '',
          bio: portfolioFinal?.bio || '',
          email: portfolioFinal?.email || '',
          phone: portfolioFinal?.phone || '',
          location: portfolioFinal?.location || ''
        },
        projects: projectsRes.rows.map(p => ({
          ...p,
          technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
        })),
        experiences: experiencesRes.rows,
        education: educationRes.rows,
        certifications: certificationsRes.rows,
      });
    } catch (err) {
      try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
      console.error('[portfolio] updatePortfolio error:', err);
      return res.status(500).json({ message: "Erreur serveur" });
    } finally {
      // Release dans tous les cas
      // client.release est sécurisé même si déjà release
      // (mais on le garde pour propreté)
      try { client.release(); } catch (e) { /* ignore */ }
    }
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
    
    res.json({ message: "Portfolio sauvegardé" });
  } catch (error) {
    console.error('[portfolio] savePortfolio error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default { getPortfolio, getUserPortfolio, updatePortfolio, savePortfolio };
