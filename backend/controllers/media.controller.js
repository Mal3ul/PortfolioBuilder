import pool from "../config/database.js";

// Update or create media for user's portfolio
export const updateMedia = async (req, res) => {
  const userId = req.user?.id;
  const { linkedin, github, twitter, websites, profileImage, cvFile, cvFileName } = req.body.media || req.body;
  
  console.log('[media] updateMedia called for user:', userId);
  
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  
  try {
    // Récupérer le portfolio
    const portfolioResult = await pool.query(
      'SELECT id FROM portfolios WHERE user_id = $1',
      [userId]
    );
    
    if (portfolioResult.rows.length === 0) {
      console.log('[media] Portfolio not found for user:', userId);
      return res.status(404).json({ message: "Portfolio introuvable" });
    }
    
    const portfolioId = portfolioResult.rows[0].id;
    console.log('[media] Found portfolio:', portfolioId);
    
    // Vérifier si media existe déjà
    const existingMedia = await pool.query(
      'SELECT * FROM media WHERE portfolio_id = $1',
      [portfolioId]
    );
    
    let mediaId;
    
    if (existingMedia.rows.length > 0) {
      // Update existing media
      console.log('[media] Updating existing media');
      const result = await pool.query(
        `UPDATE media
         SET linkedin = $1, github = $2, twitter = $3, profile_image = $4, cv_file = $5, cv_file_name = $6
         WHERE portfolio_id = $7
         RETURNING *`,
        [linkedin || '', github || '', twitter || '', profileImage || null, cvFile || null, cvFileName || null, portfolioId]
      );
      console.log('[media] Media updated successfully');
      mediaId = result.rows[0].id;
    } else {
      // Create new media
      console.log('[media] Creating new media');
      const result = await pool.query(
        `INSERT INTO media (portfolio_id, linkedin, github, twitter, profile_image, cv_file, cv_file_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [portfolioId, linkedin || '', github || '', twitter || '', profileImage || null, cvFile || null, cvFileName || null]
      );
      console.log('[media] Media created successfully');
      mediaId = result.rows[0].id;
    }
    
    // Update websites
    if (websites && Array.isArray(websites)) {
      // Delete existing websites
      await pool.query('DELETE FROM websites WHERE media_id = $1', [mediaId]);
      
      // Insert new websites
      for (const url of websites) {
        if (url && url.trim()) {
          await pool.query(
            'INSERT INTO websites (media_id, url) VALUES ($1, $2)',
            [mediaId, url.trim()]
          );
        }
      }
    }
    
    // Fetch updated data
    const [updatedMedia, websitesResult] = await Promise.all([
      pool.query('SELECT * FROM media WHERE id = $1', [mediaId]),
      pool.query('SELECT * FROM websites WHERE media_id = $1', [mediaId])
    ]);
    
    res.json({
      media: {
        linkedin: updatedMedia.rows[0].linkedin || '',
        github: updatedMedia.rows[0].github || '',
        twitter: updatedMedia.rows[0].twitter || '',
        profileImage: updatedMedia.rows[0].profile_image || '',
        cvFile: updatedMedia.rows[0].cv_file || '',
        cvFileName: updatedMedia.rows[0].cv_file_name || '',
        websites: websitesResult.rows.map(w => w.url),
        links: [] // Pour compatibilité
      }
    });
  } catch (error) {
    console.error('[media] updateMedia error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export default { updateMedia };
