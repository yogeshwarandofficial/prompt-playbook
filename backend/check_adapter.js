// Check if Prisma 5.22 supports the adapter option
const { PrismaClient } = require('@prisma/client');

// Try creating with adapter option to see if it's supported
try {
  const fakeAdapter = {};
  const p = new PrismaClient({ adapter: fakeAdapter });
  console.log('adapter option accepted by PrismaClient constructor');
  p.$disconnect().catch(() => {});
} catch(e) {
  console.log('adapter option error:', e.message.substring(0, 200));
}
