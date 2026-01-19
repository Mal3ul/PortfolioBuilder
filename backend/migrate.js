import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'data/db.json');

async function migrate() {
  console.log('🔄 Starting migration from JSON to PostgreSQL...');
  
  try {
    const db = await fs.readJSON(DB_FILE);
    console.log(`📦 Found ${db.users.length} users to migrate`);
    
    // Migrer les utilisateurs
    for (const user of db.users) {
      await pool.query(
        `INSERT INTO users (id, name, email, password, role, created_at, reset_password_token, reset_password_expiry)
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
          user.resetTokenExpires ? new Date(user.resetTokenExpires).getTime() : null
        ]
      );
      console.log(`✅ User: ${user.email}`);
    }
    
    // 2. Migrer les portfolios
    if (db.portfolios) {
      const portfolioEntries = typeof db.portfolios === 'object' && !Array.isArray(db.portfolios)
        ? Object.entries(db.portfolios).map(([userId, data]) => ({ userId, ...data }))
        : db.portfolios;
      
      for (const portfolio of portfolioEntries) {
        const result = await pool.query(
          `INSERT INTO portfolios (id, user_id, title, bio, updated_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (user_id) DO UPDATE SET
             title = EXCLUDED.title,
             bio = EXCLUDED.bio,
             updated_at = EXCLUDED.updated_at
           RETURNING id`,
          [
            parseInt(portfolio.userId),
            parseInt(portfolio.userId),
            portfolio.profile?.title || portfolio.title || '',
            portfolio.profile?.bio || portfolio.description || '',
            new Date().toISOString()
          ]
        );
        const portfolioId = result.rows[0].id;
        console.log(`✅ Portfolio ${portfolioId} for user ${portfolio.userId}`);
        
        // 3. Migrer les skills
        if (portfolio.skills?.length) {
          for (const skill of portfolio.skills) {
            await pool.query(
              `INSERT INTO skills (portfolio_id, name, level, category, created_at)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT DO NOTHING`,
              [portfolioId, skill.name, skill.level || 50, skill.category || 'Autre', new Date().toISOString()]
            );
          }
          console.log(`  ✅ ${portfolio.skills.length} skills`);
        }
        
        // 4. Migrer les projects
        if (portfolio.projects?.length) {
          for (const project of portfolio.projects) {
            const projResult = await pool.query(
              `INSERT INTO projects (portfolio_id, title, description, technologies, github_url, live_url, image_url, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               ON CONFLICT DO NOTHING
               RETURNING id`,
              [
                portfolioId,
                project.title,
                project.description || '',
                JSON.stringify(project.technologies || []),
                project.githubUrl || null,
                project.liveUrl || null,
                project.imageUrl || null,
                new Date().toISOString()
              ]
            );
          }
          console.log(`  ✅ ${portfolio.projects.length} projects`);
        }
        
        // 5. Migrer les experiences
        if (portfolio.experiences?.length) {
          for (const exp of portfolio.experiences) {
            await pool.query(
              `INSERT INTO experiences (portfolio_id, company, position, description, start_date, end_date, is_current, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               ON CONFLICT DO NOTHING`,
              [
                portfolioId,
                exp.company,
                exp.position,
                exp.description || '',
                exp.startDate,
                exp.endDate || null,
                exp.isCurrent || false,
                new Date().toISOString()
              ]
            );
          }
          console.log(`  ✅ ${portfolio.experiences.length} experiences`);
        }
        
        // 6. Migrer les education
        if (portfolio.education?.length) {
          for (const edu of portfolio.education) {
            await pool.query(
              `INSERT INTO education (portfolio_id, institution, degree, field, start_date, end_date, description, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               ON CONFLICT DO NOTHING`,
              [
                portfolioId,
                edu.institution,
                edu.degree,
                edu.field || '',
                edu.startDate,
                edu.endDate || null,
                edu.description || '',
                new Date().toISOString()
              ]
            );
          }
          console.log(`  ✅ ${portfolio.education.length} education`);
        }
        
        // 7. Migrer les certifications
        if (portfolio.certifications?.length) {
          for (const cert of portfolio.certifications) {
            await pool.query(
              `INSERT INTO certifications (portfolio_id, name, issuer, date, url, created_at)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT DO NOTHING`,
              [
                portfolioId,
                cert.name,
                cert.issuer,
                cert.date,
                cert.url || null,
                new Date().toISOString()
              ]
            );
          }
          console.log(`  ✅ ${portfolio.certifications.length} certifications`);
        }
      }
    }
    
    // 8. Migrer les activities (log global)
    if (db.activities?.length) {
      for (const activity of db.activities) {
        await pool.query(
          `INSERT INTO activities (user_id, action, details, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [
            activity.userId,
            activity.action,
            JSON.stringify(activity.details || {}),
            activity.timestamp || new Date().toISOString()
          ]
        );
      }
      console.log(`✅ ${db.activities.length} activities migrated`);
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
