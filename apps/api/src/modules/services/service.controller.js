import { asyncHandler } from "../../utils/asyncHandler.js";
import { serviceService } from "./service.service.js";

export const serviceController = {
  listMine: asyncHandler(async (req, res) => {
    const services = await serviceService.listMyServices(req.user.id);
    res.json({ ok: true, services });
  }),

  updateMine: asyncHandler(async (req, res) => {
    const service = await serviceService.updateMyService(
      req.user.id,
      req.params.serviceId,
      req.body ?? {},
    );
    res.json({ ok: true, service });
  }),

  deleteMine: asyncHandler(async (req, res) => {
    const result = await serviceService.deleteMyService(req.user.id, req.params.serviceId);
    res.json({ ok: true, ...result });
  }),
  createMine: asyncHandler(async (req, res) => {
    const service = await serviceService.createMyService(req.user.id, req.body ?? {});
    res.status(201).json({ ok: true, service });
  }),
};
