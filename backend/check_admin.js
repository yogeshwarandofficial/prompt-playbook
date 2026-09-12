const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({where: {studentId: 'infynuxadmin'}}).then(console.log).finally(() => prisma.$disconnect());
