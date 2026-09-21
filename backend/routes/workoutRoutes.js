import express from 'express';
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All workout routes require login

router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;
