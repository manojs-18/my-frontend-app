import api from "./axios";

const userApi = {
  getAll: () => api.get("/api/users"),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (user) => api.post("/api/users", user),
  update: (id, user) => api.put(`/api/users/${id}`, user),
  remove: (id) => api.delete(`/api/users/${id}`),
};

export default userApi;
