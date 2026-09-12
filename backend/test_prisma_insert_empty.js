const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();
class IPv4WebSocket extends ws { constructor(a, p) { super(a, p, { family: 4 }); } }
neonConfig.webSocketConstructor = IPv4WebSocket;

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    await prisma.user.create({
      data: {
        studentId: 'test_empty_date',
        name: 'Test',
        email: 'test@example.com',
        passwordHash: 'hash',
        createdAt: {} // Pass empty object!
      }
    });
  } catch (e) {
    console.error('Error name:', e.name);
    console.error('Error message:', e.message);
  }
  await prisma.$disconnect();
  await pool.end();
}
run();
