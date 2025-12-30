import prisma from '../models/db.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    // Build where clause for filtering
    const where = {};
    if (category && category !== 'all') {
      where.categoryId = category;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create product (seller only)
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, categoryId, image, stock, description, discount, emoji } = req.body;

    // Validate required fields
    if (!name || !price || !category || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get seller info
    const seller = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        categoryId,
        image: image || '',
        stock: parseInt(stock) || 0,
        description: description || '',
        discount: discount ? parseInt(discount) : null,
        emoji: emoji || null,
        rating: 0,
        sellerId: seller.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product (seller only - own products)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, categoryId, image, stock, description, discount, emoji } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller of this product
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (image !== undefined) updateData.image = image;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (description !== undefined) updateData.description = description;
    if (discount !== undefined) updateData.discount = discount ? parseInt(discount) : null;
    if (emoji !== undefined) updateData.emoji = emoji;

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        }
      }
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product (seller only - own products)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller of this product
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    // Delete product
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller's products
export const getSellerProducts = async (req, res) => {
  try {
    const sellerProducts = await prisma.product.findMany({
      where: { sellerId: req.user.id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(sellerProducts);
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by seller ID (public)
export const getProductsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const sellerProducts = await prisma.product.findMany({
      where: { sellerId: parseInt(sellerId) },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(sellerProducts);
  } catch (error) {
    console.error('Get products by seller ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
