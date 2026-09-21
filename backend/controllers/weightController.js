import Weight from '../models/Weight.js';
import User from '../models/User.js';

// @desc    Get weight history & progress summary
// @route   GET /api/weight
// @access  Private
export const getWeightHistory = async (req, res, next) => {
  try {
    const weightLogs = await Weight.find({ user: req.user._id }).sort({ date: -1 });
    const user = await User.findById(req.user._id);

    const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight : user?.weight || 70;
    const previousWeight = weightLogs.length > 1 ? weightLogs[1].weight : currentWeight;
    const startingWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : currentWeight;
    const weightDifference = parseFloat((currentWeight - previousWeight).toFixed(2));
    const totalWeightChange = parseFloat((currentWeight - startingWeight).toFixed(2));

    res.json({
      success: true,
      summary: {
        currentWeight,
        previousWeight,
        weightDifference,
        startingWeight,
        totalWeightChange
      },
      data: weightLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add weight record
// @route   POST /api/weight
// @access  Private
export const addWeight = async (req, res, next) => {
  try {
    const { weight, date } = req.body;

    if (!weight || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid weight in kg is required'
      });
    }

    const weightLog = await Weight.create({
      user: req.user._id,
      weight,
      date: date || Date.now()
    });

    // Automatically sync latest weight to User profile
    await User.findByIdAndUpdate(req.user._id, { weight });

    res.status(201).json({
      success: true,
      message: 'Weight record logged successfully',
      data: weightLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update weight record
// @route   PUT /api/weight/:id
// @access  Private
export const updateWeight = async (req, res, next) => {
  try {
    let weightLog = await Weight.findById(req.params.id);

    if (!weightLog) {
      return res.status(404).json({
        success: false,
        message: 'Weight record not found'
      });
    }

    if (weightLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this weight log'
      });
    }

    weightLog = await Weight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Weight record updated successfully',
      data: weightLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete weight record
// @route   DELETE /api/weight/:id
// @access  Private
export const deleteWeight = async (req, res, next) => {
  try {
    const weightLog = await Weight.findById(req.params.id);

    if (!weightLog) {
      return res.status(404).json({
        success: false,
        message: 'Weight record not found'
      });
    }

    if (weightLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this weight log'
      });
    }

    await weightLog.deleteOne();

    res.json({
      success: true,
      message: 'Weight record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
