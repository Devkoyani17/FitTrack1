import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number, // in ml
      required: [true, 'Water intake amount in ml is required']
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    time: {
      type: String,
      default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  },
  {
    timestamps: true
  }
);

const Water = mongoose.model('Water', waterSchema);
export default Water;
