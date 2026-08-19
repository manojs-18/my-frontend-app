import api from "./api";

const paymentService = {
  createPayment: (data) => api.post("/payments", data),
  getByOrderId: (orderId) => api.get(`/payments/order/${orderId}`),
  getAll: (params) => api.get("/payments", { params }),
};

export default paymentService;
