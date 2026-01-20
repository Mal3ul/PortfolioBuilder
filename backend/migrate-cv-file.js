// Migration script to add cv_file and cv_file_name columns to media table
import './env-loader.js';
import pool from './config/database.js';

async function migrate() {
  try {
    console.log('🔄 Adding cv_file and cv_file_name columns to media table...');
    
    await pool.query(`
      ALTER TABLE media 
      ADD COLUMN IF NOT EXISTS cv_file TEXT,
      ADD COLUMN IF NOT EXISTS cv_file_name VARCHAR(255);
    `);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
