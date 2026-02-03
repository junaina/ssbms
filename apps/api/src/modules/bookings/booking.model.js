import mongoose from "mongoose";
import { ALL_BOOKING_STATUS, BOOKING_STATUS } from "./booking.constants.js";

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ALL_BOOKING_STATUS,
      required: true,
      default: BOOKING_STATUS.PENDING,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
