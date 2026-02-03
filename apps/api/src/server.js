import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

//health check
app.get("/health", (req, res) => res.json({ ok: true, service: "ssbms-api" }));

//auth module- all routes inside authRoutes live under /auth
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);
await connectDB();
app.listen(env.PORT, () => {
  console.log(`api running on port ${env.PORT}`);
});
