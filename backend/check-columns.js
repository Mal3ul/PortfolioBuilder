// Check if cv_file and cv_file_name columns exist
import './env-loader.js';
import pool from './config/database.js';

async function checkColumns() {
  try {
    console.log('🔍 Checking media table columns...');
    
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'media'
      ORDER BY ordinal_position;
    `);
    
    console.log('✅ Media table columns:');
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkColumns();
