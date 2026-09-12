const { PrismaClient } = require('@prisma/client');
const { PrismaNeonHTTP } = require('@prisma/adapter-neon');
const { neon } = require('@neondatabase/serverless');

require('dotenv').config();

async function test() {
  console.log('Testing PrismaClient with Native Fetch...');
  const sql = neon(process.env.DATABASE_URL);
  const adapter = new PrismaNeonHTTP(sql);
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('Running SELECT 1...');
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('SELECT 1 result:', result);
    
    console.log('Testing Prisma findUnique (login equivalent)...');
    const user = await prisma.user.findFirst();
    console.log('Found user:', user?.studentId || 'none');
    
    console.log('\n✅ Prisma works with Native Fetch');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
