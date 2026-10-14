-- ============================================================
-- Teams Feature Migration
-- Run this in Neon Dashboard > SQL Editor
-- URL: https://console.neon.tech
-- Project: ep-spring-tree-aeob5o5w / database: neondb
-- ============================================================

-- 1. Create enum
DO $$ BEGIN
  CREATE TYPE "TeamTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create Team table
CREATE TABLE IF NOT EXISTS "Team" (
  "id"          TEXT         NOT NULL,
  "name"        TEXT         NOT NULL,
  "description" TEXT,
  "isActive"    BOOLEAN      NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- 3. Create TeamMember table
CREATE TABLE IF NOT EXISTS "TeamMember" (
  "id"        TEXT         NOT NULL,
  "teamId"    TEXT         NOT NULL,
  "studentId" TEXT         NOT NULL,
  "joinedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- 4. Create TeamTask table
CREATE TABLE IF NOT EXISTS "TeamTask" (
  "id"           TEXT             NOT NULL,
  "teamMemberId" TEXT             NOT NULL,
  "title"        TEXT             NOT NULL,
  "description"  TEXT,
  "dueDate"      TIMESTAMP(3),
  "status"       "TeamTaskStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TeamTask_pkey" PRIMARY KEY ("id")
);

-- 5. Unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Team_name_key"
  ON "Team"("name");

CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_teamId_studentId_key"
  ON "TeamMember"("teamId", "studentId");

-- 6. Regular indexes
CREATE INDEX IF NOT EXISTS "TeamMember_teamId_idx"    ON "TeamMember"("teamId");
CREATE INDEX IF NOT EXISTS "TeamMember_studentId_idx" ON "TeamMember"("studentId");
CREATE INDEX IF NOT EXISTS "TeamTask_teamMemberId_idx" ON "TeamTask"("teamMemberId");
CREATE INDEX IF NOT EXISTS "TeamTask_status_idx"       ON "TeamTask"("status");

-- 7. Foreign keys

-- TeamMember → Team (cascade delete)
DO $$ BEGIN
  ALTER TABLE "TeamMember"
    ADD CONSTRAINT "TeamMember_teamId_fkey"
    FOREIGN KEY ("teamId") REFERENCES "Team"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- TeamMember → User (cascade delete)
DO $$ BEGIN
  ALTER TABLE "TeamMember"
    ADD CONSTRAINT "TeamMember_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- TeamTask → TeamMember (cascade delete)
DO $$ BEGIN
  ALTER TABLE "TeamTask"
    ADD CONSTRAINT "TeamTask_teamMemberId_fkey"
    FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 8. Record migration in Prisma's tracking table
INSERT INTO "_prisma_migrations" (
  "id", "checksum", "finished_at", "migration_name",
  "logs", "rolled_back_at", "started_at", "applied_steps_count"
)
SELECT
  gen_random_uuid(),
  'teams_feature_manual',
  NOW(),
  'add_teams_feature',
  NULL, NULL, NOW(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = 'add_teams_feature'
);

-- 9. Verify — should show Team, TeamMember, TeamTask
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('Team', 'TeamMember', 'TeamTask')
ORDER BY table_name;
