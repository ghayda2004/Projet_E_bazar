import express from 'express';
import { register, login, getProfile, updateProfile, getSellers, getSellerById } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/sellers', getSellers);
router.get('/sellers/:id', getSellerById);

export default router;
