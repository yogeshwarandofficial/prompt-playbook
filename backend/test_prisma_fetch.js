const { PrismaClient } = require('@prisma/client');
const { PrismaNeonHTTP } = require('@prisma/adapter-neon');
const { neon, neonConfig } = require('@neondatabase/serverless');
const { setDefaultResultOrder } = require('dns');
const fetch = require('node-fetch');

setDefaultResultOrder('ipv4first');
neonConfig.fetchFunction = fetch;

require('dotenv').config();

async function test() {
  console.log('Testing PrismaClient with node-fetch...');
  const sql = neon(process.env.DATABASE_URL);
  const adapter = new PrismaNeonHTTP(sql);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('SELECT 1 result:', result);
    
    console.log('Testing Prisma findUnique (login equivalent)...');
    const user = await prisma.user.findFirst();
    console.log('Found user:', user?.studentId || 'none');
    
    console.log('\n✅ Prisma works with node-fetch');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
