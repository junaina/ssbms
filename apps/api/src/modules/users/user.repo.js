import { User } from "./user.model.js";
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
};
