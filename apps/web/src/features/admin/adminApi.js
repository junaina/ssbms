import { apiFetch } from "../../lib/http";

// GET /admin/users?role=ALL|PROVIDER|CUSTOMER
export function adminListUsers(role = "ALL") {
  const q = role ? `?role=${encodeURIComponent(role)}` : "";
  return apiFetch(`/admin/users${q}`, { auth: true });
}

// PATCH /admin/users/:userId/approval
export function adminSetApproval(userId, isApproved) {
  return apiFetch(`/admin/users/${userId}/approval`, {
    method: "PATCH",
    auth: true,
    body: { isApproved },
  });
}

// DELETE /admin/users/:userId
export function adminDeleteUser(userId) {
  return apiFetch(`/admin/users/${userId}`, {
    method: "DELETE",
    auth: true,
  });
}
