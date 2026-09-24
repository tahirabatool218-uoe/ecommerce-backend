import api from "./api";

// GET /products -> { count, products: [...] }
export async function fetchProducts({ signal } = {}) {
  const { data } = await api.get("/products", { signal });
  return Array.isArray(data?.products) ? data.products : [];
}

// GET /products/:id -> { product: {...} }
export async function fetchProductById(id, { signal } = {}) {
  const { data } = await api.get(`/products/${encodeURIComponent(id)}`, { signal });
  return data?.product ?? null;
}

// POST /products (Admin) -> { message, product }
export async function createProduct(payload) {
  const { data } = await api.post("/products", payload);
  return data?.product ?? null;
}

// PUT /products/:id (Admin) -> { message, product }
export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${encodeURIComponent(id)}`, payload);
  return data?.product ?? null;
}

// DELETE /products/:id (Admin) -> { message }
export async function deleteProduct(id) {
  await api.delete(`/products/${encodeURIComponent(id)}`);
}
