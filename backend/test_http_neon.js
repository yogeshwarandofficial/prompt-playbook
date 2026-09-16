const { neon } = require('@neondatabase/serverless');

require('dotenv').config();
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('ERROR: DATABASE_URL not set in environment.');
  process.exit(1);
}

console.log('Testing Neon HTTP fetch mode...');
const sql = neon(url);

sql`SELECT 1 as test`
  .then(r => console.log('SUCCESS:', JSON.stringify(r)))
  .catch(e => {
    console.error('FAILED:', e.message);
    if (e.sourceError) console.error('Cause:', e.sourceError.cause?.message || e.sourceError.message);
  });
