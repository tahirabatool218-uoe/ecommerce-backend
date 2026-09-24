import api from "./api";

// GET /orders/my-orders -> { count, orders: [...] }
export async function fetchMyOrders({ signal } = {}) {
  const { data } = await api.get("/orders/my-orders", { signal });
  return Array.isArray(data?.orders) ? data.orders : [];
}

// GET /orders/:id -> { order }
export async function fetchOrderById(id, { signal } = {}) {
  const { data } = await api.get(`/orders/${encodeURIComponent(id)}`, { signal });
  return data?.order ?? null;
}

// POST /orders { shippingAddress } -> { message, order }
// The order is built server-side from the user's cart, which is then emptied.
export async function createOrder({ shippingAddress }) {
  const { data } = await api.post("/orders", { shippingAddress });
  return data?.order ?? null;
}

// GET /orders (Admin) -> { count, orders: [...] }
export async function fetchAllOrders({ signal } = {}) {
  const { data } = await api.get("/orders", { signal });
  return Array.isArray(data?.orders) ? data.orders : [];
}

// PUT /orders/:id/status (Admin) -> { message, order }
export async function updateOrderStatus(id, status) {
  const { data } = await api.put(`/orders/${encodeURIComponent(id)}/status`, { status });
  return data?.order ?? null;
}
