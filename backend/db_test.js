const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
  console.log('Admin:', admin ? admin.studentId : 'None');
  console.log('Student:', student ? student.id : 'None');
}
main().catch(console.error).finally(() => prisma.$disconnect());
