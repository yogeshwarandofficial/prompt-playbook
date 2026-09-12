const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(address, protocols) {
    console.log('Intercepted WS address:', address);
    super(address, protocols, { family: 4 });
  }
}

neonConfig.webSocketConstructor = IPv4WebSocket;

async function test() {
  console.log('Testing PrismaNeon (WebSocket Pool) with IPv4 WebSocket Wrapper...');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('Running SELECT 1...');
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('SELECT 1 result:', result);
    
    console.log('Testing Prisma findUnique...');
    const user = await prisma.user.findFirst();
    console.log('Found user:', user?.studentId || 'none');
    
    console.log('\n✅ IPv4 WebSocket works');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
