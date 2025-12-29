import prisma from '../models/db.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    console.log('Creating order with items:', items);
    console.log('User ID:', req.user.id);

    // Group items by seller
    const itemsBySeller = {};
    for (const item of items) {
      let sellerId = item.sellerId;
      
      if (!sellerId && item.productId) {
        // Try to find seller from product
        const product = await prisma.product.findUnique({
          where: { id: parseInt(item.productId) }
        });
        if (product) {
          sellerId = product.sellerId;
        }
      }
      
      if (sellerId) {
        if (!itemsBySeller[sellerId]) {
          itemsBySeller[sellerId] = [];
        }
        itemsBySeller[sellerId].push({
          ...item,
          sellerId: parseInt(sellerId)
        });
      }
    }

    console.log('Items grouped by seller:', Object.keys(itemsBySeller).length, 'sellers');

    // Create one order per seller
    const createdOrders = [];
    for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
      const total = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order with items
      const newOrder = await prisma.order.create({
        data: {
          userId: req.user.id,
          sellerId: parseInt(sellerId),
          total,
          status: 'pending',
          items: {
            create: sellerItems.map(item => ({
              productId: parseInt(item.productId),
              name: item.name,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              image: item.image || null,
            }))
          }
        },
        include: {
          items: true,
          seller: {
            select: {
              id: true,
              name: true,
              storeName: true,
            }
          }
        }
      });

      createdOrders.push(newOrder);
    }
    
    console.log('Created', createdOrders.length, 'orders');

    res.status(201).json({
      message: `${createdOrders.length} commande(s) créée(s) avec succès`,
      orders: createdOrders,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userOrders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
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

    res.json(userOrders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller's orders
export const getSellerOrders = async (req, res) => {
  try {
    console.log('Getting orders for seller:', req.user.id);
    
    const sellerOrders = await prisma.order.findMany({
      where: { sellerId: req.user.id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Found', sellerOrders.length, 'orders for seller');

    res.json(sellerOrders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (seller only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        items: true,
        seller: {
          select: {
            id: true,
            name: true,
            storeName: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
