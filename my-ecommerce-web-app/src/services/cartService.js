import api from "./api";

const cartService = {
  getCart: () => api.get("/cart"),
  addItem: (data) => api.post("/cart/items", data),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete("/cart"),
};

export default cartService;
