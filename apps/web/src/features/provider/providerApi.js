import { apiFetch } from "../../lib/http";

// SERVICES
export function providerListServices() {
  return apiFetch("/provider/services", { auth: true });
}

export function providerCreateService(payload) {
  return apiFetch("/provider/services", { method: "POST", auth: true, body: payload });
}

export function providerUpdateService(serviceId, patch) {
  return apiFetch(`/provider/services/${serviceId}`, { method: "PATCH", auth: true, body: patch });
}

export function providerDeleteService(serviceId) {
  return apiFetch(`/provider/services/${serviceId}`, { method: "DELETE", auth: true });
}

// BOOKINGS
export function providerListBookings() {
  return apiFetch("/provider/bookings", { auth: true });
}

export function providerUnbook(bookingId) {
  return apiFetch(`/provider/bookings/${bookingId}`, { method: "DELETE", auth: true });
}
export function providerFulfillBooking(bookingId) {
  return apiFetch(`/provider/bookings/${bookingId}/fulfill`, { method: "PATCH", auth: true });
}
