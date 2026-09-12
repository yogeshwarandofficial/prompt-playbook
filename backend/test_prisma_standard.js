const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function test() {
  console.log('Testing STANDARD PrismaClient (No Adapter)...');
  console.log('URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient();
  
  try {
    console.log('Running SELECT 1...');
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('SELECT 1 result:', result);
    
    console.log('Testing Prisma findUnique...');
    const user = await prisma.user.findFirst();
    console.log('Found user:', user?.studentId || 'none');
    
    console.log('\n✅ STANDARD Prisma works');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
