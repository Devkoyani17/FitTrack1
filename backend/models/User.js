import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    age: {
      type: Number,
      default: 25
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Male'
    },
    height: {
      type: Number, // in cm
      default: 175
    },
    weight: {
      type: Number, // in kg
      default: 70
    },
    fitnessGoal: {
      type: String,
      enum: ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance', 'General Fitness'],
      default: 'General Fitness'
    },
    activityLevel: {
      type: String,
      enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'],
      default: 'Moderately Active'
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
