# FitTrack — Full-Stack Fitness Management & E-Commerce Platform

> **"Track. Train. Transform. Shop."**

FitTrack is an enterprise-grade MERN (MongoDB, Express.js, React.js, Node.js) web application combining a **Fitness Management System** (workout routines, exercise library, macro nutrition, water intake, body weight progress, target goals, aggregated statistics) with an integrated **Fitness E-Commerce Module (FitTrack Store)** for protein supplements, gym equipment, pre-workouts, and fitness apparel.

---

## 🌟 Key Features

### 🏋️ Fitness Management Module
- **User Authentication & Authorization**: Secure JWT authentication, bcrypt password hashing, and role-based access control (`user` vs `admin`).
- **Aggregated User Dashboard**: Single-endpoint aggregated summary showing calories burned/consumed, workout duration, hydration progress, body weight trends, active goals, and goal-aligned store recommendations.
- **Workout Logging**: Track exercises, sets, reps, weight lifted, duration, estimated calories burned, and session notes with strict user data isolation.
- **Exercise Master Library**: Search and filter exercises by category (*Strength, Cardio, HIIT, Yoga, Flexibility*) and target muscle group (*Chest, Back, Legs, Core, Shoulders, Arms*).
- **Macro Nutrition Tracker**: Log daily meals (*Breakfast, Lunch, Dinner, Snack*) with real-time calorie, protein, carbohydrate, and fat breakdown.
- **Hydration Visualizer**: Daily water tracker with visual percentage progress bar vs 3000ml goal and quick-add presets.
- **Body Weight Tracker**: Track weigh-in history, current weight, starting weight, and net weight change over time.
- **Fitness Goals**: Set target values, deadlines, and automatically update status (*active, completed, cancelled*).

### 🛒 FitTrack Store E-Commerce Module
- **Product Catalog**: Browse 12 specialized categories (*Protein Supplements, Creatine, Pre-Workout, Protein Bars, Healthy Foods, Gym Equipment, Workout Accessories, Shakers & Bottles, Fitness Wear, Yoga Products, Recovery Products*).
- **Search, Filter & Multi-Criteria Sorting**: Search products by name/brand/tags, filter by category/price range, and sort by price (*low-to-high, high-to-low*), rating, or popularity.
- **Product Details & Verified Buyer Reviews**: High-resolution gallery, nutrition specs, stock status, discount percentage, star ratings, and review submission restricted to verified purchasers.
- **Shopping Cart**: Real-time quantity adjustments, subtotal, store discounts, estimated shipping, and server-side cart synchronization.
- **Checkout & Cash on Delivery**: Collect customer info, delivery address, order summary, and place orders with server-side stock deduction and price verification.
- **Visual Order Timeline Tracker**: Step-by-step progress indicator (*Order Placed → Confirmed → Processing → Shipped → Delivered*).
- **Wishlist**: Save favorite items for quick access and instant add-to-cart.
- **Admin Store Management Portal**: Dedicated administrative portal to manage product inventory, update stock levels, review total sales analytics, and update order fulfillment statuses.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Context API (`AuthContext`, `CartContext`), Lucide Icons, Vanilla CSS Design System ("Cyber Fitness & E-Commerce" Dark Theme).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` password hashing.
- **Environment & Build Tools**: Vite, dotenv, CORS middleware.

---

## 📁 Repository Structure

```
FitTrack/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   ├── Workout.js            # Workout schema (user ref, exercise ref)
│   │   ├── Exercise.js           # Master exercise library schema
│   │   ├── Meal.js               # Meal & macro nutrition schema
│   │   ├── Water.js              # Water hydration log schema
│   │   ├── Weight.js             # Weight progress history schema
│   │   ├── Goal.js               # Fitness goals schema
│   │   ├── Product.js            # E-commerce store product schema
│   │   ├── Cart.js               # User shopping cart schema
│   │   ├── Order.js              # Order & shipping schema
│   │   ├── Wishlist.js           # User wishlist schema
│   │   └── Review.js             # Verified buyer review schema
│   ├── controllers/              # REST API controllers
│   ├── routes/                   # Express route definitions
│   ├── middleware/               # Auth, Admin, and Error handling middleware
│   ├── utils/
│   │   └── generateToken.js      # JWT signing helper
│   ├── seed.js                   # Database populator script
│   ├── server.js                 # Main Express server entrypoint
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, StatCard, ProductCard, OrderTimeline, etc.
│   │   ├── pages/                # Dashboard, Workouts, Meals, StoreHome, Checkout, Orders, etc.
   │   ├── layouts/              # DashboardLayout frame
│   │   ├── services/
│   │   │   └── api.js            # Centralized API fetch client
│   │   ├── context/              # AuthContext & CartContext
│   │   ├── index.css             # Design tokens & glassmorphism utilities
│   │   ├── App.jsx               # React Router configuration
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started & Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally at `mongodb://127.0.0.1:27017/fittrack` OR a MongoDB Atlas cluster URI.

### 1. Environment Setup

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fittrack
JWT_SECRET=fittrack_super_secret_jwt_key_2026_xyz
NODE_ENV=development
```

### 2. Backend Setup & Database Seeding

```bash
cd backend
npm install

# Populate MongoDB with sample users, exercises, workouts, meals, water, weight logs, goals & store products:
node seed.js

# Start the Express server:
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start the Vite React development server:
npm run dev
# Frontend running at http://localhost:5173
```

---

## 🧪 Postman API Testing Documentation

Base URL: `http://localhost:5000/api`

