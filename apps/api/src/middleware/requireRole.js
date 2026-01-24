import { ApiError } from "../utils/ApiError.js";
export function requireRole(...allowed) {
  return function (req, res, next) {
    if (!req.user?.role) return next(new ApiError(401, "unauthorized"));
    if (!allowed.includes(req.user.role)) return new new ApiError(403, "forbidden")();
    next();
  };
}
