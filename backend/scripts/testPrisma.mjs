import prisma from '../src/models/db.js';

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log('Products:', products);
  } catch (err) {
    console.error('Prisma test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
