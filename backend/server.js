import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import weightRoutes from './routes/weightRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import adminStoreRoutes from './routes/adminStoreRoutes.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Policy
app.use(
  cors({
    origin: '*', // Allow all origins for dev/testing
    credentials: true
  })
);

// Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'FitTrack Backend is Working',
    tagline: 'Track. Train. Transform. Shop.',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FitTrack API is healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin/store', adminStoreRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FitTrack Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
