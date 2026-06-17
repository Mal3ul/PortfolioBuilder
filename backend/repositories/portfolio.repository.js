import pool from "../config/database.js";

// Couche d'accès aux données : table "portfolios" et ses relations.
// Chaque fonction accepte un "executor" optionnel (pool par défaut) afin de
// pouvoir participer à une transaction ouverte par la couche service.

export const findByUserId = async (userId, executor = pool) => {
  const result = await executor.query('SELECT * FROM portfolios WHERE user_id = $1', [userId]);
  return result.rows[0] || null;
};

export const findIdByUserId = async (userId, executor = pool) => {
  const result = await executor.query('SELECT id FROM portfolios WHERE user_id = $1', [userId]);
  return result.rows[0]?.id ?? null;
};

export const findById = async (id, executor = pool) => {
  const result = await executor.query('SELECT * FROM portfolios WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Création avec un id explicite (utilisée à l'inscription : id portfolio = id user).
export const createWithId = async ({ id, userId, firstName, lastName, email }, executor = pool) => {
  await executor.query(
    `INSERT INTO portfolios (id, user_id, first_name, last_name, title, bio, email, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, userId, firstName || 'User', lastName || '', '', '', email, new Date().toISOString()]
  );
};

// Crée un portfolio vide s'il n'existe pas encore pour l'utilisateur.
export const ensureExists = async ({ userId, firstName, lastName, email }, executor = pool) => {
  const inserted = await executor.query(
    `INSERT INTO portfolios (user_id, first_name, last_name, title, bio, email, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO NOTHING
     RETURNING *`,
    [userId, firstName, lastName, '', '', email || '', new Date().toISOString()]
  );

  if (inserted.rows[0]) return inserted.rows[0];
  return findByUserId(userId, executor);
};

export const updateProfile = async (id, fields, executor = pool) => {
  const result = await executor.query(
    `UPDATE portfolios
     SET first_name = $1, last_name = $2, title = $3, bio = $4, email = $5, phone = $6, location = $7, updated_at = $8
     WHERE id = $9`,
    [
      fields.firstName,
      fields.lastName,
      fields.title,
      fields.bio,
      fields.email,
      fields.phone,
      fields.location,
      new Date().toISOString(),
      id
    ]
  );
  return result.rowCount;
};

export const upsertProfile = async (userId, profile, executor = pool) => {
  await executor.query(
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
};

// Récupère toutes les relations d'un portfolio (compétences, projets, etc.).
export const findRelations = async (portfolioId, executor = pool) => {
  const [skills, projects, experiences, education, certifications, media] = await Promise.all([
    executor.query('SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolioId]),
    executor.query('SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC', [portfolioId]),
    executor.query('SELECT * FROM experiences WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolioId]),
    executor.query('SELECT * FROM education WHERE portfolio_id = $1 ORDER BY start_date DESC', [portfolioId]),
    executor.query('SELECT * FROM certifications WHERE portfolio_id = $1 ORDER BY date DESC', [portfolioId]),
    executor.query('SELECT * FROM media WHERE portfolio_id = $1', [portfolioId])
  ]);

  let websites = { rows: [] };
  let links = { rows: [] };
  if (media.rows.length > 0) {
    const mediaId = media.rows[0].id;
    [websites, links] = await Promise.all([
      executor.query('SELECT * FROM websites WHERE media_id = $1 ORDER BY created_at DESC', [mediaId]),
      executor.query('SELECT * FROM links WHERE media_id = $1 ORDER BY created_at DESC', [mediaId])
    ]);
  }

  return {
    skills: skills.rows,
    projects: projects.rows,
    experiences: experiences.rows,
    education: education.rows,
    certifications: certifications.rows,
    media: media.rows,
    websites: websites.rows,
    links: links.rows
  };
};

export const findAllWithUser = async () => {
  const result = await pool.query(
    `SELECT
       p.id,
       p.user_id,
       p.first_name,
       p.last_name,
       p.title,
       p.bio,
       p.email AS portfolio_email,
       p.updated_at,
       u.name AS user_name,
       u.email AS user_email
     FROM portfolios p
     LEFT JOIN users u ON u.id = p.user_id
     ORDER BY p.updated_at DESC NULLS LAST, p.id DESC`
  );
  return result.rows;
};

export const updateEmailByUserId = async (userId, email, executor = pool) => {
  await executor.query('UPDATE portfolios SET email = $1 WHERE user_id = $2', [email, userId]);
};

export const deleteByUserId = async (userId, executor = pool) => {
  await executor.query('DELETE FROM portfolios WHERE user_id = $1', [userId]);
};

// Suppression complète d'un portfolio et de toutes ses relations (transaction).
export const deleteWithRelations = async (portfolioId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'DELETE FROM websites WHERE media_id IN (SELECT id FROM media WHERE portfolio_id = $1)',
      [portfolioId]
    );
    await client.query(
      'DELETE FROM links WHERE media_id IN (SELECT id FROM media WHERE portfolio_id = $1)',
      [portfolioId]
    );
    await client.query('DELETE FROM media WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM projects WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM experiences WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM education WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM certifications WHERE portfolio_id = $1', [portfolioId]);
    await client.query('DELETE FROM skills WHERE portfolio_id = $1', [portfolioId]);

    const result = await client.query('DELETE FROM portfolios WHERE id = $1 RETURNING id', [portfolioId]);
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query('COMMIT');
    return result.rows[0].id;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
