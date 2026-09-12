// Task 5: Minimal Neon connectivity test via PrismaNeonHTTP adapter
// Uses HTTP (not TCP port 5432) — bypasses IPv6/TLS issue on Windows
const { PrismaClient } = require('@prisma/client');
const { PrismaNeonHTTP } = require('@prisma/adapter-neon');
const { neon } = require('@neondatabase/serverless');

// Load DATABASE_URL from .env manually
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

async function testConnection() {
  console.log('=== Neon Connectivity Test ===');
  console.log('Transport: HTTP (PrismaNeonHTTP)');
  console.log('Host: [redacted for security]');
  console.log('');

  try {
    // Create Neon HTTP client
    const sql = neon(connectionString);
    const adapter = new PrismaNeonHTTP(sql);
    const prisma = new PrismaClient({ adapter });

    // Task 5: Execute SELECT 1 equivalent
    console.log('Running: SELECT 1...');
    const result = await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log('Result:', result);
    console.log('');
    console.log('✅ Prisma connected to Neon Academy database successfully via HTTP adapter');

    // Also verify a real table exists
    console.log('Verifying tables: checking User count...');
    const userCount = await prisma.user.count();
    console.log(`Users in database: ${userCount}`);

    const courseCount = await prisma.course.count();
    console.log(`Courses in database: ${courseCount}`);

    await prisma.$disconnect();
    console.log('');
    console.log('✅ Database connectivity test PASSED');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
