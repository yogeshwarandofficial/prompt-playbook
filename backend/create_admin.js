const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);
  
  await prisma.user.upsert({
    where: { studentId: 'infynuxadmin' },
    update: { passwordHash, role: 'ADMIN' },
    create: {
      studentId: 'infynuxadmin',
      name: 'Admin',
      email: 'admin@infynux.com',
      passwordHash,
      role: 'ADMIN',
    }
  });
  console.log("Admin user created.");
}
main().finally(() => prisma.$disconnect());
