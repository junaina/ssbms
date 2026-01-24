import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { authService } from "./auth.service.js";

function requireFields(body, fields) {
  for (const f of fields) {
    if (!body?.[f]) throw new ApiError(400, `Missing field: ${f}`);
  }
}

export const authController = {
  register: asyncHandler(async (req, res) => {
    requireFields(req.body, ["firstName", "lastName", "email", "password"]);
    const { user, token } = await authService.register(req.body);

    res.status(201).json({ ok: true, data: { user, token } });
  }),

  login: asyncHandler(async (req, res) => {
    requireFields(req.body, ["email", "password"]);
    const { user, token } = await authService.login(req.body);

    res.json({ ok: true, data: { user, token } });
  }),

  me: asyncHandler(async (req, res) => {
    // requireAuth middleware sets req.user
    const user = await authService.me(req.user.id);
    res.json({ ok: true, data: { user } });
  }),
};
