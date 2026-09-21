import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [summary, setSummary] = useState({ itemCount: 0, subtotal: 0, discount: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      setSummary({ itemCount: 0, subtotal: 0, discount: 0, totalPrice: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await api.getCart();
      if (res.success) {
        setCart(res.data);
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.addToCart(productId, quantity);
      if (res.success) {
        await fetchCart();
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.updateCartItem(productId, quantity);
      if (res.success) {
        await fetchCart();
      }
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.removeFromCart(productId);
      if (res.success) {
        await fetchCart();
      }
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      await fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount: summary.itemCount || 0
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
