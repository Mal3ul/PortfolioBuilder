// Valeurs d'environnement par défaut pour les tests (n'écrase pas ce qui est déjà défini).
process.env.NODE_ENV ||= 'test';
process.env.JWT_SECRET ||= 'test-secret';
process.env.JWT_EXPIRES_IN ||= '30m';
// Aucun email réel envoyé pendant les tests.
process.env.NEUTRALIZE_EMAIL ||= 'true';
// DATABASE_URL factice par défaut : le pool pg est paresseux (pas de connexion à
// l'import). Les tests unitaires mockent les repos ; l'intégration reçoit une vraie
// URL via docker-utils.yaml (qui écrase cette valeur).
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test?sslmode=disable';
