-- Ajouter des données aux portfolios existants
UPDATE portfolios SET 
  first_name = 'Julie',
  last_name = 'Ette',
  title = 'Développeuse Full Stack',
  bio = 'Passionnée par le développement web et les technologies modernes',
  email = 'kidana9934@elafans.com',
  phone = '+33612345678',
  location = 'Paris, France'
WHERE user_id = 1768675670845;

UPDATE portfolios SET 
  first_name = 'Kiko',
  last_name = 'Lol',
  title = 'Designer UX/UI',
  bio = 'Créatrice de designs époustouflants',
  email = 'g@h',
  phone = '+33698765432',
  location = 'Lyon, France'
WHERE user_id = 1768676410163;

-- Insérer des compétences
INSERT INTO skills (portfolio_id, skill_name, created_at) 
SELECT id, 'JavaScript', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845
UNION ALL
SELECT id, 'React', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845
UNION ALL
SELECT id, 'PostgreSQL', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845
UNION ALL
SELECT id, 'Figma', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768676410163
UNION ALL
SELECT id, 'Adobe XD', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768676410163;

-- Insérer des projets
INSERT INTO projects (portfolio_id, title, description, technologies, link, created_at)
SELECT id, 'Portfolio Builder', 'Application web pour créer des portfolios', '["React", "Node.js", "PostgreSQL"]', 'https://github.com', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845
UNION ALL
SELECT id, 'E-commerce Platform', 'Plateforme de vente en ligne', '["Vue.js", "Laravel", "MySQL"]', 'https://github.com', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845;

-- Insérer des expériences
INSERT INTO experiences (portfolio_id, company, position, description, start_date, end_date, created_at)
SELECT id, 'Tech Corp', 'Développeuse Senior', 'Développement d''applications web', '2022-01-01'::date, NULL, CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845
UNION ALL
SELECT id, 'Creative Studio', 'Designer Senior', 'Design d''interfaces utilisateur', '2020-06-15'::date, NULL, CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768676410163;

-- Insérer des éducations
INSERT INTO education (portfolio_id, school, degree, field, graduation_date, created_at)
SELECT id, 'Université Paris Diderot', 'Master', 'Informatique', '2020-06-30'::date, CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845
UNION ALL
SELECT id, 'École Nationale des Beaux-Arts', 'Diplôme', 'Design Graphique', '2019-09-15'::date, CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768676410163;

-- Insérer des certifications
INSERT INTO certifications (portfolio_id, title, issuer, date, credential_url, created_at)
SELECT id, 'AWS Certified Developer', 'Amazon Web Services', '2023-03-15'::date, 'https://aws.amazon.com', CURRENT_TIMESTAMP FROM portfolios WHERE user_id = 1768675670845;
