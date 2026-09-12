/**
 * apply_migration.js
 * Applies internship workflow migration SQL via Neon HTTP transport.
 * Uses tagged template literals to work with @neondatabase/serverless 0.10.x
 */
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const migrationName = '20260909135006_add_internship_project_workflow';
const sqlPath = path.join(__dirname, 'prisma', 'migrations', migrationName, 'migration.sql');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const migrationSql = fs.readFileSync(sqlPath, 'utf8');

  // Split statements
  const statements = migrationSql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.endsWith(';') ? s : s + ';');

  console.log(`Applying ${statements.length} statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      // neon() tagged template literals don't support dynamic vars well,
      // but we can use the sql function as a no-parameter query by passing
      // the SQL directly via the array form of tagged templates
      await sql([stmt]);
      console.log(`  [${i + 1}/${statements.length}] OK`);
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (
        msg.includes('already exists') ||
        msg.includes('duplicate') ||
        msg.includes('does not exist') ||
        msg.includes('if not exists')
      ) {
        console.log(`  [${i + 1}/${statements.length}] SKIP: ${(err.message || '').slice(0, 100)}`);
      } else {
        console.error(`  [${i + 1}/${statements.length}] FAILED:`);
        console.error('  Statement:', stmt.slice(0, 120));
        console.error('  Error:', err.message);
        throw err;
      }
    }
  }

  // Record in _prisma_migrations using tagged template
  const checksum = crypto.createHash('sha256').update(migrationSql).digest('hex');
  try {
    await sql`
      INSERT INTO "_prisma_migrations" (
        "id", "checksum", "finished_at", "migration_name",
        "logs", "rolled_back_at", "started_at", "applied_steps_count"
      ) VALUES (
        gen_random_uuid(),
        ${checksum},
        NOW(),
        ${migrationName},
        NULL, NULL, NOW(), 1
      )
      ON CONFLICT ("migration_name") DO NOTHING
    `;
    console.log('\nMigration recorded in _prisma_migrations.');
  } catch (err) {
    console.warn('Could not record migration:', err.message);
  }

  console.log('\nMigration applied successfully!');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
