import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const prisma = new PrismaClient();

  console.log('Testing connection to PostgreSQL...');
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Query result:', result);
    console.log('Connection successful!');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
