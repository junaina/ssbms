import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return next(new ApiError(401, "no auth token"));
  const token = auth.slice("Bearer ".length);

  try {
    //verify jwt- signed by my secret and stll valid?
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "invalid jwt or expired jwt"));
  }
}
