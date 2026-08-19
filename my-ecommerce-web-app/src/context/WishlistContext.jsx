import { createContext, useContext, useEffect, useState, useCallback } from "react";
import wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await wishlistService.getWishlist();
      setWishlistItems(res.data?.items || res.data?.wishlistItems || []);
    } catch {
      // fail silently, keep previous state
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    await wishlistService.addItem(productId);
    await fetchWishlist();
  };

  const removeFromWishlist = async (itemId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await wishlistService.removeItem(itemId);
    } catch {
      await fetchWishlist();
    }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => (item.product?.id ?? item.productId) === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export default WishlistContext;
