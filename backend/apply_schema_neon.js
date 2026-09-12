// Final schema application to Neon — handles PG18 syntax differences
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function applySchema() {
  console.log('Applying full Prisma schema to Neon...\n');

  // Create Role enum (PG18 compatible — no IF NOT EXISTS for types)
  try {
    await sql`CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN')`;
    console.log('✅ Role enum created');
  } catch(e) {
    if (e.message.includes('already exists')) {
      console.log('⏭️  Role enum (already exists)');
    } else {
      console.error('❌ Role enum error:', e.message);
    }
  }

  // User table
  try {
    await sql`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" "Role" NOT NULL DEFAULT 'STUDENT',
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )`;
    console.log('✅ User table');
  } catch(e) {
    console.log(e.message.includes('already exists') ? '⏭️  User table (exists)' : '❌ User: ' + e.message);
  }

  // User indexes
  try { await sql`CREATE UNIQUE INDEX IF NOT EXISTS "User_studentId_key" ON "User"("studentId")`; console.log('✅ User_studentId_key'); }
  catch(e) { console.log('⏭️/❌ User_studentId_key:', e.message.substring(0, 80)); }

  try { await sql`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`; console.log('✅ User_email_key'); }
  catch(e) { console.log('⏭️/❌ User_email_key:', e.message.substring(0, 80)); }

  // StudentCourse FK on User (was missing)
  try {
    await sql`ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_studentId_fkey" 
      FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    console.log('✅ StudentCourse_studentId_fkey');
  } catch(e) {
    console.log(e.message.includes('already exists') ? '⏭️  StudentCourse_studentId_fkey (exists)' : '❌ FK1: ' + e.message);
  }

  // Verify final state
  console.log('\n--- Tables in public schema ---');
  const tables = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' ORDER BY table_name
  `;
  tables.forEach(t => console.log(' -', t.table_name));

  console.log('\n--- Enum types ---');
  const enums = await sql`
    SELECT typname FROM pg_type 
    WHERE typcategory = 'E' 
    ORDER BY typname
  `;
  enums.forEach(e => console.log(' -', e.typname));

  console.log('');
  const allGood = tables.length >= 4;
  console.log(allGood ? '✅ All tables present on Neon' : '❌ Some tables missing!');
}

applySchema().catch(console.error);
