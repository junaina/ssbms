import { ApiError } from "../../utils/ApiError.js";
import { bookingRepo } from "./booking.repo.js";
import { serviceRepo } from "../services/service.repo.js";
import { userRepo } from "../users/user.repo.js";
import { BOOKING_STATUS } from "./booking.constants.js";

function parseDateOrThrow(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new ApiError(400, "invalid date");
  return d;
}

export const bookingService = {
  async listProviderBookings(providerId) {
    return bookingRepo.listByProvider(providerId);
  },

  async unbook(providerId, bookingId) {
    const deleted = await bookingRepo.deleteOwned(bookingId, providerId);
    if (!deleted) throw new ApiError(404, "booking not found");
    return { deletedId: bookingId };
  },

  // ✅ Customer: create booking
  async createBooking(customerId, { serviceId, date }) {
    if (!serviceId) throw new ApiError(400, "serviceId is required");
    if (!date) throw new ApiError(400, "date is required");

    const when = parseDateOrThrow(date);

    const service = await serviceRepo.findById(serviceId);
    if (!service) throw new ApiError(404, "service not found");

    // ensure provider is approved
    const provider = await userRepo.findById(service.providerId).select("_id role isApproved");
    if (!provider) throw new ApiError(400, "invalid provider");
    if (!provider.isApproved) throw new ApiError(403, "provider not approved");

    const booking = await bookingRepo.create({
      customerId,
      serviceId: service._id,
      providerId: service.providerId, // derived from service
      date: when,
      status: BOOKING_STATUS.PENDING,
    });

    return booking;
  },

  // ✅ Customer: my bookings
  async listMyBookings(customerId) {
    return bookingRepo.listByCustomer(customerId);
  },
  async markFulfilled(providerId, bookingId) {
    const updated = await bookingRepo.updateOwned(bookingId, providerId, {
      status: BOOKING_STATUS.FULFILLED,
    });
    if (!updated) throw new ApiError(404, "booking not found");
    return updated;
  },
};
