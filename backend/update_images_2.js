const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { key: 'ai', image: 'https://res.cloudinary.com/ccadmuh0/image/upload/v1788935578/ChatGPT_Image_Sep_9_2026_12_00_14_PM_2.png' },
  { key: 'marketing', image: 'https://res.cloudinary.com/ccadmuh0/image/upload/v1788935575/ChatGPT_Image_Sep_9_2026_12_00_15_PM_3.png' },
  { key: 'video', image: 'https://res.cloudinary.com/ccadmuh0/image/upload/v1788935577/ChatGPT_Image_Sep_9_2026_12_00_15_PM_4.png' }
];

async function main() {
  for (const u of updates) {
    await prisma.course.updateMany({
      where: { key: u.key },
      data: { image: u.image }
    });
    console.log(`Updated ${u.key}`);
  }
}

main().finally(() => prisma.$disconnect());
