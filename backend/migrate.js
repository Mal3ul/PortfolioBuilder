import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'data/db.json');
const PORTFOLIO_FILE = path.join(__dirname, 'data/portfolio.json');

async function migrate() {
  console.log('🔄 Starting migration from JSON to PostgreSQL...');
  
  try {
    // Lire les données JSON
    const db = await fs.readJSON(DB_FILE);
    const portfolioData = await fs.readJSON(PORTFOLIO_FILE);
    
    console.log(`📦 Found ${db.users.length} users to migrate`);
    
    // Migrer les utilisateurs
    for (const user of db.users) {
      await pool.query(
        `INSERT INTO users (id, name, email, password, role, created_at, reset_token, reset_token_expires)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           password = EXCLUDED.password,
           role = EXCLUDED.role`,
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.role || 'user',
          user.createdAt || new Date().toISOString(),
          user.resetToken || null,
          user.resetTokenExpires || null
        ]
      );
      console.log(`✅ Migrated user: ${user.email}`);
    }
    
    // Migrer les portfolios
    for (const user of db.users) {
      const userPortfolio = db.portfolios?.find(p => p.userId === user.id);
      
      if (userPortfolio) {
        await pool.query(
          `INSERT INTO portfolios (user_id, title, description, tagline, avatar_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id) DO UPDATE SET
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             tagline = EXCLUDED.tagline,
             avatar_url = EXCLUDED.avatar_url,
             updated_at = EXCLUDED.updated_at`,
          [
            user.id,
            userPortfolio.title || user.name,
            userPortfolio.description || '',
            userPortfolio.tagline || '',
            userPortfolio.avatarUrl || null,
            userPortfolio.createdAt || new Date().toISOString(),
            new Date().toISOString()
          ]
        );
        console.log(`✅ Migrated portfolio for user: ${user.email}`);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
