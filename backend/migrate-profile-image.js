// Migration script to add profile_image column to media table
import './env-loader.js';
import pool from './config/database.js';

async function migrate() {
  try {
    console.log('🔄 Adding profile_image column to media table...');
    
    await pool.query(`
      ALTER TABLE media 
      ADD COLUMN IF NOT EXISTS profile_image TEXT;
    `);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
