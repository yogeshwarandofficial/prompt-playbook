const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { studentId: 'infy001' }
  });
  console.log('User:', user);
  
  if (user) {
    const sps = await prisma.studentProject.findMany({
      where: { studentId: user.id },
      include: { certificate: true }
    });
    console.log('All StudentProjects:', sps);

    const completed = await prisma.studentProject.findMany({
      where: {
        studentId: user.id,
        OR: [
          { status: 'COMPLETED' },
          { certificate: { isNot: null } }
        ]
      },
      include: { certificate: true }
    });
    console.log('Filtered StudentProjects:', completed);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
