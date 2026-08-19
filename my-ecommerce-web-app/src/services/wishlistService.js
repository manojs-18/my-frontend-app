import api from "./api";

const wishlistService = {
  getWishlist: () => api.get("/wishlist"),
  addItem: (productId) => api.post("/wishlist/items", { productId }),
  removeItem: (itemId) => api.delete(`/wishlist/items/${itemId}`),
};

export default wishlistService;
