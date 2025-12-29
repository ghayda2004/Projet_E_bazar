import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getProductsBySellerId,
} from '../controllers/productController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/seller', authenticateToken, authorizeRole('vendeur'), getSellerProducts);
router.get('/seller/:sellerId', getProductsBySellerId);
router.get('/:id', getProduct);
router.post('/', authenticateToken, authorizeRole('vendeur'), createProduct);
router.put('/:id', authenticateToken, authorizeRole('vendeur'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('vendeur'), deleteProduct);

export default router;
