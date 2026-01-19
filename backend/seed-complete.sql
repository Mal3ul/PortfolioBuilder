-- Script complet de seed avec toutes les relations
-- Nettoyer les données existantes (optionnel - commenter si vous voulez garder)
-- TRUNCATE activities, links, websites, media, certifications, education, experiences, projects, skills, portfolios, users CASCADE;

-- ===== UTILISATEURS =====
INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES
(1001, 'Alice Dubois', 'alice.dubois@example.com', '$2a$10$YourHashedPassword1', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1002, 'Bob Martin', 'bob.martin@example.com', '$2a$10$YourHashedPassword2', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1003, 'Claire Leroy', 'claire.leroy@example.com', '$2a$10$YourHashedPassword3', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1004, 'David Chen', 'david.chen@example.com', '$2a$10$YourHashedPassword4', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- ===== PORTFOLIOS =====
INSERT INTO portfolios (id, user_id, first_name, last_name, title, bio, email, phone, location, updated_at) VALUES
(101, 1001, 'Alice', 'Dubois', 'Développeuse Full Stack Senior', 'Passionnée par les technologies web modernes avec 5 ans d''expérience. Spécialisée en React, Node.js et PostgreSQL. J''aime créer des applications performantes et intuitives.', 'alice.dubois@example.com', '+33 6 12 34 56 78', 'Paris, France', CURRENT_TIMESTAMP),
(102, 1002, 'Bob', 'Martin', 'Ingénieur DevOps', 'Expert en infrastructure cloud et automatisation. Certifié AWS et Kubernetes. Passion pour l''optimisation des processus de déploiement continu.', 'bob.martin@example.com', '+33 6 23 45 67 89', 'Lyon, France', CURRENT_TIMESTAMP),
(103, 1003, 'Claire', 'Leroy', 'Lead Designer UX/UI', 'Designer créative avec un œil pour les détails. Expérience en recherche utilisateur, prototypage et design systems. Adepte du design thinking.', 'claire.leroy@example.com', '+33 6 34 56 78 90', 'Bordeaux, France', CURRENT_TIMESTAMP),
(104, 1004, 'David', 'Chen', 'Data Scientist', 'Spécialiste en machine learning et analyse de données. Expert Python, TensorFlow et visualisation de données. Doctorat en informatique.', 'david.chen@example.com', '+33 6 45 67 89 01', 'Toulouse, France', CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;

-- ===== COMPÉTENCES =====
INSERT INTO skills (portfolio_id, skill_name, created_at) VALUES
-- Alice (Full Stack)
(101, 'JavaScript', CURRENT_TIMESTAMP),
(101, 'TypeScript', CURRENT_TIMESTAMP),
(101, 'React', CURRENT_TIMESTAMP),
(101, 'Node.js', CURRENT_TIMESTAMP),
(101, 'Express', CURRENT_TIMESTAMP),
(101, 'PostgreSQL', CURRENT_TIMESTAMP),
(101, 'MongoDB', CURRENT_TIMESTAMP),
(101, 'Git', CURRENT_TIMESTAMP),
(101, 'Docker', CURRENT_TIMESTAMP),
(101, 'REST API', CURRENT_TIMESTAMP),
-- Bob (DevOps)
(102, 'AWS', CURRENT_TIMESTAMP),
(102, 'Kubernetes', CURRENT_TIMESTAMP),
(102, 'Docker', CURRENT_TIMESTAMP),
(102, 'Jenkins', CURRENT_TIMESTAMP),
(102, 'Terraform', CURRENT_TIMESTAMP),
(102, 'Ansible', CURRENT_TIMESTAMP),
(102, 'Linux', CURRENT_TIMESTAMP),
(102, 'Python', CURRENT_TIMESTAMP),
(102, 'CI/CD', CURRENT_TIMESTAMP),
(102, 'Monitoring', CURRENT_TIMESTAMP),
-- Claire (UX/UI)
(103, 'Figma', CURRENT_TIMESTAMP),
(103, 'Adobe XD', CURRENT_TIMESTAMP),
(103, 'Sketch', CURRENT_TIMESTAMP),
(103, 'Prototyping', CURRENT_TIMESTAMP),
(103, 'User Research', CURRENT_TIMESTAMP),
(103, 'Wireframing', CURRENT_TIMESTAMP),
(103, 'Design Systems', CURRENT_TIMESTAMP),
(103, 'HTML/CSS', CURRENT_TIMESTAMP),
(103, 'Illustration', CURRENT_TIMESTAMP),
-- David (Data Science)
(104, 'Python', CURRENT_TIMESTAMP),
(104, 'TensorFlow', CURRENT_TIMESTAMP),
(104, 'PyTorch', CURRENT_TIMESTAMP),
(104, 'Scikit-learn', CURRENT_TIMESTAMP),
(104, 'Pandas', CURRENT_TIMESTAMP),
(104, 'NumPy', CURRENT_TIMESTAMP),
(104, 'SQL', CURRENT_TIMESTAMP),
(104, 'Machine Learning', CURRENT_TIMESTAMP),
(104, 'Deep Learning', CURRENT_TIMESTAMP),
(104, 'Data Visualization', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== PROJETS =====
INSERT INTO projects (id, portfolio_id, title, description, technologies, created_at) VALUES
-- Alice
(201, 101, 'E-commerce Platform', 'Plateforme complète de vente en ligne avec panier, paiement Stripe et gestion des stocks en temps réel. Plus de 10 000 utilisateurs actifs.', '["React", "Node.js", "PostgreSQL", "Redis", "Stripe API"]', CURRENT_TIMESTAMP),
(202, 101, 'Task Management App', 'Application de gestion de tâches collaborative style Trello avec drag-and-drop, notifications en temps réel et intégrations multiples.', '["React", "TypeScript", "Socket.io", "MongoDB", "Express"]', CURRENT_TIMESTAMP),
(203, 101, 'Portfolio Builder', 'Application permettant de créer et personnaliser des portfolios professionnels avec templates, éditeur visuel et export.', '["React", "Node.js", "PostgreSQL", "Vite"]', CURRENT_TIMESTAMP),
-- Bob
(204, 102, 'Cloud Infrastructure Automation', 'Infrastructure as Code pour déploiement automatisé d''applications sur AWS avec haute disponibilité et auto-scaling.', '["Terraform", "AWS", "Docker", "Kubernetes", "Ansible"]', CURRENT_TIMESTAMP),
(205, 102, 'CI/CD Pipeline System', 'Système de déploiement continu automatisé avec tests, scans de sécurité et rollback automatique en cas d''erreur.', '["Jenkins", "Docker", "Kubernetes", "GitHub Actions", "SonarQube"]', CURRENT_TIMESTAMP),
-- Claire
(206, 103, 'Banking Mobile App Design', 'Refonte complète de l''interface mobile d''une application bancaire avec focus sur l''accessibilité et l''expérience utilisateur.', '["Figma", "User Research", "Prototyping", "Design System"]', CURRENT_TIMESTAMP),
(207, 103, 'Design System Framework', 'Création d''un design system complet avec composants réutilisables, documentation et guidelines pour une équipe de 50+ développeurs.', '["Figma", "Storybook", "Documentation", "Components Library"]', CURRENT_TIMESTAMP),
-- David
(208, 104, 'Predictive Analytics Dashboard', 'Tableau de bord avec modèles ML pour prédire les tendances de vente et optimiser les stocks. Précision de 85%.', '["Python", "TensorFlow", "Plotly", "FastAPI", "PostgreSQL"]', CURRENT_TIMESTAMP),
(209, 104, 'NLP Sentiment Analysis Tool', 'Outil d''analyse de sentiments sur les réseaux sociaux pour détecter les tendances et opinions clients en temps réel.', '["Python", "BERT", "PyTorch", "ElasticSearch", "React"]', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== EXPÉRIENCES =====
INSERT INTO experiences (id, portfolio_id, company, position, description, start_date, end_date, created_at) VALUES
-- Alice
(301, 101, 'TechCorp France', 'Senior Full Stack Developer', 'Lead technique sur plusieurs projets clients. Architecture d''applications web scalables. Mentorat de 5 développeurs juniors. Migration de systèmes legacy vers stack moderne.', '2021-03-01', NULL, CURRENT_TIMESTAMP),
(302, 101, 'StartupXYZ', 'Full Stack Developer', 'Développement de la plateforme SaaS principale. Implémentation de fonctionnalités temps réel. Optimisation des performances (réduction de 40% du temps de chargement).', '2019-06-01', '2021-02-28', CURRENT_TIMESTAMP),
(303, 101, 'WebAgency Pro', 'Junior Developer', 'Développement de sites web pour clients variés. Apprentissage des bonnes pratiques. Participation à 15+ projets clients.', '2018-09-01', '2019-05-31', CURRENT_TIMESTAMP),
-- Bob
(304, 102, 'CloudServices Inc', 'Lead DevOps Engineer', 'Responsable de l''infrastructure cloud pour 50+ applications. Réduction des coûts AWS de 30%. Mise en place de pipelines CI/CD pour 20+ équipes.', '2020-01-15', NULL, CURRENT_TIMESTAMP),
(305, 102, 'InfraGroup', 'DevOps Engineer', 'Automatisation des déploiements. Migration vers Kubernetes. Formation des équipes de développement aux pratiques DevOps.', '2018-03-01', '2019-12-31', CURRENT_TIMESTAMP),
-- Claire
(306, 103, 'DesignStudio Elite', 'Lead UX/UI Designer', 'Direction créative sur projets clients majeurs. Gestion d''une équipe de 4 designers. Création de design systems. Recherche utilisateur et tests d''usabilité.', '2019-09-01', NULL, CURRENT_TIMESTAMP),
(307, 103, 'Creative Agency', 'Senior UX Designer', 'Conception d''interfaces pour applications web et mobile. Prototypage haute-fidélité. Collaboration étroite avec développeurs et product owners.', '2017-06-15', '2019-08-31', CURRENT_TIMESTAMP),
-- David
(308, 104, 'AI Labs Research', 'Senior Data Scientist', 'Développement de modèles ML pour analyse prédictive. Publication de 3 papers dans des conférences internationales. Collaboration avec universités.', '2020-10-01', NULL, CURRENT_TIMESTAMP),
(309, 104, 'DataCorp', 'Data Scientist', 'Analyse de données massives. Création de dashboards analytiques. Mise en production de modèles ML. Formation des équipes business.', '2018-07-01', '2020-09-30', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== ÉDUCATION =====
INSERT INTO education (id, portfolio_id, school, diploma, description, start_date, end_date, created_at) VALUES
-- Alice
(401, 101, 'École 42', 'Diplôme Développeur Web', 'Formation intensive en développement web. Apprentissage par projets. Travail en équipe et peer-learning. Spécialisation Full Stack.', '2016-09-01', '2018-06-30', CURRENT_TIMESTAMP),
(402, 101, 'Université Pierre et Marie Curie', 'Licence Informatique', 'Fondamentaux de l''informatique. Algorithmique et structures de données. Programmation orientée objet. Bases de données.', '2013-09-01', '2016-06-30', CURRENT_TIMESTAMP),
-- Bob
(403, 102, 'EPITECH', 'Expert en Technologies de l''Information', 'Formation d''ingénieur en informatique. Spécialisation systèmes et réseaux. Stage de 6 mois chez AWS. Projet de fin d''études sur Kubernetes.', '2013-09-01', '2018-06-30', CURRENT_TIMESTAMP),
-- Claire
(404, 103, 'ENSAD (École Nationale Supérieure des Arts Décoratifs)', 'Master Design d''Interface', 'Design thinking, UX research, prototypage. Projets avec entreprises partenaires. Mémoire sur l''accessibilité numérique.', '2015-09-01', '2017-06-30', CURRENT_TIMESTAMP),
(405, 103, 'École de Design Nantes', 'Bachelor Design Graphique', 'Typographie, composition, identité visuelle. Initiation au design interactif. Stage en agence de communication.', '2012-09-01', '2015-06-30', CURRENT_TIMESTAMP),
-- David
(406, 104, 'Université Paris-Saclay', 'Doctorat en Informatique - Intelligence Artificielle', 'Recherche sur les réseaux de neurones profonds. Thèse: "Optimisation des architectures de deep learning pour l''analyse de données massives". 5 publications scientifiques.', '2015-09-01', '2018-12-15', CURRENT_TIMESTAMP),
(407, 104, 'CentraleSupélec', 'Master Informatique - Data Science', 'Machine learning, big data, statistiques avancées. Projet de recherche avec INRIA. Mémoire sur NLP.', '2013-09-01', '2015-06-30', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== CERTIFICATIONS =====
INSERT INTO certifications (id, portfolio_id, title, organization, description, date, created_at) VALUES
-- Alice
(501, 101, 'AWS Certified Developer - Associate', 'Amazon Web Services', 'Certification officielle AWS pour le développement d''applications cloud. Validation des compétences en architecture serverless, API Gateway, Lambda, et bases de données managées.', '2022-06-15', CURRENT_TIMESTAMP),
(502, 101, 'MongoDB Certified Developer', 'MongoDB University', 'Maîtrise de MongoDB pour applications à grande échelle. Optimisation des requêtes, indexation, réplication et sharding.', '2021-11-20', CURRENT_TIMESTAMP),
-- Bob
(503, 102, 'Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation', 'Certification officielle pour l''administration de clusters Kubernetes. Déploiement, scaling, networking et troubleshooting.', '2021-09-10', CURRENT_TIMESTAMP),
(504, 102, 'AWS Solutions Architect - Professional', 'Amazon Web Services', 'Certification avancée AWS. Architecture haute disponibilité, disaster recovery, sécurité et optimisation des coûts.', '2020-12-05', CURRENT_TIMESTAMP),
(505, 102, 'HashiCorp Certified: Terraform Associate', 'HashiCorp', 'Maîtrise de Terraform pour Infrastructure as Code. Provisioning, modules, state management et best practices.', '2021-04-18', CURRENT_TIMESTAMP),
-- Claire
(506, 103, 'UX Design Professional Certificate', 'Nielsen Norman Group', 'Formation complète en UX design par les leaders du domaine. User research, personas, wireframing, testing et analytics.', '2019-03-22', CURRENT_TIMESTAMP),
(507, 103, 'Certified Usability Analyst', 'Human Factors International', 'Certification en analyse d''utilisabilité. Méthodologies de tests utilisateurs, eye-tracking et analyse heuristique.', '2018-10-15', CURRENT_TIMESTAMP),
-- David
(508, 104, 'TensorFlow Developer Certificate', 'Google', 'Certification officielle Google en développement avec TensorFlow. Deep learning, CNN, RNN et déploiement de modèles.', '2021-07-30', CURRENT_TIMESTAMP),
(509, 104, 'AWS Machine Learning - Specialty', 'Amazon Web Services', 'Certification spécialisée ML sur AWS. SageMaker, modèles de ML, feature engineering et mise en production.', '2020-08-12', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== MÉDIAS =====
INSERT INTO media (id, portfolio_id, linkedin, github, twitter, created_at) VALUES
(601, 101, 'https://linkedin.com/in/alice-dubois-dev', 'https://github.com/alicedubois', 'https://twitter.com/alice_codes', CURRENT_TIMESTAMP),
(602, 102, 'https://linkedin.com/in/bob-martin-devops', 'https://github.com/bobmartin', NULL, CURRENT_TIMESTAMP),
(603, 103, 'https://linkedin.com/in/claire-leroy-ux', 'https://github.com/claireleroy', 'https://twitter.com/claire_designs', CURRENT_TIMESTAMP),
(604, 104, 'https://linkedin.com/in/david-chen-ds', 'https://github.com/davidchen', 'https://twitter.com/david_ml', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== WEBSITES =====
INSERT INTO websites (media_id, url, created_at) VALUES
(601, 'https://alicedubois.dev', CURRENT_TIMESTAMP),
(601, 'https://blog.alicedubois.dev', CURRENT_TIMESTAMP),
(602, 'https://bobmartin.io', CURRENT_TIMESTAMP),
(603, 'https://claireleroy.design', CURRENT_TIMESTAMP),
(603, 'https://dribbble.com/claireleroy', CURRENT_TIMESTAMP),
(603, 'https://behance.net/claireleroy', CURRENT_TIMESTAMP),
(604, 'https://davidchen.ai', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== LINKS =====
INSERT INTO links (media_id, url, label, created_at) VALUES
(601, 'https://medium.com/@alicedubois', 'Blog Medium', CURRENT_TIMESTAMP),
(601, 'https://stackoverflow.com/users/alicedubois', 'StackOverflow', CURRENT_TIMESTAMP),
(601, 'https://dev.to/alicedubois', 'Dev.to Articles', CURRENT_TIMESTAMP),
(602, 'https://medium.com/@bobmartin', 'DevOps Blog', CURRENT_TIMESTAMP),
(602, 'https://bobmartin.io/talks', 'Conférences', CURRENT_TIMESTAMP),
(603, 'https://medium.com/@claireleroy', 'UX Writing', CURRENT_TIMESTAMP),
(603, 'https://pinterest.com/claireleroy', 'Inspirations', CURRENT_TIMESTAMP),
(604, 'https://kaggle.com/davidchen', 'Kaggle Profile', CURRENT_TIMESTAMP),
(604, 'https://scholar.google.com/davidchen', 'Publications', CURRENT_TIMESTAMP),
(604, 'https://medium.com/@davidchen', 'ML Blog', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ===== ACTIVITÉS =====
INSERT INTO activities (id, portfolio_id, action, name, timestamp, created_at) VALUES
-- Alice
(701, 101, 'profile_updated', 'Mise à jour du profil', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '2 hours'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(702, 101, 'project_added', 'Portfolio Builder ajouté', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '1 day'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(703, 101, 'skill_added', 'Docker ajouté aux compétences', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '3 days'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(704, 101, 'certification_added', 'Certification AWS obtenue', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '1 week'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '1 week'),
-- Bob
(705, 102, 'profile_updated', 'Bio mise à jour', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '5 hours'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(706, 102, 'project_added', 'CI/CD Pipeline ajouté', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '2 days'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(707, 102, 'skill_added', 'Terraform ajouté', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '5 days'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '5 days'),
-- Claire
(708, 103, 'project_updated', 'Design System mis à jour', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(709, 103, 'profile_updated', 'Photo de profil changée', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '4 days'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(710, 103, 'link_added', 'Behance ajouté', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '1 week'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '1 week'),
-- David
(711, 104, 'project_added', 'NLP Tool ajouté', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '3 hours'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(712, 104, 'certification_added', 'TensorFlow Certificate', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '6 days'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(713, 104, 'experience_updated', 'Expérience AI Labs mise à jour', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - INTERVAL '2 weeks'))::BIGINT, CURRENT_TIMESTAMP - INTERVAL '2 weeks')
ON CONFLICT DO NOTHING;

-- ===== STATISTIQUES =====
SELECT 
    '============================================' as "Résumé du Seed",
    '' as " "
UNION ALL
SELECT 'Utilisateurs créés:', COUNT(*)::TEXT FROM users WHERE id >= 1001
UNION ALL
SELECT 'Portfolios créés:', COUNT(*)::TEXT FROM portfolios WHERE id >= 101
UNION ALL
SELECT 'Compétences ajoutées:', COUNT(*)::TEXT FROM skills WHERE portfolio_id >= 101
UNION ALL
SELECT 'Projets créés:', COUNT(*)::TEXT FROM projects WHERE id >= 201
UNION ALL
SELECT 'Expériences ajoutées:', COUNT(*)::TEXT FROM experiences WHERE id >= 301
UNION ALL
SELECT 'Formations ajoutées:', COUNT(*)::TEXT FROM education WHERE id >= 401
UNION ALL
SELECT 'Certifications ajoutées:', COUNT(*)::TEXT FROM certifications WHERE id >= 501
UNION ALL
SELECT 'Médias créés:', COUNT(*)::TEXT FROM media WHERE id >= 601
UNION ALL
SELECT 'Sites web ajoutés:', COUNT(*)::TEXT FROM websites WHERE media_id >= 601
UNION ALL
SELECT 'Liens ajoutés:', COUNT(*)::TEXT FROM links WHERE media_id >= 601
UNION ALL
SELECT 'Activités créées:', COUNT(*)::TEXT FROM activities WHERE id >= 701
UNION ALL
SELECT '', ''
UNION ALL
SELECT '✅ Seed terminé avec succès !', '';
