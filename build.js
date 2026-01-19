#!/usr/bin/env node
/**
 * Build script pour préparer le déploiement
 * Installe les dépendances du frontend et backend, puis compile le frontend
 */
import { execSync } from 'child_process';

console.log(' Installing root dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log(' Installing backend dependencies...');
execSync('npm --prefix backend install', { stdio: 'inherit' });

console.log(' Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

console.log(' Build complete!');
