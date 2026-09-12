const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.course.findMany().then(courses => {
  console.log(courses.map(c => ({ id: c.id, name: c.name, key: c.key })));
}).finally(() => prisma.$disconnect());
