const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log('Creating EventCertificate table...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "EventCertificate" (
        "id" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        "eventName" TEXT NOT NULL,
        "eventDescription" TEXT,
        "certificateNo" TEXT NOT NULL,
        "verificationToken" TEXT NOT NULL,
        "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "EventCertificate_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log('Table created.');

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "EventCertificate_certificateNo_key" ON "EventCertificate"("certificateNo")`;
    console.log('Index 1 created.');

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "EventCertificate_verificationToken_key" ON "EventCertificate"("verificationToken")`;
    console.log('Index 2 created.');

    console.log('Success!');
  } catch (e) {
    console.error(e);
  }
}
main();
