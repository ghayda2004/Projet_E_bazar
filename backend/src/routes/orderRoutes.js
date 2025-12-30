import express from 'express';
import {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/user', authenticateToken, getUserOrders);
router.get('/seller', authenticateToken, authorizeRole('vendeur'), getSellerOrders);
router.put('/:id/status', authenticateToken, authorizeRole('vendeur'), updateOrderStatus);

export default router;
