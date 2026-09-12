const { Pool, neonConfig, types } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

class IPv4WebSocket extends ws {
  constructor(a, p) { super(a, p, { family: 4 }); }
}
neonConfig.webSocketConstructor = IPv4WebSocket;

// Register type parsers BEFORE pool creation
let parserCalled1114 = false;
let parserCalled1184 = false;

types.setTypeParser(1114, (str) => {
  parserCalled1114 = true;
  return str; // return raw string
});
types.setTypeParser(1184, (str) => {
  parserCalled1184 = true;
  return str; // return raw string
});

async function test() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // Query with explicit type cast
    const res = await pool.query('SELECT "createdAt", pg_typeof("createdAt"::text) as pg_type FROM "User" LIMIT 1');
    const row = res.rows[0];
    console.log('Row:', row);
    console.log('createdAt typeof:', typeof row?.createdAt);
    console.log('is Date?', row?.createdAt instanceof Date);
    console.log('1114 parser was called:', parserCalled1114);
    console.log('1184 parser was called:', parserCalled1184);
    
    // Also check the OID
    const oidRes = await pool.query(
      'SELECT attname, atttypid FROM pg_attribute WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = \'User\') AND attname = \'createdAt\''
    );
    console.log('Column OID info:', oidRes.rows);
  } catch(e) { 
    console.error('Error:', e.message); 
  }
  await pool.end();
}
test();
