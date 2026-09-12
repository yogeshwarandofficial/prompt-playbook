const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Find all STUDENT users
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { courses: { include: { course: true } } }
    });

    console.log('\n=== STUDENTS ===');
    for (const s of students) {
      console.log(`\n  ${s.name} (${s.studentId}) | domainId: ${s.domainId}`);
      console.log(`  Courses assigned: ${s.courses.length}`);
      s.courses.forEach(sc => console.log(`    - ${sc.course.name}`));
    }

    // For students with domainId but no course, try to assign
    for (const s of students) {
      if (s.domainId && s.courses.length === 0) {
        console.log(`\n  Attempting to assign course for ${s.name} with domain: "${s.domainId}"...`);
        const course = await prisma.course.findFirst({
          where: {
            OR: [
              { name: { equals: s.domainId, mode: 'insensitive' } },
              { name: { contains: s.domainId, mode: 'insensitive' } },
            ]
          }
        });

        if (course) {
          await prisma.studentCourse.upsert({
            where: { studentId_courseId: { studentId: s.id, courseId: course.id } },
            update: {},
            create: { studentId: s.id, courseId: course.id }
          });
          console.log(`  ✅ Assigned "${course.name}" to ${s.name}`);
        } else {
          console.log(`  ⚠️  No matching course found for domain: "${s.domainId}"`);
          console.log('  Available courses:');
          const all = await prisma.course.findMany({ select: { name: true } });
          all.forEach(c => console.log(`    - ${c.name}`));
        }
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