### 🔑 Authentication APIs
| Method | Endpoint | Access | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | `{ "name": "John", "email": "john@example.com", "password": "password123" }` |
| `POST` | `/auth/login` | Public | `{ "email": "alex@example.com", "password": "password123" }` |
| `GET` | `/auth/me` | Protected | Bearer Token in `Authorization` header |

### 👤 User Profile APIs
| Method | Endpoint | Access | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/profile` | Protected | — |
| `PUT` | `/users/profile` | Protected | `{ "height": 180, "weight": 76, "fitnessGoal": "Muscle Gain" }` |

### 🏋️ Workouts & Exercises APIs
| Method | Endpoint | Access | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/exercises` | Public | Optional query: `?category=Strength&search=bench` |
| `POST` | `/exercises` | Admin | `{ "name": "Cable Fly", "category": "Strength", "muscleGroup": "Chest" }` |
| `GET` | `/workouts` | Protected | Returns authenticated user's workouts |
| `POST` | `/workouts` | Protected | `{ "exercise": "<EXERCISE_ID>", "duration": 45, "caloriesBurned": 250, "sets": 4, "reps": 10 }` |
| `DELETE` | `/workouts/:id` | Protected | User ownership verified automatically |

### 🥗 Nutrition, Water & Weight APIs
| Method | Endpoint | Access | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/meals` | Protected | Calculates daily totals (`calories`, `protein`, `carbs`, `fats`) |
| `POST` | `/meals` | Protected | `{ "name": "Oatmeal", "mealType": "Breakfast", "calories": 450, "protein": 30 }` |
| `GET` | `/water` | Protected | Calculates daily consumption vs 3000ml goal |
| `POST` | `/water` | Protected | `{ "amount": 500 }` |
| `GET` | `/weight` | Protected | Returns weight weigh-in history and net change |
| `POST` | `/weight` | Protected | `{ "weight": 74.5 }` |

### 🎯 Goals & Dashboard APIs
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/goals` | Protected | Returns active and completed fitness goals |
| `POST` | `/goals` | Protected | `{ "title": "Bench 100kg", "targetValue": 100, "deadline": "2026-12-31" }` |
| `GET` | `/dashboard` | Protected | **Aggregated single endpoint** returning user info, today's summary, weight progress, workout counts, macros, water %, and store recommendations. |

### 🛒 FitTrack Store E-Commerce APIs
| Method | Endpoint | Access | Description / Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Public | Query: `?search=whey&category=Protein%20Supplements&sortBy=price_asc` |
| `GET` | `/products/:id` | Public | Product details by ID |
| `POST` | `/products` | Admin | Create store product |
| `POST` | `/products/:id/reviews` | Protected | Verified buyer review submission |
| `GET` | `/cart` | Protected | Fetch user's cart |
| `POST` | `/cart` | Protected | `{ "productId": "<PRODUCT_ID>", "quantity": 1 }` |
| `POST` | `/orders` | Protected | Place checkout order; **server recalculates total & decrements stock** |
| `GET` | `/orders/myorders` | Protected | View user's order history |
| `GET` | `/orders/:id` | Protected | Order invoice & status timeline |
| `PUT` | `/orders/:id/cancel` | Protected | Cancel pending order & restock inventory |
| `GET` | `/orders` | Admin | List all customer store orders |
| `PUT` | `/orders/:id/status` | Admin | `{ "orderStatus": "Shipped" }` |
| `GET` | `/admin/store/stats` | Admin | Admin analytics & low stock warnings |

---

## 🔒 Security & Data Privacy Verification

- **User Data Isolation Test**:
  1. Register User A (`alex@example.com`) and User B (`sarah@example.com`).
  2. Create a workout log or order under User A.
  3. Attempt querying User A's workout/order ID using User B's JWT token.
  4. The API will respond with `403 Forbidden` / `404 Not Found`.

- **Server-Side E-Commerce Security**:
  - Frontend price values sent during checkout are ignored. The backend re-computes total order prices directly from MongoDB database records.
  - Product stock is checked before order creation and decremented atomically upon confirmation.

---

## 📝 Incremental Git Commit History

1. `Initialize FitTrack backend structure and configuration (.env, package.json)`
2. `Configure MongoDB connection and server entrypoint (db.js, server.js)`
3. `Add User model with bcrypt password hashing`
4. `Implement JWT authentication APIs and authMiddleware`
5. `Add user profile GET/PUT APIs and admin authorization middleware`
6. `Add Exercise and Workout models with user-isolated CRUD APIs`
7. `Add Meal, Water, Weight, and Goal models and controllers`
8. `Add FitTrack Store E-Commerce Product, Cart, Order, Wishlist, and Review models`
9. `Implement Store product search, filtering, cart management, and order stock reduction`
10. `Implement aggregated Dashboard controller and database seed script (seed.js)`
11. `Initialize React frontend with Vite, Routing, AuthContext, CartContext, and Cyber CSS theme`
12. `Build Navbar, Sidebar, Footer, StatCard, ProductCard, OrderTimeline, and ProtectedRoute components`
13. `Build Auth UI (Landing, Login, Register) and Dashboard UI`
14. `Build Fitness Management UI (Workouts, Exercises, Meals, Water, Weight, Goals, Profile)`
15. `Build FitTrack Store UI (StoreHome, ProductDetails, Cart, Checkout, MyOrders, Wishlist)`
16. `Build Admin Store Portal UI (AdminDashboard, AdminProducts, AdminOrders)`
17. `Complete README documentation and Postman API testing guide`
