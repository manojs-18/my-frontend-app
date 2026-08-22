import api from "./axios";

const salaryApi = {
  getAll: () => api.get("/api/salaries"),
  getById: (id) => api.get(`/api/salaries/${id}`),
  getByEmployee: (employeeId) => api.get(`/api/salaries/employee/${employeeId}`),
  create: (salary) => api.post("/api/salaries", salary),
  update: (id, salary) => api.put(`/api/salaries/${id}`, salary),
  remove: (id) => api.delete(`/api/salaries/${id}`),
};

export default salaryApi;
