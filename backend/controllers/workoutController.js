import Workout from '../models/Workout.js';

// @desc    Get all workouts for authenticated user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .populate('exercise', 'name category muscleGroup caloriesBurned image')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout by ID for authenticated user
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exercise');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Security check: ensure user owns this workout
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this workout'
      });
    }

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new workout record
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    const { exercise, date, duration, sets, reps, weight, caloriesBurned, notes } = req.body;

    if (!exercise || !duration || caloriesBurned === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Exercise ID, duration, and calories burned are required'
      });
    }

    const workout = await Workout.create({
      user: req.user._id,
      exercise,
      date: date || Date.now(),
      duration,
      sets: sets || 1,
      reps: reps || 10,
      weight: weight || 0,
      caloriesBurned,
      notes: notes || ''
    });

    const populatedWorkout = await workout.populate('exercise', 'name category muscleGroup caloriesBurned image');

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully',
      data: populatedWorkout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout record
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Security check
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workout'
      });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('exercise');

    res.json({
      success: true,
      message: 'Workout updated successfully',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout record
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Security check
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workout'
      });
    }

    await workout.deleteOne();

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
