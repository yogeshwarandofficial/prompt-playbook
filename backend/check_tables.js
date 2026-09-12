// Check actual table names in Neon public schema
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function checkTables() {
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  console.log('Tables in Neon neondb public schema:');
  tables.forEach(t => console.log(' -', t.table_name));
}

checkTables().catch(console.error);
