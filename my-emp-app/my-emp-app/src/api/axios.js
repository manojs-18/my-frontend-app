import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalizes backend errors into a friendly message so components
// never need to inspect Axios/Java error shapes themselves.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Network error. Please check that the backend server is running.";
  }

  const { status, data } = error.response;

  // Spring Boot's default error body often has a "message" field.
  // Some of our controllers return a plain string on success/failure too.
  const backendMessage =
    (typeof data === "string" && data) ||
    data?.message ||
    data?.error ||
    null;

  switch (status) {
    case 400:
      return backendMessage || "Invalid request. Please check the form and try again.";
    case 404:
      return backendMessage || "The requested item was not found.";
    case 500:
      return "Something went wrong on the server. Please try again.";
    default:
      return backendMessage || fallback;
  }
}

export default api;
