import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express(); //init express app
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*", //allow requests coming from any of the comma separated urls in the env
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "ssbms-api" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`api running on port ${PORT}`);
});
