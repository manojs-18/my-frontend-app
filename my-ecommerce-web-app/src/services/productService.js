import api from "./api";

const productService = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId, params) =>
    api.get(`/products/category/${categoryId}`, { params }),
  search: (query, params) =>
    api.get("/products/search", { params: { query, ...params } }),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export default productService;
