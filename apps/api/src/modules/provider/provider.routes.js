import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { requireApprovedProvider } from "../../middleware/requireApprovedProvider.js";
import { ROLES } from "../users/user.constants.js";
import { serviceController } from "../services/service.controller.js";
import { bookingController } from "../bookings/booking.controller.js";

export const providerRoutes = Router();

// Protected with requireAuth + requireRole(PROVIDER)
// Also block if isApproved=false (recommended)
providerRoutes.use(requireAuth, requireRole(ROLES.PROVIDER), requireApprovedProvider);

// services
providerRoutes.get("/services", serviceController.listMine);
providerRoutes.patch("/services/:serviceId", serviceController.updateMine);
providerRoutes.delete("/services/:serviceId", serviceController.deleteMine);
providerRoutes.post("/services", serviceController.createMine);

// bookings
providerRoutes.get("/bookings", bookingController.listProvider);
providerRoutes.delete("/bookings/:bookingId", bookingController.unbook);
providerRoutes.patch("/bookings/:bookingId/fulfill", bookingController.markFulfilled);
