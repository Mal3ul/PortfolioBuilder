-- Ajouter des compétences pour test@test.com (portfolio_id = 1768672901622)
INSERT INTO skills (portfolio_id, skill_name, created_at) VALUES
(1768672901622, 'JavaScript', CURRENT_TIMESTAMP),
(1768672901622, 'React', CURRENT_TIMESTAMP),
(1768672901622, 'Node.js', CURRENT_TIMESTAMP),
(1768672901622, 'PostgreSQL', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Ajouter un projet
INSERT INTO projects (id, portfolio_id, title, description, technologies, created_at) VALUES
(5001, 1768672901622, 'Test Project', 'Mon premier projet de portfolio', '["JavaScript", "React"]', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Ajouter une expérience
INSERT INTO experiences (id, portfolio_id, company, position, description, start_date, end_date, created_at) VALUES
(5001, 1768672901622, 'Test Company', 'Développeur Web', 'Expérience de test', '2023-01-01', NULL, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Ajouter une formation
INSERT INTO education (id, portfolio_id, school, diploma, description, start_date, end_date, created_at) VALUES
(5001, 1768672901622, 'École Test', 'Diplôme Test', 'Formation en développement web', '2020-09-01', '2023-06-30', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Ajouter une certification
INSERT INTO certifications (id, portfolio_id, title, organization, description, date, created_at) VALUES
(5001, 1768672901622, 'Certification Test', 'Organisme Test', 'Certification en développement', '2023-06-01', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Vérifier
SELECT 
  (SELECT COUNT(*) FROM skills WHERE portfolio_id = 1768672901622) as skills,
  (SELECT COUNT(*) FROM projects WHERE portfolio_id = 1768672901622) as projects,
  (SELECT COUNT(*) FROM experiences WHERE portfolio_id = 1768672901622) as experiences,
  (SELECT COUNT(*) FROM education WHERE portfolio_id = 1768672901622) as education,
  (SELECT COUNT(*) FROM certifications WHERE portfolio_id = 1768672901622) as certifications,
  (SELECT COUNT(*) FROM activities WHERE portfolio_id = 1768672901622) as activities;
