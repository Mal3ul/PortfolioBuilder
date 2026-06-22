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

// Enregistre la connexion de l'utilisateur et réinitialise un éventuel
// avertissement d'inactivité (le compte est redevenu actif).
export const updateLastLogin = async (id) => {
  await pool.query(
    'UPDATE users SET last_login_at = NOW(), inactivity_warning_sent_at = NULL WHERE id = $1',
    [id]
  );
};

// Comptes inactifs depuis plus de `inactiveDays` jours et pas encore avertis.
// COALESCE(last_login_at, created_at) : pour un compte qui ne s'est jamais
// reconnecté depuis la mise en place du suivi, on se base sur la date de création.
export const findInactiveToWarn = async (inactiveDays) => {
  const result = await pool.query(
    `SELECT id, name, email
       FROM users
      WHERE inactivity_warning_sent_at IS NULL
        AND COALESCE(last_login_at, created_at) < NOW() - ($1::int * INTERVAL '1 day')`,
    [inactiveDays]
  );
  return result.rows;
};

export const markInactivityWarning = async (id) => {
  await pool.query(
    'UPDATE users SET inactivity_warning_sent_at = NOW() WHERE id = $1',
    [id]
  );
};

// Comptes à supprimer : inactifs depuis plus de `inactiveDays` jours ET déjà
// avertis depuis au moins `graceDays` jours (délai de grâce après l'e-mail).
export const findInactiveToDelete = async (inactiveDays, graceDays) => {
  const result = await pool.query(
    `SELECT id, name, email
       FROM users
      WHERE inactivity_warning_sent_at IS NOT NULL
        AND inactivity_warning_sent_at < NOW() - ($2::int * INTERVAL '1 day')
        AND COALESCE(last_login_at, created_at) < NOW() - ($1::int * INTERVAL '1 day')`,
    [inactiveDays, graceDays]
  );
  return result.rows;
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
