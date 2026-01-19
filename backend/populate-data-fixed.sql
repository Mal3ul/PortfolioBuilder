-- Créer des portfolios pour les utilisateurs existants s'ils n'existent pas
INSERT INTO portfolios (id, user_id, first_name, last_name, title, bio, email, phone, location, updated_at)
VALUES 
  (10, 1768675670845, 'Julie', 'Ette', 'Développeuse Full Stack', 'Passionnée par le développement web', 'kidana9934@elafans.com', '+33612345678', 'Paris', CURRENT_TIMESTAMP),
  (11, 1768676410163, 'Kiko', 'Lol', 'Designer UX/UI', 'Créatrice de designs époustouflants', 'g@h', '+33698765432', 'Lyon', CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;

-- Insérer des compétences
INSERT INTO skills (portfolio_id, skill_name, created_at) 
VALUES 
  (10, 'JavaScript', CURRENT_TIMESTAMP),
  (10, 'React', CURRENT_TIMESTAMP),
  (10, 'PostgreSQL', CURRENT_TIMESTAMP),
  (10, 'Node.js', CURRENT_TIMESTAMP),
  (11, 'Figma', CURRENT_TIMESTAMP),
  (11, 'Adobe XD', CURRENT_TIMESTAMP),
  (11, 'UX Design', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insérer des projets
INSERT INTO projects (id, portfolio_id, title, description, technologies, created_at) 
VALUES 
  (1, 10, 'Portfolio Builder', 'Application web pour créer des portfolios', '["React", "Node.js", "PostgreSQL"]', CURRENT_TIMESTAMP),
  (2, 10, 'E-commerce Platform', 'Plateforme de vente en ligne', '["Vue.js", "Laravel", "MySQL"]', CURRENT_TIMESTAMP),
  (3, 11, 'Mobile App Design', 'Conception d''une application mobile', '["Figma", "Prototyping"]', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insérer des expériences
INSERT INTO experiences (id, portfolio_id, company, position, description, start_date, end_date, created_at) 
VALUES 
  (1, 10, 'Tech Corp', 'Développeuse Senior', 'Développement d''applications web', '2022-01-01'::date, NULL, CURRENT_TIMESTAMP),
  (2, 10, 'StartUp XYZ', 'Développeuse Full Stack', 'Création de plateforme SaaS', '2020-06-01'::date, '2021-12-31'::date, CURRENT_TIMESTAMP),
  (3, 11, 'Creative Studio', 'Designer Senior', 'Design d''interfaces utilisateur', '2020-06-15'::date, NULL, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insérer des éducations
INSERT INTO education (id, portfolio_id, school, diploma, description, start_date, end_date, created_at) 
VALUES 
  (1, 10, 'Université Paris Diderot', 'Master Informatique', 'Spécialisation développement web', '2018-09-01'::date, '2020-06-30'::date, CURRENT_TIMESTAMP),
  (2, 11, 'École Nationale des Beaux-Arts', 'Diplôme Design Graphique', 'Arts visuels et design', '2015-09-01'::date, '2019-09-15'::date, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insérer des certifications
INSERT INTO certifications (id, portfolio_id, title, organization, description, date, created_at) 
VALUES 
  (1, 10, 'AWS Certified Developer', 'Amazon Web Services', 'Certification développeur cloud', '2023-03-15'::date, CURRENT_TIMESTAMP),
  (2, 10, 'React Professionnel', 'Udemy', 'Certification React avancée', '2022-11-20'::date, CURRENT_TIMESTAMP),
  (3, 11, 'UX Design Fundamentals', 'Nielsen Norman Group', 'Principes fondamentaux UX', '2021-08-10'::date, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insérer des médias
INSERT INTO media (id, portfolio_id, linkedin, github, twitter, created_at) 
VALUES 
  (1, 10, 'https://linkedin.com/in/julie-ette', 'https://github.com/julieette', 'https://twitter.com/julieette', CURRENT_TIMESTAMP),
  (2, 11, 'https://linkedin.com/in/kiko-lol', NULL, NULL, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insérer des activités
INSERT INTO activities (id, portfolio_id, action, name, timestamp, created_at) 
VALUES 
  (1, 10, 'profile_updated', 'Profil mis à jour', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT, CURRENT_TIMESTAMP),
  (2, 10, 'skill_added', 'Compétence ajoutée', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT, CURRENT_TIMESTAMP),
  (3, 11, 'project_created', 'Projet créé', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Vérifier les portfolios
SELECT 'Portfolios' as "Type", COUNT(*) as "Nombre" FROM portfolios
UNION ALL
SELECT 'Compétences', COUNT(*) FROM skills
UNION ALL
SELECT 'Projets', COUNT(*) FROM projects
UNION ALL
SELECT 'Expériences', COUNT(*) FROM experiences
UNION ALL
SELECT 'Éducation', COUNT(*) FROM education
UNION ALL
SELECT 'Certifications', COUNT(*) FROM certifications;
