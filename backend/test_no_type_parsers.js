// This test deliberately does NOT set type parsers to reproduce the P2023 scenario
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless'); // NOTE: no 'types' import
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;

// NO type parsers set — this is the scenario that might cause P2023

async function testWithoutTypeParsers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  console.log('Testing WITHOUT type parsers (potential P2023 scenario)...\n');
  
  const models = Object.keys(prisma)
    .filter(key => !key.startsWith('_') && !key.startsWith('$') && typeof prisma[key] === 'object' && prisma[key]?.findFirst);

  let failed = [];
  
  for (const model of models) {
    try {
      const record = await prisma[model].findFirst();
      if (!record) {
        console.log(`${model}: No records`);
        continue;
      }
      
      const dateFields = Object.entries(record).filter(([key, val]) => val !== null);
      const badFields = dateFields.filter(([key, val]) => {
        return typeof val === 'object' && !(val instanceof Date) && Object.keys(val || {}).length === 0;
      });
      
      if (badFields.length > 0) {
        console.log(`❌ ${model}: P2023-like {} field: ${badFields.map(([k]) => k).join(', ')}`);
        failed.push(model);
      } else {
        console.log(`✅ ${model}: OK`);
      }
    } catch (e) {
      console.error(`❌ ${model}: ERROR: ${e.message.substring(0, 300)}`);
      if (e.message.includes('P2023')) failed.push(model);
    }
  }
  
  console.log('\n--- SUMMARY ---');
  if (failed.length > 0) {
    console.log('P2023 failures:', failed.join(', '));
  } else {
    console.log('No P2023 observed without type parsers either.');
    console.log('The fix may be pre-emptive OR P2023 only appears in write/upsert operations.');
  }
  
  await prisma.$disconnect();
  await pool.end();
}

testWithoutTypeParsers();
