import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ALL_ROLES, ROLES } from "./user.constants.js";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, enum: ALL_ROLES, default: ROLES.CUSTOMER },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

//hash password changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password method
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// hide passwords in json responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);
