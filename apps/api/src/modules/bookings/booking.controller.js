import { asyncHandler } from "../../utils/asyncHandler.js";
import { bookingService } from "./booking.service.js";

export const bookingController = {
  listProvider: asyncHandler(async (req, res) => {
    const bookings = await bookingService.listProviderBookings(req.user.id);
    res.json({ ok: true, bookings });
  }),

  unbook: asyncHandler(async (req, res) => {
    const result = await bookingService.unbook(req.user.id, req.params.bookingId);
    res.json({ ok: true, ...result });
  }),
  create: asyncHandler(async (req, res) => {
    const booking = await bookingService.createBooking(req.user.id, req.body ?? {});
    res.status(201).json({ ok: true, booking });
  }),

  listMine: asyncHandler(async (req, res) => {
    const bookings = await bookingService.listMyBookings(req.user.id);
    res.json({ ok: true, bookings });
  }),
  markFulfilled: asyncHandler(async (req, res) => {
    const booking = await bookingService.markFulfilled(req.user.id, req.params.bookingId);
    res.json({ ok: true, booking });
  }),
};
