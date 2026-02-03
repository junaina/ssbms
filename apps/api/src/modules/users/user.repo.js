import { User } from "./user.model.js";
import { ROLES } from "./user.constants.js";
export const userRepo = {
  findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  },
  findById(id) {
    return User.findById(id);
  },
  create(data) {
    return User.create(data);
  },
  // Admin: list customers/providers only (never admins)
  listForAdmin(role) {
    const filter = { role: { $in: [ROLES.CUSTOMER, ROLES.PROVIDER] } };

    if (role && role !== "ALL") {
      filter.role = role; // CUSTOMER or PROVIDER
    }

    return User.find(filter)
      .select("_id firstName lastName email role isApproved")
      .sort({ createdAt: -1 });
  },

  // Admin: update approval flag
  setApproved(userId, isApproved) {
    return User.findByIdAndUpdate(userId, { $set: { isApproved } }, { new: true }).select(
      "_id firstName lastName email role isApproved",
    );
  },

  // Admin: delete user
  deleteById(userId) {
    return User.findByIdAndDelete(userId);
  },
};
