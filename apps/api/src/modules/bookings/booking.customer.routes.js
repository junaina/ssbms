import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { ROLES } from "../users/user.constants.js";
import { bookingController } from "./booking.controller.js";

export const bookingCustomerRoutes = Router();

bookingCustomerRoutes.use(requireAuth, requireRole(ROLES.CUSTOMER));

bookingCustomerRoutes.post("/", bookingController.create);
bookingCustomerRoutes.get("/my", bookingController.listMine);
