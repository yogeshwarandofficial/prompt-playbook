const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig, types } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;

// Apply type parsers BEFORE pool creation
types.setTypeParser(1114, (str) => str); // timestamp without time zone
types.setTypeParser(1184, (str) => str); // timestamp with time zone  
types.setTypeParser(1082, (str) => str); // date

async function testAllDateFields() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  
  const models = Object.keys(prisma)
    .filter(key => !key.startsWith('_') && !key.startsWith('$') && typeof prisma[key] === 'object' && prisma[key]?.findFirst);

  console.log('Testing all date fields across models...\n');
  
  let failed = [];
  
  for (const model of models) {
    try {
      const record = await prisma[model].findFirst();
      if (!record) {
        console.log(`${model}: No records found`);
        continue;
      }
      
      // Check all Date-like fields
      const dateFields = Object.entries(record).filter(([key, val]) => {
        return val !== null && val !== undefined && (
          val instanceof Date ||
          (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val))
        );
      });
      
      const badFields = dateFields.filter(([key, val]) => {
        // Check for {} (empty object)
        return typeof val === 'object' && !(val instanceof Date) && Object.keys(val).length === 0;
      });
      
      if (badFields.length > 0) {
        console.log(`❌ ${model}: BAD DATE FIELDS: ${badFields.map(([k]) => k).join(', ')}`);
        failed.push(`${model}(${badFields.map(([k]) => k).join(',')})`);
      } else {
        const dateInfo = dateFields.map(([k, v]) => `${k}=${v instanceof Date ? v.toISOString() : v}`).join(', ');
        console.log(`✅ ${model}: ${dateInfo || '(no date fields in record)'}`);
      }
    } catch (e) {
      console.error(`❌ ${model}: ERROR: ${e.message.substring(0, 200)}`);
      failed.push(`${model}(ERROR)`);
    }
  }
  
  console.log('\n--- SUMMARY ---');
  if (failed.length > 0) {
    console.log('FAILED:', failed.join(', '));
  } else {
    console.log('All models passed date field check.');
  }
  
  await prisma.$disconnect();
  await pool.end();
}

testAllDateFields();
