const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);
  
  await prisma.user.update({
    where: { studentId: 'infynuxadmin' },
    data: { passwordHash }
  });
  
  console.log("Admin password reset to: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
