import { Router } from "express";
import { servicePublicController } from "./service.public.controller.js";

export const servicePublicRoutes = Router();

servicePublicRoutes.get("/", servicePublicController.search);
