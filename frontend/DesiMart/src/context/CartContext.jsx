import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loadingCart, setLoadingCart] = useState(false);

  // Fetch Cart from Backend
  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoadingCart(true);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/cart/all', { withCredentials: true });
      // If the backend returns null or doesn't have items, default to empty items array
      setCart(response.data || { items: [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      // Don't show toast error here to avoid spamming on login/refresh issues
    } finally {
      setLoadingCart(false);
    }
  };

  // Synchronize cart when user authentication changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add Item to Cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.warn('Please sign in to add products to your cart.');
      return false;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/cart/add',
        { productId, quantity },
        { withCredentials: true }
      );
      setCart(response.data || { items: [] });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to add item to cart.';
      toast.error(errMsg);
      return false;
    }
  };

  // Update Item Quantity in Cart
  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return false;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/cart/update',
        { productId, quantity },
        { withCredentials: true }
      );
      setCart(response.data || { items: [] });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update item quantity.';
      toast.error(errMsg);
      return false;
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (productId) => {
    if (!user) return false;
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/cart/delete/${productId}`,
        { withCredentials: true }
      );
      setCart(response.data || { items: [] });
      toast.success('Product removed from cart.');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to remove item from cart.';
      toast.error(errMsg);
      return false;
    }
  };

  // Clear Cart
  const clearCart = async (silent = false) => {
    if (!user) return false;
    try {
      const response = await axios.put(
        'http://localhost:5000/api/v1/cart/clear',
        {},
        { withCredentials: true }
      );
      setCart(response.data || { items: [] });
      if (!silent) {
        toast.success('Cart cleared.');
      }
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to clear cart.';
      toast.error(errMsg);
      return false;
    }
  };

  // Derived state: total count of items in the cart
  const cartCount = cart && Array.isArray(cart.items)
    ? cart.items.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  const value = {
    cart,
    loadingCart,
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
