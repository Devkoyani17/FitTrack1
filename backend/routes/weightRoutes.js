import express from 'express';
import {
  getWeightHistory,
  addWeight,
  updateWeight,
  deleteWeight
} from '../controllers/weightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWeightHistory)
  .post(addWeight);

router.route('/:id')
  .put(updateWeight)
  .delete(deleteWeight);

export default router;
