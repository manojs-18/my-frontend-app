import api from "./axios";

const employeeApi = {
  getAll: () => api.get("/api/employees"),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (employee) => api.post("/api/employees", employee),
  update: (id, employee) => api.put(`/api/employees/${id}`, employee),
  remove: (id) => api.delete(`/api/employees/${id}`),
};

export default employeeApi;
