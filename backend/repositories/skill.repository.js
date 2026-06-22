import pool from "../config/database.js";

// Couche d'accès aux données : table "skills".

export const findByPortfolioId = async (portfolioId, executor = pool) => {
  const result = await executor.query(
    'SELECT * FROM skills WHERE portfolio_id = $1 ORDER BY created_at DESC',
    [portfolioId]
  );
  return result.rows;
};

export const create = async (portfolioId, skillName, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO skills (portfolio_id, skill_name, created_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [portfolioId, skillName, new Date().toISOString()]
  );
  return result.rows[0];
};

export const updateName = async (id, skillName, executor = pool) => {
  const result = await executor.query(
    `UPDATE skills SET skill_name = $1 WHERE id = $2 RETURNING *`,
    [skillName, id]
  );
  return result.rows[0] || null;
};

export const remove = async (id, executor = pool) => {
  const result = await executor.query('DELETE FROM skills WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
};

export const deleteByPortfolio = async (portfolioId, executor = pool) => {
  await executor.query('DELETE FROM skills WHERE portfolio_id = $1', [portfolioId]);
};
