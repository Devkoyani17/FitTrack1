import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    targetValue: {
      type: Number,
      required: [true, 'Target value is required']
    },
    currentValue: {
      type: Number,
      default: 0
    },
    unit: {
      type: String, // kg, workouts, ml, calories, etc.
      default: 'kg'
    },
    deadline: {
      type: Date,
      required: [true, 'Target deadline date is required']
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
