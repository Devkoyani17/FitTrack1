import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: true
    },
    calories: {
      type: Number,
      required: [true, 'Calories count is required']
    },
    protein: {
      type: Number, // grams
      default: 0
    },
    carbohydrates: {
      type: Number, // grams
      default: 0
    },
    fats: {
      type: Number, // grams
      default: 0
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
