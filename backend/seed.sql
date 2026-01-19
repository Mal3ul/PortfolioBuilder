-- Insérer les utilisateurs de base
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1768672901622, 'Admin User', 'admin@test.com', 'admin123', 'admin', CURRENT_TIMESTAMP),
(1768673000000, 'Jean Test', 'jean@test.com', 'password123', 'user', CURRENT_TIMESTAMP),
(1768673100000, 'Test User', 'test@test.com', 'Test1234!', 'user', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Créer les portfolios correspondants
INSERT INTO portfolios (id, user_id, title, bio, updated_at) VALUES
(1, 1768672901622, 'Admin Portfolio', 'Administrateur du système', CURRENT_TIMESTAMP),
(2, 1768673000000, 'Jean Portfolio', '', CURRENT_TIMESTAMP),
(3, 1768673100000, 'Test Portfolio', '', CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;
