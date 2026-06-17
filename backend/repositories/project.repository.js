import pool from "../config/database.js";

// Couche d'accès aux données : table "projects".

export const findByPortfolioId = async (portfolioId, executor = pool) => {
  const result = await executor.query(
    'SELECT * FROM projects WHERE portfolio_id = $1 ORDER BY created_at DESC',
    [portfolioId]
  );
  return result.rows;
};

export const create = async (portfolioId, project, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO projects (portfolio_id, title, description, technologies, github_url, live_url, image_url, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      portfolioId,
      project.title,
      project.description || '',
      JSON.stringify(project.technologies || []),
      project.githubUrl || null,
      project.liveUrl || null,
      project.imageUrl || null,
      new Date().toISOString()
    ]
  );
  return result.rows[0];
};

export const update = async (id, project, executor = pool) => {
  const result = await executor.query(
    `UPDATE projects
     SET title = $1, description = $2, technologies = $3, github_url = $4, live_url = $5, image_url = $6
     WHERE id = $7
     RETURNING *`,
    [
      project.title,
      project.description,
      JSON.stringify(project.technologies),
      project.githubUrl,
      project.liveUrl,
      project.imageUrl,
      id
    ]
  );
  return result.rows[0] || null;
};

export const remove = async (id, executor = pool) => {
  const result = await executor.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
};

export const deleteByPortfolio = async (portfolioId, executor = pool) => {
  await executor.query('DELETE FROM projects WHERE portfolio_id = $1', [portfolioId]);
};
