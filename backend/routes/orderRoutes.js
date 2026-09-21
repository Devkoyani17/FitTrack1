import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/myorders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
