import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    sets: {
      type: Number,
      default: 1
    },
    reps: {
      type: Number,
      default: 10
    },
    weight: {
      type: Number, // weight in kg
      default: 0
    },
    caloriesBurned: {
      type: Number,
      required: true
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

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
