import pool from "../config/database.js";

// Couche d'accès aux données : table "certifications".

export const create = async (portfolioId, certification, executor = pool) => {
  const result = await executor.query(
    `INSERT INTO certifications (portfolio_id, title, organization, date, description, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      portfolioId,
      certification.title || '',
      certification.organization || certification.issuer || '',
      certification.date || null,
      certification.description || '',
      new Date().toISOString()
    ]
  );
  return result.rows[0];
};

export const deleteByPortfolio = async (portfolioId, executor = pool) => {
  await executor.query('DELETE FROM certifications WHERE portfolio_id = $1', [portfolioId]);
};
