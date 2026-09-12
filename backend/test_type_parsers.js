const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig, types } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;

// Override type parsers BEFORE creating the pool!
// 1114 is timestamp without time zone
// 1184 is timestamp with time zone
// 1082 is date
types.setTypeParser(1114, str => str);
types.setTypeParser(1184, str => str);
types.setTypeParser(1082, str => str);

async function testTypeParsers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const user = await prisma.user.findFirst();
    console.log('User createdAt typeof:', typeof user.createdAt, 'isDate:', user.createdAt instanceof Date);
    console.log('User createdAt value:', user.createdAt);
  } catch (e) {
    console.error(e);
  }
  
  await prisma.$disconnect();
  await pool.end();
}
testTypeParsers();
