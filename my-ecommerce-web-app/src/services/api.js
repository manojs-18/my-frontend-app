import axios from "axios";

// Centralized Axios instance for all backend communication.
// Change baseURL here if your Spring Boot backend runs elsewhere.
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token (if present) to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize errors and handle 401 (session expired) globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Avoid redirect loop if already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message });
  }
);

export default api;
