import api from "./api";

const userService = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
  forgotPassword: (data) => api.post("/users/forgot-password", data),
  logout: () => api.post("/users/logout"),
};

export default userService;
