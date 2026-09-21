import express from 'express';
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} from '../controllers/exerciseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getExercises)
  .post(protect, admin, createExercise);

router.route('/:id')
  .get(getExerciseById)
  .put(protect, admin, updateExercise)
  .delete(protect, admin, deleteExercise);

export default router;
