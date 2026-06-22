import pool from "../config/database.js";

// Couche d'accès aux données : table "experiences".

export const create = async (portfolioId, experience, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO experiences (portfolio_id, position, company, start_date, end_date, description, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      portfolioId,
      experience.position || '',
      experience.company || '',
      experience.startDate || null,
      experience.endDate || null,
      experience.description || '',
      new Date().toISOString()
    ]
  );
  return result.rows[0];
};

export const deleteByPortfolio = async (portfolioId, executor = pool) => {
  await executor.query('DELETE FROM experiences WHERE portfolio_id = $1', [portfolioId]);
};
