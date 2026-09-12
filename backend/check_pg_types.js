const { Client } = require('@neondatabase/serverless');
require('dotenv').config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE column_name = 'createdAt'`);
  console.table(res.rows);
  await client.end();
}
run();
