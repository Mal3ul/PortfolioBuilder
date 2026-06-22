-- Migration : suivi de l'inactivité des comptes (politique de conservation 90 jours)
-- À exécuter une seule fois sur les bases déjà initialisées (le schema.sql à jour
-- contient déjà ces colonnes pour les nouvelles installations).
--
-- Application :
--   docker exec -i pb-database psql -U pb_user -d portfolio_builder < backend/migrations/001_add_inactivity_columns.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS inactivity_warning_sent_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);

-- Initialise last_login_at sur les comptes existants pour ne pas les considérer
-- immédiatement comme inactifs (on part de leur date de création).
UPDATE users SET last_login_at = created_at WHERE last_login_at IS NULL;
