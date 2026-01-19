#!/usr/bin/env node
/**
 * Build script pour préparer le déploiement
 * postinstall hook installe automatiquement les dépendances du backend
 * Ce script compile juste le frontend
 */
import { execSync } from 'child_process';

console.log('🔨 Building frontend...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
