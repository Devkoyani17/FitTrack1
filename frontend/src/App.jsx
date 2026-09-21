import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Meals from './pages/Meals';
import WaterTracker from './pages/WaterTracker';
import WeightTracker from './pages/WeightTracker';
import Goals from './pages/Goals';
import StoreHome from './pages/StoreHome';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes inside Dashboard Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/meals" element={<Meals />} />
                <Route path="/water" element={<WaterTracker />} />
                <Route path="/weight" element={<WeightTracker />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/store" element={<StoreHome />} />
                <Route path="/store/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
