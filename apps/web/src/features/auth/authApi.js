import { apiFetch, clearToken, setToken } from "../../lib/http.js";

export async function register({ firstName, lastName, email, password, role }) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: { firstName, lastName, email, password, role },
  });
  //backend returns tokwn
  const token = res?.data?.token;
  if (token) setToken(token);
  return res.data;
}

export async function login({ email, password }) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  const token = res?.data?.token;
  if (token) setToken(token);
  return res.data;
}

export async function me() {
  const res = await apiFetch("/auth/me", { auth: true });
  return res.data;
}

export async function logout() {
  clearToken();
}
