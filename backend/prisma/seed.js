import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: 'Canapé Luxe',
      description: 'Un canapé de luxe confortable et élégant',
      price: 1299,
      stock: 15,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Casque sans fil',
      description: 'Casque Bluetooth haute qualité avec réduction de bruit',
      price: 199,
      stock: 30,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Table à manger',
      description: 'Table élégante en bois massif pour 6 personnes',
      price: 899,
      stock: 10,
    },
  });

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      name: 'John Buyer',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'seller@example.com',
      name: 'Jane Seller',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${3} products and ${2} users`);
  console.log('\nProducts:', { product1, product2, product3 });
  console.log('\nUsers:', { user1, user2 });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
