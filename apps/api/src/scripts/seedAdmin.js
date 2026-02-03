import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../modules/users/user.model.js";
import { ROLES } from "../modules/users/user.constants.js";

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRSTNAME || "System";
  const lastName = process.env.ADMIN_LASTNAME || "Admin";

  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
  if (!email) throw new Error("Missing ADMIN_EMAIL");
  if (!password) throw new Error("Missing ADMIN_PASSWORD");

  await mongoose.connect(MONGODB_URI);
  console.log("DB connected");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists: ${existing.email}`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    password, // will be hashed by your pre('save') hook
    role: ROLES.ADMIN,
    isApproved: true,
  });

  console.log(`✅ Seeded admin: ${admin.email}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed admin failed:", err);
  try {
    await mongoose.disconnect();
  } catch {
    console.log("oop");
  }
  process.exit(1);
});
