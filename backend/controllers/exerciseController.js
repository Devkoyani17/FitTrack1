import Exercise from '../models/Exercise.js';

// @desc    Get all exercises (with filtering and search)
// @route   GET /api/exercises
// @access  Public
export const getExercises = async (req, res, next) => {
  try {
    const { category, muscleGroup, difficulty, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }
    if (muscleGroup) {
      query.muscleGroup = muscleGroup;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exercise by ID
// @route   GET /api/exercises/:id
// @access  Public
export const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new exercise
// @route   POST /api/exercises
// @access  Private/Admin
export const createExercise = async (req, res, next) => {
  try {
    const { name, description, category, muscleGroup, equipment, difficulty, caloriesBurned, image } = req.body;

    const exercise = await Exercise.create({
      name,
      description,
      category,
      muscleGroup,
      equipment,
      difficulty,
      caloriesBurned,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private/Admin
export const updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Exercise updated successfully',
      data: updatedExercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private/Admin
export const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    await exercise.deleteOne();

    res.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
