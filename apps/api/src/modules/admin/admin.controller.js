import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminService } from "./admin.service.js";

export const adminController = {
  listUsers: asyncHandler(async (req, res) => {
    const users = await adminService.listUsers(req.query.role);
    res.json({ ok: true, users });
  }),

  setApproval: asyncHandler(async (req, res) => {
    const updated = await adminService.setProviderApproval(req.params.userId, req.body?.isApproved);
    res.json({ ok: true, user: updated });
  }),

  deleteUser: asyncHandler(async (req, res) => {
    const result = await adminService.deleteUser(req.params.userId, req.user.id);
    res.json({ ok: true, ...result });
  }),
};
