import express from 'express';
import { getAdminStoreStats } from '../controllers/adminStoreController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStoreStats);

export default router;
