const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('fittrack_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

export const api = {
  // Auth
  register: (userData) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Profile
  getProfile: () =>
    fetch(`${API_URL}/users/profile`, {
      headers: getHeaders()
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    }).then(handleResponse),

  // Dashboard Aggregation
  getDashboard: () =>
    fetch(`${API_URL}/dashboard`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Exercises
  getExercises: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/exercises?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  getExerciseById: (id) =>
    fetch(`${API_URL}/exercises/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  createExercise: (data) =>
    fetch(`${API_URL}/exercises`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateExercise: (id, data) =>
    fetch(`${API_URL}/exercises/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteExercise: (id) =>
    fetch(`${API_URL}/exercises/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Workouts
  getWorkouts: () =>
    fetch(`${API_URL}/workouts`, {
      headers: getHeaders()
    }).then(handleResponse),

  getWorkoutById: (id) =>
    fetch(`${API_URL}/workouts/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  createWorkout: (data) =>
    fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateWorkout: (id, data) =>
    fetch(`${API_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteWorkout: (id) =>
    fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Meals
  getMeals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/meals?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  createMeal: (data) =>
    fetch(`${API_URL}/meals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateMeal: (id, data) =>
    fetch(`${API_URL}/meals/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteMeal: (id) =>
    fetch(`${API_URL}/meals/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Water
  getWater: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/water?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  addWater: (data) =>
    fetch(`${API_URL}/water`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteWater: (id) =>
    fetch(`${API_URL}/water/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Weight
  getWeightHistory: () =>
    fetch(`${API_URL}/weight`, {
      headers: getHeaders()
    }).then(handleResponse),

  addWeight: (data) =>
    fetch(`${API_URL}/weight`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteWeight: (id) =>
    fetch(`${API_URL}/weight/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Goals
  getGoals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/goals?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  createGoal: (data) =>
    fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateGoal: (id, data) =>
    fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteGoal: (id) =>
    fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Store Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/products?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  getProductById: (id) =>
    fetch(`${API_URL}/products/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  createProduct: (data) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateProduct: (id, data) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteProduct: (id) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  addProductReview: (id, reviewData) =>
    fetch(`${API_URL}/products/${id}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    }).then(handleResponse),

  getProductReviews: (id) =>
    fetch(`${API_URL}/products/${id}/reviews`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Cart
  getCart: () =>
    fetch(`${API_URL}/cart`, {
      headers: getHeaders()
    }).then(handleResponse),

  addToCart: (productId, quantity = 1) =>
    fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity })
    }).then(handleResponse),

  updateCartItem: (productId, quantity) =>
    fetch(`${API_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity })
    }).then(handleResponse),

  removeFromCart: (productId) =>
    fetch(`${API_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  clearCart: () =>
    fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Orders
  createOrder: (orderData) =>
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    }).then(handleResponse),

  getMyOrders: () =>
    fetch(`${API_URL}/orders/myorders`, {
      headers: getHeaders()
    }).then(handleResponse),

  getOrderById: (id) =>
    fetch(`${API_URL}/orders/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  cancelOrder: (id) =>
    fetch(`${API_URL}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  getAllOrdersAdmin: () =>
    fetch(`${API_URL}/orders`, {
      headers: getHeaders()
    }).then(handleResponse),

  updateOrderStatusAdmin: (id, statusData) =>
    fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    }).then(handleResponse),

  // Wishlist
  getWishlist: () =>
    fetch(`${API_URL}/wishlist`, {
      headers: getHeaders()
    }).then(handleResponse),

  addToWishlist: (productId) =>
    fetch(`${API_URL}/wishlist/${productId}`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  removeFromWishlist: (productId) =>
    fetch(`${API_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Admin Store Stats
  getAdminStoreStats: () =>
    fetch(`${API_URL}/admin/store/stats`, {
      headers: getHeaders()
    }).then(handleResponse)
};
