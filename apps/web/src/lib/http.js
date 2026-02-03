const API_URL = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem("ssbms_token");
}

export function setToken(token) {
  localStorage.setItem("ssbms_token", token);
}

export function clearToken() {
  localStorage.removeItem("ssbms_token");
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const headers = { "content-type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${p}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error?.message || `request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}
