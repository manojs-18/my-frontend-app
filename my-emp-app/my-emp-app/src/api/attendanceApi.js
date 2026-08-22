import api from "./axios";

const attendanceApi = {
  getAll: () => api.get("/api/attendance"),
  getById: (id) => api.get(`/api/attendance/${id}`),
  getByEmployee: (employeeId) => api.get(`/api/attendance/employee/${employeeId}`),
  create: (attendance) => api.post("/api/attendance", attendance),
  update: (id, attendance) => api.put(`/api/attendance/${id}`, attendance),
  remove: (id) => api.delete(`/api/attendance/${id}`),
};

export default attendanceApi;
