// In-memory database for development
// In production, replace with a real database (MongoDB, PostgreSQL, etc.)

export const db = {
  users: [
    {
      id: '1',
      name: 'John Buyer',
      email: 'buyer@example.com',
      password: '$2a$10$f/RZhWT6nl8hSv04W..heebTx12N6nX26zeMJwtZT/8jZTeg9Znfy', // password123
      role: 'client',
      phone: '+216 12 345 678',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Jane Seller',
      email: 'seller@example.com',
      password: '$2a$10$f/RZhWT6nl8hSv04W..heebTx12N6nX26zeMJwtZT/8jZTeg9Znfy', // password123
      role: 'vendeur',
      phone: '+216 98 765 432',
      storeName: 'Ma Boutique',
      address: 'Tunis, Tunisia',
      createdAt: new Date('2024-01-01'),
    },
  ],
  products: [
    {
      id: '1',
      name: 'Canapé Luxe',
      price: 1299,
      rating: 4.8,
      category: 'Meubles',
      categoryId: 'furniture',
      seller: 'Premium Furniture Co',
      sellerId: '2',
      emoji: '🛋️',
      stock: 15,
      description: 'Un canapé de luxe confortable',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      name: 'Casque sans fil',
      price: 199,
      rating: 4.6,
      category: 'Électronique',
      categoryId: 'electronics',
      seller: 'Tech World Store',
      sellerId: '2',
      discount: 20,
      emoji: '🎧',
      stock: 30,
      description: 'Casque Bluetooth haute qualité',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      name: 'Table à manger',
      price: 899,
      rating: 4.9,
      category: 'Meubles',
      categoryId: 'furniture',
      seller: 'Premium Furniture Co',
      sellerId: '2',
      emoji: '🪑',
      stock: 10,
      description: 'Table élégante pour 6 personnes',
      createdAt: new Date('2024-01-20'),
    },
  ],
  orders: [
    {
      id: '1',
      userId: '1',
      items: [
        {
          productId: '1',
          name: 'Canapé Luxe',
          price: 1299,
          quantity: 1,
        },
      ],
      total: 1299,
      status: 'pending',
      createdAt: new Date('2024-02-01'),
    },
  ],
  contacts: [],
};

let nextUserId = 3;
let nextProductId = 4;
let nextOrderId = 2;
let nextContactId = 1;

export const getNextUserId = () => String(nextUserId++);
export const getNextProductId = () => String(nextProductId++);
export const getNextOrderId = () => String(nextOrderId++);
export const getNextContactId = () => String(nextContactId++);
