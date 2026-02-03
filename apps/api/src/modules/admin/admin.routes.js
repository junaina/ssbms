import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { ROLES } from "../users/user.constants.js";
import { adminController } from "./admin.controller.js";

export const adminRoutes = Router();

// All admin routes protected with requireAuth + requireRole(ADMIN)
adminRoutes.use(requireAuth, requireRole(ROLES.ADMIN));

adminRoutes.get("/users", adminController.listUsers);
adminRoutes.patch("/users/:userId/approval", adminController.setApproval);
adminRoutes.delete("/users/:userId", adminController.deleteUser);
