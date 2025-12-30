import prisma from '../models/db.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const where = {};
    // basic example: if category provided, try to filter by category field (if present)
    if (category && category !== 'all') {
      where['categoryId'] = category; // this will be ignored by Prisma if field doesn't exist
    }

    const products = await prisma.product.findMany({ where });
    res.json(products);
  } catch (error) {
    console.error('Get products (prisma) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product (prisma) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
