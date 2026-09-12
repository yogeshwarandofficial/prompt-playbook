const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig, types } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;
types.setTypeParser(1114, (s) => s);
types.setTypeParser(1184, (s) => s);
types.setTypeParser(1082, (s) => s);

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { studentId: true, name: true, role: true, isActive: true }
    });
    console.log('Admin users:', JSON.stringify(admins, null, 2));
    
    if (admins.length === 0) {
      const allUsers = await prisma.user.findMany({
        select: { studentId: true, name: true, role: true }
      });
      console.log('All users:', JSON.stringify(allUsers, null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await prisma.$disconnect();
  await pool.end();
}
run();
