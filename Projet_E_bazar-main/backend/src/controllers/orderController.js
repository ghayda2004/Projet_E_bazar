import { db, getNextOrderId } from '../models/database.js';

// Create order
export const createOrder = (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    console.log('Creating order with items:', items);
    console.log('User ID:', req.user.id);

    // Group items by seller
    const itemsBySeller = {};
    items.forEach(item => {
      const sellerId = item.sellerId;
      if (!sellerId) {
        // Try to find seller from product
        const product = db.products.find(p => String(p.id) === String(item.productId));
        if (product) {
          item.sellerId = product.sellerId;
        }
      }
      
      if (item.sellerId) {
        if (!itemsBySeller[item.sellerId]) {
          itemsBySeller[item.sellerId] = [];
        }
        itemsBySeller[item.sellerId].push(item);
      }
    });

    console.log('Items grouped by seller:', Object.keys(itemsBySeller).length, 'sellers');

    // Create one order per seller
    const createdOrders = [];
    for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
      const total = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Get seller info
      const seller = db.users.find(u => String(u.id) === String(sellerId));
      const sellerName = seller ? (seller.storeName || seller.name) : 'Unknown';

      const newOrder = {
        id: getNextOrderId(),
        userId: req.user.id,
        sellerId: String(sellerId),
        sellerName,
        items: sellerItems,
        total,
        status: 'pending',
        createdAt: new Date(),
      };

      db.orders.push(newOrder);
      createdOrders.push(newOrder);
    }
    
    console.log('Created', createdOrders.length, 'orders');

    res.status(201).json({
      message: `${createdOrders.length} commande(s) créée(s) avec succès`,
      orders: createdOrders,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's orders
export const getUserOrders = (req, res) => {
  try {
    const userOrders = db.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller's orders
export const getSellerOrders = (req, res) => {
  try {
    console.log('Getting orders for seller:', req.user.id);
    
    // Filter orders by sellerId (now directly stored in order)
    const sellerOrders = db.orders.filter(order => 
      String(order.sellerId) === String(req.user.id)
    );
    
    console.log('Found', sellerOrders.length, 'orders for seller');

    res.json(sellerOrders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (seller only)
export const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const orderIndex = db.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    db.orders[orderIndex].status = status;
    db.orders[orderIndex].updatedAt = new Date();

    res.json({
      message: 'Order status updated successfully',
      order: db.orders[orderIndex],
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
