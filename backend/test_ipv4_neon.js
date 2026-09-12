// Test: does neon() HTTP client work with setDefaultResultOrder('ipv4first')?
const { setDefaultResultOrder } = require('dns');
setDefaultResultOrder('ipv4first');

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function test() {
  console.log('Testing neon() HTTP with ipv4first DNS order...');
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const result = await sql`SELECT 1 as ok`;
    console.log('SELECT 1 result:', result);
    
    const users = await sql`SELECT COUNT(*) as count FROM "User"`;
    console.log('User count:', users[0].count);
    
    console.log('\n✅ neon() HTTP works with ipv4first DNS');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
  }
}

test();
