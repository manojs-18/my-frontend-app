import api from "./api";

const orderService = {
  getMyOrders: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

export default orderService;
