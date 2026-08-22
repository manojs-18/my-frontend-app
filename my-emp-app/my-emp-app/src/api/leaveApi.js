import api from "./axios";

const leaveApi = {
  getAll: () => api.get("/api/leaves"),
  getById: (id) => api.get(`/api/leaves/${id}`),
  getByEmployee: (employeeId) => api.get(`/api/leaves/employee/${employeeId}`),
  create: (leave) => api.post("/api/leaves", leave),
  update: (id, leave) => api.put(`/api/leaves/${id}`, leave),
  approve: (id) => api.put(`/api/leaves/${id}/approve`),
  reject: (id) => api.put(`/api/leaves/${id}/reject`),
  remove: (id) => api.delete(`/api/leaves/${id}`),
};

export default leaveApi;
