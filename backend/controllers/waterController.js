import Water from '../models/Water.js';

// @desc    Get water logs for user (defaults to today or date range)
// @route   GET /api/water
// @access  Private
export const getWaterLogs = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = { user: req.user._id };

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    query.date = { $gte: startOfDay, $lte: endOfDay };

    const waterLogs = await Water.find(query).sort({ createdAt: -1 });

    const totalConsumed = waterLogs.reduce((acc, log) => acc + log.amount, 0);
    const goalAmount = 3000; // 3000 ml daily goal standard
    const progressPercentage = Math.min(Math.round((totalConsumed / goalAmount) * 100), 100);

    res.json({
      success: true,
      summary: {
        totalConsumed,
        goalAmount,
        progressPercentage,
        remaining: Math.max(0, goalAmount - totalConsumed)
      },
      data: waterLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add water intake record
// @route   POST /api/water
// @access  Private
export const addWater = async (req, res, next) => {
  try {
    const { amount, date, time } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid water amount in ml is required'
      });
    }

    const water = await Water.create({
      user: req.user._id,
      amount,
      date: date || Date.now(),
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    res.status(201).json({
      success: true,
      message: 'Water intake recorded successfully',
      data: water
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update water log
// @route   PUT /api/water/:id
// @access  Private
export const updateWater = async (req, res, next) => {
  try {
    let water = await Water.findById(req.params.id);

    if (!water) {
      return res.status(404).json({
        success: false,
        message: 'Water record not found'
      });
    }

    if (water.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this water log'
      });
    }

    water = await Water.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Water record updated successfully',
      data: water
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete water log
// @route   DELETE /api/water/:id
// @access  Private
export const deleteWater = async (req, res, next) => {
  try {
    const water = await Water.findById(req.params.id);

    if (!water) {
      return res.status(404).json({
        success: false,
        message: 'Water record not found'
      });
    }

    if (water.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this water log'
      });
    }

    await water.deleteOne();

    res.json({
      success: true,
      message: 'Water record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
