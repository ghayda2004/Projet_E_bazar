import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const buyer = await prisma.user.create({
    data: {
      name: 'John Buyer',
      email: 'buyer@example.com',
      password: hashedPassword,
      role: 'client',
      phone: '+216 12 345 678',
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: 'Jane Seller',
      email: 'seller@example.com',
      password: hashedPassword,
      role: 'vendeur',
      phone: '+216 98 765 432',
      storeName: 'Ma Boutique',
      address: 'Tunis, Tunisia',
    },
  });

  console.log('✅ Created users:', { buyer: buyer.email, seller: seller.email });

  // Create products
  const products = [
    {
      name: 'Canapé Luxe',
      price: 1299,
      rating: 4.8,
      category: 'Meubles',
      categoryId: 'furniture',
      emoji: '🛋️',
      stock: 15,
      description: 'Un canapé de luxe confortable',
      sellerId: seller.id,
    },
    {
      name: 'Casque sans fil',
      price: 199,
      rating: 4.6,
      category: 'Électronique',
      categoryId: 'electronics',
      emoji: '🎧',
      stock: 50,
      description: 'Casque audio Bluetooth avec réduction de bruit',
      sellerId: seller.id,
    },
    {
      name: 'Robe d\'été',
      price: 79,
      rating: 4.7,
      category: 'Vêtements',
      categoryId: 'fashion',
      emoji: '👗',
      stock: 30,
      description: 'Robe légère parfaite pour l\'été',
      sellerId: seller.id,
    },
    {
      name: 'Livre de cuisine',
      price: 29,
      rating: 4.5,
      category: 'Livres',
      categoryId: 'books',
      emoji: '📚',
      stock: 100,
      description: '100 recettes faciles et délicieuses',
      sellerId: seller.id,
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log('✅ Created', products.length, 'products');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Buyer: buyer@example.com / password123');
  console.log('Seller: seller@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
