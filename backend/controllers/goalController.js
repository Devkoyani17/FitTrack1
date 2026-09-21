import Goal from '../models/Goal.js';

// @desc    Get user fitness goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ deadline: 1 });

    const summary = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      cancelled: goals.filter(g => g.status === 'cancelled').length
    };

    res.json({
      success: true,
      summary,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get goal by ID
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this goal'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { title, description, targetValue, currentValue, unit, deadline, status } = req.body;

    if (!title || targetValue === undefined || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, target value, and deadline date are required'
      });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description: description || '',
      targetValue,
      currentValue: currentValue || 0,
      unit: unit || 'kg',
      deadline,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Fitness goal created successfully',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this goal'
      });
    }

    // Auto mark completed if currentValue >= targetValue
    if (req.body.currentValue !== undefined && req.body.currentValue >= (req.body.targetValue || goal.targetValue)) {
      req.body.status = 'completed';
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this goal'
      });
    }

    await goal.deleteOne();

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
