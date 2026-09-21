import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.age = req.body.age !== undefined ? req.body.age : user.age;
      user.gender = req.body.gender || user.gender;
      user.height = req.body.height !== undefined ? req.body.height : user.height;
      user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
      user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
      user.activityLevel = req.body.activityLevel || user.activityLevel;
      user.profileImage = req.body.profileImage || user.profileImage;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          age: updatedUser.age,
          gender: updatedUser.gender,
          height: updatedUser.height,
          weight: updatedUser.weight,
          fitnessGoal: updatedUser.fitnessGoal,
          activityLevel: updatedUser.activityLevel,
          profileImage: updatedUser.profileImage
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    next(error);
  }
};
