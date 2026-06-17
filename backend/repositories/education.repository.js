import pool from "../config/database.js";

// Couche d'accès aux données : table "education".

export const create = async (portfolioId, education, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO education (portfolio_id, diploma, school, start_date, end_date, description, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      portfolioId,
      education.diploma || '',
      education.school || '',
      education.startDate || null,
      education.endDate || null,
      education.description || '',
      new Date().toISOString()
    ]
  );
  return result.rows[0];
};

export const deleteByPortfolio = async (portfolioId, executor = pool) => {
  await executor.query('DELETE FROM education WHERE portfolio_id = $1', [portfolioId]);
};
