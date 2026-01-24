import { ApiError } from "../utils/ApiError.js";
export function errorHandler(err, req, res, next) {
  void next;
  const status = err instanceof ApiError ? err.statusCode : 500;
  res.status(status).json({
    ok: false,
    error: {
      message: err.message || "server error womp womp",
      details: err instanceof ApiError ? err.details : undefined,
    },
  });
}
