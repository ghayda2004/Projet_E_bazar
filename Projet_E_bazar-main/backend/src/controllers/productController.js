import { db, getNextProductId } from '../models/database.js';

// Get all products
export const getAllProducts = (req, res) => {
  try {
    const { category } = req.query;
    
    let products = db.products;
    
    // Filter by category if provided
    if (category && category !== 'all') {
      products = products.filter(p => p.categoryId === category);
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product
export const getProduct = (req, res) => {
  try {
    const { id } = req.params;
    const product = db.products.find(p => p.id === id);
    
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
export const createProduct = (req, res) => {
  try {
    const { name, price, category, categoryId, image, stock, description, discount } = req.body;

    // Validate required fields
    if (!name || !price || !category || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get seller info
    const seller = db.users.find(u => u.id === req.user.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const newProduct = {
      id: getNextProductId(),
      name,
      price: parseFloat(price),
      rating: 0,
      category,
      categoryId,
      seller: seller.storeName || seller.name,
      sellerId: seller.id,
      image: image || '',
      stock: parseInt(stock) || 0,
      description: description || '',
      discount: discount ? parseInt(discount) : undefined,
      createdAt: new Date(),
    };

    db.products.push(newProduct);

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
export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, categoryId, image, stock, description, discount } = req.body;

    const productIndex = db.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller of this product
    if (db.products[productIndex].sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    // Update product
    if (name) db.products[productIndex].name = name;
    if (price) db.products[productIndex].price = parseFloat(price);
    if (category) db.products[productIndex].category = category;
    if (categoryId) db.products[productIndex].categoryId = categoryId;
    if (image) db.products[productIndex].image = image;
    if (stock !== undefined) db.products[productIndex].stock = parseInt(stock);
    if (description) db.products[productIndex].description = description;
    if (discount !== undefined) db.products[productIndex].discount = parseInt(discount);

    res.json({
      message: 'Product updated successfully',
      product: db.products[productIndex],
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product (seller only - own products)
export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;

    const productIndex = db.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller of this product
    if (db.products[productIndex].sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    db.products.splice(productIndex, 1);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller's products
export const getSellerProducts = (req, res) => {
  try {
    const sellerProducts = db.products.filter(p => p.sellerId === req.user.id);
    res.json(sellerProducts);
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by seller ID (public)
export const getProductsBySellerId = (req, res) => {
  try {
    const { sellerId } = req.params;
    const sellerProducts = db.products.filter(p => p.sellerId === sellerId);
    res.json(sellerProducts);
  } catch (error) {
    console.error('Get products by seller ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
