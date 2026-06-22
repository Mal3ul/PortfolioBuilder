import pool from "../config/database.js";

// Couche d'accès aux données : tables "media" et "websites".

export const findByPortfolioId = async (portfolioId, executor = pool) => {
  const result = await executor.query('SELECT * FROM media WHERE portfolio_id = $1', [portfolioId]);
  return result.rows[0] || null;
};

export const findById = async (id, executor = pool) => {
  const result = await executor.query('SELECT * FROM media WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const create = async (portfolioId, media, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO media (portfolio_id, linkedin, github, twitter, profile_image, cv_file, cv_file_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      portfolioId,
      media.linkedin || '',
      media.github || '',
      media.twitter || '',
      media.profileImage || null,
      media.cvFile || null,
      media.cvFileName || null
    ]
  );
  return result.rows[0];
};

export const update = async (portfolioId, media, executor = pool) => {
  const result = await executor.query(
    `UPDATE media
     SET linkedin = $1, github = $2, twitter = $3, profile_image = $4, cv_file = $5, cv_file_name = $6
     WHERE portfolio_id = $7
     RETURNING *`,
    [
      media.linkedin || '',
      media.github || '',
      media.twitter || '',
      media.profileImage || null,
      media.cvFile || null,
      media.cvFileName || null,
      portfolioId
    ]
  );
  return result.rows[0];
};

export const findWebsites = async (mediaId, executor = pool) => {
  const result = await executor.query('SELECT * FROM websites WHERE media_id = $1', [mediaId]);
  return result.rows;
};

export const replaceWebsites = async (mediaId, urls, executor = pool) => {
  await executor.query('DELETE FROM websites WHERE media_id = $1', [mediaId]);
  for (const url of urls) {
    if (url && url.trim()) {
      await executor.query('INSERT INTO websites (media_id, url) VALUES ($1, $2)', [mediaId, url.trim()]);
    }
  }
};
