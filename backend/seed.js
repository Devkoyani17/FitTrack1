import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Exercise from './models/Exercise.js';
import Workout from './models/Workout.js';
import Meal from './models/Meal.js';
import Water from './models/Water.js';
import Weight from './models/Weight.js';
import Goal from './models/Goal.js';
import Product from './models/Product.js';

dotenv.config();

const sampleExercises = [
  {
    name: 'Bench Press',
    description: 'Classic barbell press for building chest strength and mass.',
    category: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Barbell & Bench',
    difficulty: 'Intermediate',
    caloriesBurned: 220,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500'
  },
  {
    name: 'Incline Dumbbell Press',
    description: 'Targets upper chest development using dumbbells.',
    category: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    caloriesBurned: 190,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500'
  },
  {
    name: 'Deadlift',
    description: 'Full body compound exercise strengthening posterior chain and back.',
    category: 'Strength',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    caloriesBurned: 300,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'
  },
  {
    name: 'Lat Pulldown',
    description: 'Cable pulldown targeting latissimus dorsi muscle growth.',
    category: 'Strength',
    muscleGroup: 'Back',
    equipment: 'Cable Machine',
    difficulty: 'Beginner',
    caloriesBurned: 160,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500'
  },
  {
    name: 'Barbell Squat',
    description: 'The king of leg exercises targeting quadriceps, hamstrings and glutes.',
    category: 'Strength',
    muscleGroup: 'Legs',
    equipment: 'Barbell & Squat Rack',
    difficulty: 'Advanced',
    caloriesBurned: 280,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500'
  },
  {
    name: 'Treadmill HIIT Run',
    description: 'High intensity interval sprint cycles on treadmill for cardio endurance.',
    category: 'HIIT',
    muscleGroup: 'Full Body',
    equipment: 'Treadmill',
    difficulty: 'Intermediate',
    caloriesBurned: 380,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500'
  },
  {
    name: 'Vinyasa Yoga Flow',
    description: 'Dynamic breath-synchronized movement improving flexibility and core control.',
    category: 'Yoga',
    muscleGroup: 'Core',
    equipment: 'Yoga Mat',
    difficulty: 'Beginner',
    caloriesBurned: 140,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500'
  },
  {
    name: 'Plank Hold',
    description: 'Isometric core stability exercise for abdominal strength.',
    category: 'Strength',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    caloriesBurned: 100,
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500'
  }
];

