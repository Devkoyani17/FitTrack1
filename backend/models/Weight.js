import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    weight: {
      type: Number, // in kg
      required: [true, 'Weight value in kg is required']
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Weight = mongoose.model('Weight', weightSchema);
export default Weight;
