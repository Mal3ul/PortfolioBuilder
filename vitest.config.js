import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
    // Les tests d'intégration ouvrent une vraie connexion DB : pas de timeout trop court.
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: ['backend/**/*.js'],
      exclude: ['backend/server.js', 'backend/migrate.js'],
    },
  },
});
