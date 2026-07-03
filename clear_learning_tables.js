const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "Course"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "Internship"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "Webinar"`);
    console.log('Successfully cleared Course, Internship, and Webinar tables.');
  } catch (e) {
    console.error('Error clearing tables:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
