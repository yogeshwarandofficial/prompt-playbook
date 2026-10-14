// Push Teams tables to Neon via HTTP (tagged template literal pattern — same as apply_schema_neon.js)
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

const migrationName = 'add_teams_feature';

async function applyTeamsSchema() {
  console.log('Applying Teams schema to Neon...\n');

  // ── 1. TeamTaskStatus enum ────────────────────────────────────────────────
  try {
    await sql`CREATE TYPE "TeamTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`;
    console.log('✅ TeamTaskStatus enum created');
  } catch (e) {
    if (e.message && e.message.includes('already exists')) {
      console.log('⏭️  TeamTaskStatus enum (already exists)');
    } else {
      console.error('❌ TeamTaskStatus enum error:', e.message);
    }
  }

  // ── 2. Team table ─────────────────────────────────────────────────────────
  try {
    await sql`CREATE TABLE IF NOT EXISTS "Team" (
      "id"          TEXT         NOT NULL,
      "name"        TEXT         NOT NULL,
      "description" TEXT,
      "isActive"    BOOLEAN      NOT NULL DEFAULT true,
      "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
    )`;
    console.log('✅ Team table');
  } catch (e) {
    console.log(e.message.includes('already exists') ? '⏭️  Team table (exists)' : '❌ Team: ' + e.message);
  }

  // ── 3. TeamMember table ───────────────────────────────────────────────────
  try {
    await sql`CREATE TABLE IF NOT EXISTS "TeamMember" (
      "id"        TEXT         NOT NULL,
      "teamId"    TEXT         NOT NULL,
      "studentId" TEXT         NOT NULL,
      "joinedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
    )`;
    console.log('✅ TeamMember table');
  } catch (e) {
    console.log(e.message.includes('already exists') ? '⏭️  TeamMember table (exists)' : '❌ TeamMember: ' + e.message);
  }

  // ── 4. TeamTask table ─────────────────────────────────────────────────────
  try {
    await sql`CREATE TABLE IF NOT EXISTS "TeamTask" (
      "id"           TEXT             NOT NULL,
      "teamMemberId" TEXT             NOT NULL,
      "title"        TEXT             NOT NULL,
      "description"  TEXT,
      "dueDate"      TIMESTAMP(3),
      "status"       "TeamTaskStatus" NOT NULL DEFAULT 'PENDING',
      "createdAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "TeamTask_pkey" PRIMARY KEY ("id")
    )`;
    console.log('✅ TeamTask table');
  } catch (e) {
    console.log(e.message.includes('already exists') ? '⏭️  TeamTask table (exists)' : '❌ TeamTask: ' + e.message);
  }

  // ── 5. Unique indexes ─────────────────────────────────────────────────────
  try {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "Team_name_key" ON "Team"("name")`;
    console.log('✅ Team_name_key (unique)');
  } catch (e) { console.log('⏭️/❌ Team_name_key:', e.message.substring(0, 80)); }

  try {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_teamId_studentId_key" ON "TeamMember"("teamId", "studentId")`;
    console.log('✅ TeamMember_teamId_studentId_key (unique)');
  } catch (e) { console.log('⏭️/❌ TeamMember unique idx:', e.message.substring(0, 80)); }

  // ── 6. Regular indexes ────────────────────────────────────────────────────
  try {
    await sql`CREATE INDEX IF NOT EXISTS "TeamMember_teamId_idx" ON "TeamMember"("teamId")`;
    console.log('✅ TeamMember_teamId_idx');
  } catch (e) { console.log('⏭️/❌ TeamMember_teamId_idx:', e.message.substring(0, 80)); }

  try {
    await sql`CREATE INDEX IF NOT EXISTS "TeamMember_studentId_idx" ON "TeamMember"("studentId")`;
    console.log('✅ TeamMember_studentId_idx');
  } catch (e) { console.log('⏭️/❌ TeamMember_studentId_idx:', e.message.substring(0, 80)); }

  try {
    await sql`CREATE INDEX IF NOT EXISTS "TeamTask_teamMemberId_idx" ON "TeamTask"("teamMemberId")`;
    console.log('✅ TeamTask_teamMemberId_idx');
  } catch (e) { console.log('⏭️/❌ TeamTask_teamMemberId_idx:', e.message.substring(0, 80)); }

  try {
    await sql`CREATE INDEX IF NOT EXISTS "TeamTask_status_idx" ON "TeamTask"("status")`;
    console.log('✅ TeamTask_status_idx');
  } catch (e) { console.log('⏭️/❌ TeamTask_status_idx:', e.message.substring(0, 80)); }

  // ── 7. Foreign keys ───────────────────────────────────────────────────────

  // TeamMember → Team
  try {
    await sql`ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey"
      FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    console.log('✅ FK TeamMember → Team');
  } catch (e) {
    console.log(e.message.includes('already exists') ? '⏭️  FK TeamMember → Team (exists)' : '❌ FK TeamMember→Team: ' + e.message);
  }

  // TeamMember → User
  try {
    await sql`ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_studentId_fkey"
      FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    console.log('✅ FK TeamMember → User');
  } catch (e) {
    console.log(e.message.includes('already exists') ? '⏭️  FK TeamMember → User (exists)' : '❌ FK TeamMember→User: ' + e.message);
  }

  // TeamTask → TeamMember
  try {
    await sql`ALTER TABLE "TeamTask" ADD CONSTRAINT "TeamTask_teamMemberId_fkey"
      FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    console.log('✅ FK TeamTask → TeamMember');
  } catch (e) {
    console.log(e.message.includes('already exists') ? '⏭️  FK TeamTask → TeamMember (exists)' : '❌ FK TeamTask→TeamMember: ' + e.message);
  }

  // ── 8. Record in _prisma_migrations ──────────────────────────────────────
  const migrationSql = `-- Teams feature migration
CREATE TYPE "TeamTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TABLE "Team" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Team_pkey" PRIMARY KEY ("id"));
CREATE TABLE "TeamMember" ("id" TEXT NOT NULL, "teamId" TEXT NOT NULL, "studentId" TEXT NOT NULL, "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id"));
CREATE TABLE "TeamTask" ("id" TEXT NOT NULL, "teamMemberId" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "dueDate" TIMESTAMP(3), "status" "TeamTaskStatus" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TeamTask_pkey" PRIMARY KEY ("id"));`;

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
    console.log('\n✅ Migration recorded in _prisma_migrations');
  } catch (e) {
    console.warn('⚠️  Could not record migration (table may not exist yet):', e.message.substring(0, 80));
  }

  // ── 9. Verify ─────────────────────────────────────────────────────────────
  console.log('\n--- Verifying Teams tables ---');
  try {
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('Team', 'TeamMember', 'TeamTask')
      ORDER BY table_name
    `;
    if (tables.length === 3) {
      console.log('✅ All 3 Teams tables confirmed in DB!');
      tables.forEach(t => console.log('   -', t.table_name));
    } else {
      console.log(`⚠️  Only ${tables.length}/3 tables found:`, tables.map(t => t.table_name));
    }
  } catch (e) {
    console.error('❌ Verify failed:', e.message);
  }

  console.log('\n✅ Teams schema migration complete!');
}

applyTeamsSchema().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
