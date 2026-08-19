import api from "./api";

const adminService = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard"),

  // Users
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Categories
  getCategories: (params) => api.get("/admin/categories", { params }),
  createCategory: (data) => api.post("/admin/categories", data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Products
  getProducts: (params) => api.get("/admin/products", { params }),
  createProduct: (data) => api.post("/admin/products", data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Orders
  getOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // Payments
  getPayments: (params) => api.get("/admin/payments", { params }),
};

export default adminService;
