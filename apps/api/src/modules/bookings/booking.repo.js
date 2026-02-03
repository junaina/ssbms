import { Booking } from "./booking.model.js";

export const bookingRepo = {
  listByProvider(providerId) {
    return Booking.find({ providerId })
      .sort({ createdAt: -1 })
      .populate("customerId", "firstName lastName email")
      .populate("serviceId", "title price duration");
  },

  deleteOwned(bookingId, providerId) {
    return Booking.findOneAndDelete({ _id: bookingId, providerId });
  },
  create(data) {
    return Booking.create(data);
  },

  listByCustomer(customerId) {
    return Booking.find({ customerId })
      .sort({ createdAt: -1 })
      .populate("serviceId", "title price duration")
      .populate("providerId", "firstName lastName email");
  },
  updateOwned(bookingId, providerId, patch) {
    return Booking.findOneAndUpdate({ _id: bookingId, providerId }, { $set: patch }, { new: true })
      .populate("customerId", "firstName lastName email")
      .populate("serviceId", "title price duration");
  },
};