const sampleProducts = [
  {
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    description: 'Premium whey protein isolate powder for fast muscle recovery and growth.',
    category: 'Protein Supplements',
    brand: 'Optimum Nutrition',
    price: 3499,
    discountPrice: 2999,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'],
    rating: 4.8,
    numReviews: 184,
    ingredients: 'Whey Protein Isolate, Whey Concentrate, Cocoa, Natural Flavors',
    weight: '1 kg',
    flavor: 'Double Rich Chocolate',
    tags: ['whey', 'protein', 'muscle', 'bestseller']
  },
  {
    name: 'Muscletech Nitrotech Performance Series',
    description: 'Advanced lean musclebuilding formula enriched with creatine and BCAAs.',
    category: 'Protein Supplements',
    brand: 'MuscleTech',
    price: 3999,
    discountPrice: 3499,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'],
    rating: 4.6,
    numReviews: 92,
    ingredients: 'Whey Peptides, Whey Isolate, Creatine Monohydrate',
    weight: '1.8 kg',
    flavor: 'Milk Chocolate',
    tags: ['whey', 'creatine', 'muscletech']
  },
  {
    name: 'Cellucor C4 Original Pre-Workout Powder',
    description: 'Explosive energy and endurance formula powered by Beta-Alanine and Caffeine.',
    category: 'Pre-Workout',
    brand: 'Cellucor',
    price: 2499,
    discountPrice: 1999,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=500'],
    rating: 4.7,
    numReviews: 110,
    ingredients: 'Caffeine, Beta-Alanine, Arginine Alpha-Ketoglutarate',
    weight: '390g',
    flavor: 'Fruit Punch',
    tags: ['energy', 'preworkout', 'caffeine']
  },
  {
    name: 'Creapure Micronized Creatine Monohydrate',
    description: '100% pure pharmaceutical grade creatine monohydrate for power and strength.',
    category: 'Creatine',
    brand: 'FitTrack Nutrition',
    price: 1299,
    discountPrice: 999,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'],
    rating: 4.9,
    numReviews: 215,
    ingredients: 'Unflavored 100% Pure Creatine Monohydrate',
    weight: '250g',
    flavor: 'Unflavored',
    tags: ['creatine', 'strength', 'power']
  },
  {
    name: 'Protein Crunch High Protein Bars (Box of 12)',
    description: 'Delicious low-sugar protein bar delivering 20g protein per bar.',
    category: 'Protein Bars',
    brand: 'FitCrunch',
    price: 1499,
    discountPrice: 1199,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1622484210800-a4005b8b93bc?w=500'],
    rating: 4.5,
    numReviews: 64,
    ingredients: 'Milk Protein Blend, Dark Chocolate Coating, Almonds',
    weight: '720g',
    flavor: 'Cookies & Cream',
    tags: ['snack', 'bar', 'low-sugar']
  },
  {
    name: 'Heavy Duty Adjustable Dumbbell Set (24kg)',
    description: 'All-in-one selectorized dumbbell system replacing 15 sets of weights.',
    category: 'Gym Equipment',
    brand: 'FitTrack Iron',
    price: 14999,
    discountPrice: 12499,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500'],
    rating: 4.9,
    numReviews: 48,
    ingredients: 'Steel, High-Density Rubber',
    weight: '24 kg',
    flavor: '',
    tags: ['dumbbell', 'home gym', 'equipment']
  },
  {
    name: 'Ergonomic Stainless Steel Shaker Bottle 750ml',
    description: 'Leak-proof insulated stainless steel shaker with stainless steel blending ball.',
    category: 'Shakers & Bottles',
    brand: 'FitTrack Gear',
    price: 899,
    discountPrice: 699,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1556881286-fc6915169721?w=500'],
    rating: 4.7,
    numReviews: 130,
    ingredients: 'Food Grade Stainless Steel, BPA Free Lid',
    weight: '750 ml',
    flavor: '',
    tags: ['shaker', 'bottle', 'bpa free']
  },
  {
    name: 'Non-Slip Eco-Friendly TPE Yoga Mat 6mm',
    description: 'High-density cushioned non-slip yoga mat with alignment guidelines.',
    category: 'Yoga Products',
    brand: 'FitTrack Mind',
    price: 1899,
    discountPrice: 1399,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    rating: 4.8,
    numReviews: 87,
    ingredients: 'Eco TPE Foam',
    weight: '1 kg',
    flavor: '',
    tags: ['yoga', 'mat', 'pilates']
  },
  {
    name: 'Deep Tissue Percussion Massage Gun',
    description: 'Ultra-quiet 30-speed muscle recovery massage gun with 6 massage heads.',
    category: 'Recovery Products',
    brand: 'FitTrack Recovery',
    price: 6999,
    discountPrice: 4999,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'],
    rating: 4.9,
    numReviews: 76,
    ingredients: 'Brushless Motor, Lithium Ion Battery',
    weight: '900g',
    flavor: '',
    tags: ['recovery', 'massage', 'therapy']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fittrack');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await Workout.deleteMany({});
    await Meal.deleteMany({});
    await Water.deleteMany({});
    await Weight.deleteMany({});
    await Goal.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing database records.');

    // Seed Admin User
    const adminUser = await User.create({
      name: 'FitTrack Admin',
      email: 'admin@fittrack.com',
      password: 'adminpassword123',
      role: 'admin',
      age: 30,
      gender: 'Male',
      height: 180,
      weight: 78,
      fitnessGoal: 'Muscle Gain',
      activityLevel: 'Very Active'
    });

    // Seed Demo User A
    const userA = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'user',
      age: 26,
      gender: 'Male',
      height: 178,
      weight: 75,
      fitnessGoal: 'Muscle Gain',
      activityLevel: 'Moderately Active'
    });

    // Seed Demo User B (for user isolation testing)
    const userB = await User.create({
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'user',
      age: 24,
      gender: 'Female',
      height: 165,
      weight: 62,
      fitnessGoal: 'Weight Loss',
      activityLevel: 'Lightly Active'
    });

    console.log('Created Users: Admin, Alex (User A), Sarah (User B).');

    // Seed Exercises
    const exercises = await Exercise.insertMany(sampleExercises);
    console.log(`Inserted ${exercises.length} sample exercises.`);

    // Seed Products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} sample store products.`);

    // Seed User A Workouts
    await Workout.create([
      {
        user: userA._id,
        exercise: exercises[0]._id, // Bench Press
        date: new Date(),
        duration: 45,
        sets: 4,
        reps: 10,
        weight: 70,
        caloriesBurned: 220,
        notes: 'Felt strong, pushed last rep!'
      },
      {
        user: userA._id,
        exercise: exercises[4]._id, // Barbell Squat
        date: new Date(Date.now() - 86400000), // yesterday
        duration: 50,
        sets: 4,
        reps: 8,
        weight: 95,
        caloriesBurned: 280,
        notes: 'Heavy leg session'
      }
    ]);

    // Seed User A Meals
    await Meal.create([
      {
        user: userA._id,
        name: 'Oatmeal with Whey & Banana',
        mealType: 'Breakfast',
        calories: 450,
        protein: 35,
        carbohydrates: 55,
        fats: 8,
        date: new Date()
      },
      {
        user: userA._id,
        name: 'Grilled Chicken Breast & Quinoa',
        mealType: 'Lunch',
        calories: 620,
        protein: 52,
        carbohydrates: 60,
        fats: 12,
        date: new Date()
      }
    ]);

    // Seed User A Water
    await Water.create([
      { user: userA._id, amount: 500, time: '08:30 AM' },
      { user: userA._id, amount: 750, time: '11:15 AM' },
      { user: userA._id, amount: 600, time: '02:45 PM' }
    ]);

    // Seed User A Weight history
    await Weight.create([
      { user: userA._id, weight: 77, date: new Date(Date.now() - 30 * 86400000) },
      { user: userA._id, weight: 76, date: new Date(Date.now() - 15 * 86400000) },
      { user: userA._id, weight: 75, date: new Date() }
    ]);

    // Seed User A Goals
    await Goal.create([
      {
        user: userA._id,
        title: 'Reach 80kg Lean Muscle',
        description: 'Gain lean muscle mass while keeping body fat low.',
        targetValue: 80,
        currentValue: 75,
        unit: 'kg',
        deadline: new Date(Date.now() + 90 * 86400000),
        status: 'active'
      },
      {
        user: userA._id,
        title: 'Bench Press 100kg',
        description: 'Hit 100kg single rep max on barbell bench press.',
        targetValue: 100,
        currentValue: 85,
        unit: 'kg',
        deadline: new Date(Date.now() + 60 * 86400000),
        status: 'active'
      }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
