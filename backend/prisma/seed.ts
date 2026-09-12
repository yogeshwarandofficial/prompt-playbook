import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const studentId = process.env.SEED_STUDENT_ID;
  const password = process.env.SEED_STUDENT_PASSWORD;
  const name = process.env.SEED_STUDENT_NAME || 'Seed Student';
  const email = process.env.SEED_STUDENT_EMAIL || 'seed@example.com';

  if (!studentId || !password) {
    console.log('Seed configuration is missing. Skipping seed.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.user.upsert({
    where: { studentId },
    update: {},
    create: {
      studentId,
      name,
      email,
      passwordHash,
      role: 'STUDENT',
    },
  });

  console.log(`Seeded user: ${user.studentId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
