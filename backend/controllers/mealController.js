import Meal from '../models/Meal.js';

// @desc    Get all meals for authenticated user (optionally filtered by date)
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = { user: req.user._id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const meals = await Meal.find(query).sort({ date: -1 });

    // Calculate totals
    const totals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.carbohydrates += meal.carbohydrates || 0;
        acc.fats += meal.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
    );

    res.json({
      success: true,
      count: meals.length,
      totals,
      data: meals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meal by ID
// @route   GET /api/meals/:id
// @access  Private
export const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this meal'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new meal log
// @route   POST /api/meals
// @access  Private
export const createMeal = async (req, res, next) => {
  try {
    const { name, mealType, calories, protein, carbohydrates, fats, date, notes } = req.body;

    if (!name || !mealType || calories === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, meal type, and calories are required'
      });
    }

    const meal = await Meal.create({
      user: req.user._id,
      name,
      mealType,
      calories,
      protein: protein || 0,
      carbohydrates: carbohydrates || 0,
      fats: fats || 0,
      date: date || Date.now(),
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Meal recorded successfully',
      data: meal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update meal log
// @route   PUT /api/meals/:id
// @access  Private
export const updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal'
      });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Meal updated successfully',
      data: meal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meal log
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal'
      });
    }

    await meal.deleteOne();

    res.json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
