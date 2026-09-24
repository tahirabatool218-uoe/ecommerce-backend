import api from "./api";

// Every cart endpoint answers with { cart } (items[].product is populated,
// except DELETE /cart which returns the emptied cart).
const unwrapCart = (response) => response.data?.cart ?? null;

// GET /cart -> { cart: { items: [...] } }
export async function fetchCart({ signal } = {}) {
  return unwrapCart(await api.get("/cart", { signal }));
}

// POST /cart { productId, quantity } -> { message, cart }
// The backend adds `quantity` to any existing line and enforces stock.
export async function addToCart({ productId, quantity }) {
  return unwrapCart(await api.post("/cart", { productId, quantity }));
}

// PUT /cart/:productId { quantity } -> { message, cart }  (sets the quantity)
export async function updateCartItem(productId, quantity) {
  return unwrapCart(await api.put(`/cart/${encodeURIComponent(productId)}`, { quantity }));
}

// DELETE /cart/:productId -> { message, cart }
export async function removeCartItem(productId) {
  return unwrapCart(await api.delete(`/cart/${encodeURIComponent(productId)}`));
}

// DELETE /cart -> { message, cart }
export async function clearCart() {
  return unwrapCart(await api.delete("/cart"));
}
