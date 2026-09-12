const { neon } = require('@neondatabase/serverless');

const url = 'postgresql://neondb_owner:npg_OUlSwHEsc0r4@ep-spring-tree-aeob5o5w-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true';

console.log('Testing Neon HTTP fetch mode...');
const sql = neon(url);

sql`SELECT 1 as test`
  .then(r => console.log('SUCCESS:', JSON.stringify(r)))
  .catch(e => {
    console.error('FAILED:', e.message);
    if (e.sourceError) console.error('Cause:', e.sourceError.cause?.message || e.sourceError.message);
  });
