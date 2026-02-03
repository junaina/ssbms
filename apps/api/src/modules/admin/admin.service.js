import { ApiError } from "../../utils/ApiError.js";
import { userRepo } from "../users/user.repo.js";
import { ROLES } from "../users/user.constants.js";

function normalizeRoleFilter(roleRaw) {
  const role = (roleRaw ?? "ALL").toString().toUpperCase();
  if (!["ALL", ROLES.CUSTOMER, ROLES.PROVIDER].includes(role)) {
    throw new ApiError(400, "invalid role filter (use ALL|CUSTOMER|PROVIDER)");
  }
  return role;
}

export const adminService = {
  async listUsers(roleRaw) {
    const role = normalizeRoleFilter(roleRaw);
    const users = await userRepo.listForAdmin(role);
    return users;
  },

  async setProviderApproval(userId, isApproved) {
    if (typeof isApproved !== "boolean") {
      throw new ApiError(400, "isApproved must be boolean");
    }

    const target = await userRepo.findById(userId);
    if (!target) throw new ApiError(404, "user not found");

    if (target.role !== ROLES.PROVIDER) {
      throw new ApiError(400, "only PROVIDER accounts can be approved/revoked");
    }

    const updated = await userRepo.setApproved(userId, isApproved);
    return updated;
  },

  async deleteUser(userId, requesterId) {
    const target = await userRepo.findById(userId);
    if (!target) throw new ApiError(404, "user not found");

    // Spec says delete provider/customer (not admin)
    if (target.role === ROLES.ADMIN) {
      throw new ApiError(400, "cannot delete admin users");
    }

    // Prevent self-delete to avoid locking yourself out
    if (target._id.toString() === requesterId) {
      throw new ApiError(400, "cannot delete yourself");
    }

    await userRepo.deleteById(userId);

    return { deletedId: userId };
  },
};
