import { Router } from "express";

import { authController } from "./auth.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

export const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", requireAuth, authController.me);
