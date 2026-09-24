import api from "./api";

// POST /auth/register -> { user, token }
export async function registerRequest({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return { user: data.user, token: data.token };
}

// POST /auth/login -> { user, token }
export async function loginRequest({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return { user: data.user, token: data.token };
}
