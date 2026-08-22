import api from "./axios";

const departmentApi = {
  getAll: () => api.get("/api/departments"),
  getById: (id) => api.get(`/api/departments/${id}`),
  create: (department) => api.post("/api/departments", department),
  update: (id, department) => api.put(`/api/departments/${id}`, department),
  remove: (id) => api.delete(`/api/departments/${id}`),
};

export default departmentApi;
