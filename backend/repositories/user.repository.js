import pool from "../config/database.js";

// Couche d'accès aux données : table "users".
// Aucune logique métier ici, uniquement des requêtes SQL.

export const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const findPasswordById = async (id) => {
  const result = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const findByResetToken = async (token, now) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expiry > $2',
    [token, now]
  );
  return result.rows[0] || null;
};

export const existsByEmail = async (email, excludeId = null) => {
  const result = excludeId
    ? await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, excludeId])
    : await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
};

export const create = async ({ id, name, email, password, role = 'user', createdAt }) => {
  await pool.query(
    `INSERT INTO users (id, name, email, password, role, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, name, email, password, role, createdAt]
  );
};

export const updateRole = async (id, role) => {
  const result = await pool.query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
    [role, id]
  );
  return result.rows[0] || null;
};

export const updateEmail = async (id, email) => {
  await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, id]);
};

export const updateName = async (id, name) => {
  await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);
};

export const updatePassword = async (id, hashedPassword) => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
};

export const setResetToken = async (id, token, expiry) => {
  await pool.query(
    'UPDATE users SET reset_password_token = $1, reset_password_expiry = $2 WHERE id = $3',
    [token, expiry, id]
  );
};

export const updatePasswordAndClearReset = async (id, hashedPassword) => {
  await pool.query(
    'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiry = NULL WHERE id = $2',
    [hashedPassword, id]
  );
};

export const findAll = async () => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

export const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
    [id]
  );
  return result.rows[0] || null;
};
