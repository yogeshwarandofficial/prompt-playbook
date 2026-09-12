const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { key: 'web', image: 'https://res.cloudinary.com/a2tsmpqh/image/upload/f_auto,q_auto/ChatGPT_Image_Sep_9_2026_11_32_31_AM' },
  { key: 'cloud', image: 'https://res.cloudinary.com/a2tsmpqh/image/upload/v1788934312/ChatGPT_Image_Sep_9_2026_11_41_38_AM.png' },
  { key: 'app', image: 'https://res.cloudinary.com/a2tsmpqh/image/upload/v1788934427/ChatGPT_Image_Sep_9_2026_11_43_43_AM.png' }
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
