import { createContext, useContext, useEffect, useState, useCallback } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await cartService.getCart();
      setCartItems(res.data?.items || res.data?.cartItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartService.addItem({ productId, quantity });
    await fetchCart();
    return res.data;
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
    try {
      await cartService.updateItem(itemId, { quantity });
    } catch (err) {
      await fetchCart();
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await cartService.removeItem(itemId);
    } catch (err) {
      await fetchCart();
      throw err;
    }
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartContext;
