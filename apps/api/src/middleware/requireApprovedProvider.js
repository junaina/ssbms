import { ApiError } from "../utils/ApiError.js";
import { userRepo } from "../modules/users/user.repo.js";

export function requireApprovedProvider(req, res, next) {
  (async () => {
    const userId = req.user?.id;
    if (!userId) return next(new ApiError(401, "unauthorized"));

    const user = await userRepo.findById(userId).select("_id role isApproved");
    if (!user) return next(new ApiError(401, "unauthorized"));
    if (!user.isApproved) return next(new ApiError(403, "provider not approved"));

    next();
  })().catch(next);
}
