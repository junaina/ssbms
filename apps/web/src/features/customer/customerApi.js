import { apiFetch } from "../../lib/http";

// PUBLIC: browse services
export function searchServices(search = "") {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch(`/services${q}`, { auth: false });
}

// CUSTOMER: create booking
export function createBooking(payload) {
  return apiFetch("/bookings", { method: "POST", auth: true, body: payload });
}

// CUSTOMER: my bookings
export function listMyBookings() {
  return apiFetch("/bookings/my", { auth: true });
}
