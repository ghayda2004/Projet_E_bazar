# SQLite + Prisma Setup for El Bazar

This guide documents the SQLite database setup using Prisma ORM for the El Bazar e-commerce backend.

## 🎯 What Was Done

### 1. Installed Prisma (v5.22.0)

```bash
npm install prisma@5.22.0 --save-dev
npm install @prisma/client@5.22.0
```

**Note:** We're using Prisma v5 instead of v7 because v7 requires additional configuration that's not yet stable for SQLite.

### 2. Initialized Prisma with SQLite

```bash
npx prisma init --datasource-provider sqlite
```

This created:
- `prisma/schema.prisma` - Database schema definition
- `.env` file with `DATABASE_URL="file:./dev.db"`

### 3. Created Database Schema

The `prisma/schema.prisma` file defines two models:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 4. Ran Migration

```bash
npx prisma migrate dev --name init
```

This created:
- `prisma/dev.db` - The actual SQLite database file
- `prisma/migrations/` - Migration history
- Generated Prisma Client for type-safe database access

### 5. Created Prisma Client Wrapper

File: `backend/src/models/db.js`

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

This allows you to import and use Prisma in any controller:

```javascript
import prisma from '../models/db.js';

// Query examples
const products = await prisma.product.findMany();
const product = await prisma.product.findUnique({ where: { id: 1 } });
const newProduct = await prisma.product.create({
  data: { name: "Bag", price: 25.0, stock: 10 }
});
```

### 6. Created Seed Script

File: `prisma/seed.js`

This script populates the database with sample data. Run it with:

```bash
npm run db:seed
```

## 📦 Available Commands

```bash
# Start backend server
npm start

# Start in dev mode (auto-reload)
npm run dev

# Seed the database with sample data
npm run db:seed

# Open Prisma Studio (Django-like admin interface)
npm run db:studio

# Create a new migration after schema changes
npm run db:migrate
```

## 🔧 How to Use Prisma in Your Controllers

### Example: Product Controller with Prisma

```javascript
import prisma from '../models/db.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get one product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description: description || null,
        stock: parseInt(stock) || 0,
      }
    });
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        description,
        stock: parseInt(stock),
      }
    });
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
```

## 🎨 Prisma Studio - The Django Admin Equivalent

Prisma Studio is a visual database browser (like Django Admin). Launch it with:

```bash
npm run db:studio
```

This will open `http://localhost:5555` in your browser where you can:
- ✅ View all tables and data
- ✅ Create new records
- ✅ Edit existing records
- ✅ Delete records
- ✅ Filter and search data

## 📚 Common Prisma Queries

### Finding Records

```javascript
// Find all
const products = await prisma.product.findMany();

// Find with filter
const electronics = await prisma.product.findMany({
  where: { category: 'electronics' }
});

// Find one by ID
const product = await prisma.product.findUnique({
  where: { id: 1 }
});

// Find first matching
const cheapest = await prisma.product.findFirst({
  orderBy: { price: 'asc' }
});
```

### Creating Records

```javascript
// Create one
const product = await prisma.product.create({
  data: {
    name: 'Laptop',
    price: 999.99,
    stock: 5
  }
});

// Create many
await prisma.product.createMany({
  data: [
    { name: 'Mouse', price: 19.99, stock: 50 },
    { name: 'Keyboard', price: 49.99, stock: 30 }
  ]
});
```

### Updating Records

```javascript
// Update one
const updated = await prisma.product.update({
  where: { id: 1 },
  data: { price: 899.99 }
});

// Update many
await prisma.product.updateMany({
  where: { stock: { lt: 10 } },
  data: { stock: 10 }
});
```

### Deleting Records

```javascript
// Delete one
await prisma.product.delete({
  where: { id: 1 }
});

// Delete many
await prisma.product.deleteMany({
  where: { stock: 0 }
});
```

## 🔄 Migrating from In-Memory to Prisma

To migrate your existing controllers:

1. Replace `import { db } from '../models/database.js'` with `import prisma from '../models/db.js'`
2. Replace array operations with Prisma queries:
   - `db.products.find(p => p.id === id)` → `await prisma.product.findUnique({ where: { id } })`
   - `db.products.filter(...)` → `await prisma.product.findMany({ where: {...} })`
   - `db.products.push(newProduct)` → `await prisma.product.create({ data: {...} })`
3. Make your controller functions `async`
4. Add proper error handling

## 🚀 Next Steps

1. **Expand the schema**: Add more models (Order, Cart, Category, etc.)
2. **Add relationships**: Link products to sellers, orders to users
3. **Add validation**: Use Prisma's validation or express-validator
4. **Add seeding**: Expand `prisma/seed.js` with more realistic data
5. **Deploy**: For production, consider PostgreSQL or MySQL instead of SQLite

## 📖 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

**Database Location:** `backend/prisma/dev.db`  
**Prisma Version:** 5.22.0  
**Database Type:** SQLite
