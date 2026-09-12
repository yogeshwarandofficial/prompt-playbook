const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(address, protocols) {
    super(address, protocols, { family: 4 });
  }
}

neonConfig.webSocketConstructor = IPv4WebSocket;

async function test() {
  console.log('Testing Prisma findUnique exact match...');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('Running findUnique...');
    const user = await prisma.user.findUnique({
      where: { studentId: 'admin' },
    });
    console.log('Found user:', user?.studentId || 'none');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
    console.error(e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
