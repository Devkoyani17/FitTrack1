import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Yoga'],
      default: 'Strength'
    },
    muscleGroup: {
      type: String,
      required: [true, 'Muscle group is required'],
      enum: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body'],
      default: 'Full Body'
    },
    equipment: {
      type: String,
      default: 'Bodyweight'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    caloriesBurned: {
      type: Number, // estimated calories burned per 30 mins
      default: 150
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
