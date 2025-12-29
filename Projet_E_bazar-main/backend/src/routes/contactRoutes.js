import express from 'express';
import { submitContact, getAllContacts } from '../controllers/contactController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authenticateToken, authorizeRole('vendeur'), getAllContacts);

export default router;
