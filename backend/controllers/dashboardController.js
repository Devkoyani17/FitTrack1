import Workout from '../models/Workout.js';
import Meal from '../models/Meal.js';
import Water from '../models/Water.js';
import Weight from '../models/Weight.js';
import Goal from '../models/Goal.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get aggregated dashboard metrics for authenticated user
// @route   GET /api/dashboard
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch User
    const user = await User.findById(userId).select('-password');

    // Date calculations for today & this week
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // 1. Today Workouts
    const todayWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfToday, $lte: endOfToday }
    }).populate('exercise', 'name category');

    const caloriesBurnedToday = todayWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
    const workoutDurationToday = todayWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0);

    // This week workouts count
    const thisWeekWorkoutsCount = await Workout.countDocuments({
      user: userId,
      date: { $gte: startOfWeek }
    });
    const totalWorkoutsCount = await Workout.countDocuments({ user: userId });

    // 2. Today Meals
    const todayMeals = await Meal.find({
      user: userId,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const nutritionSummary = todayMeals.reduce(
      (acc, m) => {
        acc.caloriesConsumed += m.calories || 0;
        acc.protein += m.protein || 0;
        acc.carbohydrates += m.carbohydrates || 0;
        acc.fats += m.fats || 0;
        return acc;
      },
      { caloriesConsumed: 0, protein: 0, carbohydrates: 0, fats: 0 }
    );

    // 3. Today Water
    const todayWaterLogs = await Water.find({
      user: userId,
      date: { $gte: startOfToday, $lte: endOfToday }
    });
    const waterConsumedToday = todayWaterLogs.reduce((acc, w) => acc + w.amount, 0);
    const waterTarget = 3000;
    const waterPercentage = Math.min(Math.round((waterConsumedToday / waterTarget) * 100), 100);

    // 4. Weight Summary
    const weightLogs = await Weight.find({ user: userId }).sort({ date: -1 });
    const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight : user.weight || 70;
    const startingWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : currentWeight;
    const goalWeight = 65; // Standard target reference
    const weightChange = parseFloat((currentWeight - startingWeight).toFixed(2));

    // 5. Goals
    const goals = await Goal.find({ user: userId }).sort({ deadline: 1 });
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');

    // 6. Recommended Store Products based on user fitness goal
    let recCategories = ['Protein Supplements', 'Healthy Foods'];
    if (user.fitnessGoal === 'Muscle Gain') {
      recCategories = ['Protein Supplements', 'Creatine', 'Pre-Workout'];
    } else if (user.fitnessGoal === 'Weight Loss') {
      recCategories = ['Healthy Foods', 'Protein Bars', 'Vitamins & Supplements'];
    } else if (user.fitnessGoal === 'Endurance') {
      recCategories = ['Recovery Products', 'Shakers & Bottles'];
    }

    const recommendedProducts = await Product.find({
      category: { $in: recCategories },
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          fitnessGoal: user.fitnessGoal,
          activityLevel: user.activityLevel,
          profileImage: user.profileImage,
          role: user.role
        },
        today: {
          caloriesBurned: caloriesBurnedToday,
          caloriesConsumed: nutritionSummary.caloriesConsumed,
          workoutDuration: workoutDurationToday,
          water: waterConsumedToday,
          waterTarget,
          waterPercentage
        },
        workouts: {
          todayCount: todayWorkouts.length,
          thisWeekCount: thisWeekWorkoutsCount,
          totalCount: totalWorkoutsCount,
          durationToday: workoutDurationToday,
          caloriesBurnedToday
        },
        nutrition: {
          calories: nutritionSummary.caloriesConsumed,
          protein: nutritionSummary.protein,
          carbs: nutritionSummary.carbohydrates,
          fats: nutritionSummary.fats
        },
        weight: {
          current: currentWeight,
          starting: startingWeight,
          goal: goalWeight,
          change: weightChange
        },
        goals: {
          total: goals.length,
          activeCount: activeGoals.length,
          completedCount: completedGoals.length,
          list: goals
        },
        recommendedProducts
      }
    });
  } catch (error) {
    next(error);
  }
};
