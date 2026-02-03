import { asyncHandler } from "../../utils/asyncHandler.js";
import { servicePublicService } from "./service.public.service.js";

export const servicePublicController = {
  search: asyncHandler(async (req, res) => {
    const services = await servicePublicService.searchServices(req.query.search ?? "");
    res.json({ ok: true, services });
  }),
};
