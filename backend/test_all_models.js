const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;

async function checkAllModels() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  // Get all model names from Prisma generated client
  const models = Object.keys(prisma)
    .filter(key => !key.startsWith('_') && !key.startsWith('$') && typeof prisma[key] === 'object' && prisma[key].findFirst);

  console.log('Checking models:', models.join(', '));
  
  let failed = [];
  
  for (const model of models) {
    try {
      console.log(`Checking ${model}...`);
      const record = await prisma[model].findFirst();
      if (record && record.createdAt) {
        console.log(`  ✅ OK (createdAt: ${record.createdAt})`);
      } else {
        console.log(`  ✅ OK (no record or no createdAt field)`);
      }
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
    console.log('All models passed initial findFirst check.');
  }

  await prisma.$disconnect();
  await pool.end();
}

checkAllModels();
