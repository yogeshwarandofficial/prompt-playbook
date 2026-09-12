const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;

async function checkAllModelsMany() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  const models = Object.keys(prisma)
    .filter(key => !key.startsWith('_') && !key.startsWith('$') && typeof prisma[key] === 'object' && prisma[key].findMany);

  console.log('Checking all rows across models...');
  
  let failed = [];
  
  for (const model of models) {
    try {
      console.log(`Checking all rows in ${model}...`);
      const records = await prisma[model].findMany();
      console.log(`  ✅ OK (${records.length} records)`);
    } catch (e) {
      console.error(`  ❌ FAILED: ${e.message}`);
      if (e.message.includes('P2023') || e.message.includes('createdAt')) {
        failed.push(model);
      }
    }
  }
  
  console.log('\n--- SUMMARY ---');
  if (failed.length > 0) {
    console.log('Failed models:', failed.join(', '));
  } else {
    console.log('All models passed findMany check.');
  }

  await prisma.$disconnect();
  await pool.end();
}

checkAllModelsMany();
