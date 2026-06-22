import pool from "../config/database.js";

// Couche d'accès aux données : table "activities".

export const findByPortfolioId = async (portfolioId, executor = pool) => {
  const result = await executor.query(
    'SELECT * FROM activities WHERE portfolio_id = $1 ORDER BY created_at DESC LIMIT 50',
    [portfolioId]
  );
  return result.rows;
};

export const create = async (portfolioId, { action, details }, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO activities (id, portfolio_id, action, details, created_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [Date.now(), portfolioId, action, JSON.stringify(details || {}), new Date().toISOString()]
  );
  return result.rows[0];
};
