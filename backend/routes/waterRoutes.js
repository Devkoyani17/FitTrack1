import express from 'express';
import {
  getWaterLogs,
  addWater,
  updateWater,
  deleteWater
} from '../controllers/waterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWaterLogs)
  .post(addWater);

router.route('/:id')
  .put(updateWater)
  .delete(deleteWater);

export default router;
