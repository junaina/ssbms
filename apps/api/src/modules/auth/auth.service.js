import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import { userRepo } from "../users/user.repo.js";

import { ROLES } from "../users/user.constants.js";

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export const authService = {
  async register({ firstName, lastName, email, password, role }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new ApiError(409, "email is already in use");

    const safeRole = role ?? ROLES.CUSTOMER;

    //provider is unapproved from the get go
    const isApproved = safeRole === ROLES.PROVIDER ? false : true;
    const user = await userRepo.create({
      firstName,
      lastName,
      email,
      password,
      role: safeRole,
      isApproved,
    });
    const token = signToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new ApiError(401, "invalid credentials");
    const ok = await user.comparePassword(password);
    if (!ok) throw new ApiError(401, "invalid credentials");
    const token = signToken(user);
    return { user, token };
  },
  async me(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new ApiError(401, "unauthorized");
    return user;
  },
};
