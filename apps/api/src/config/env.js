import "dotenv/config";

export function getEnv(key, fallback) {
  const val = process.env[key];
  if (val === undefined || val === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing env var:${key} :/`);
  }
  return val;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: getEnv("MONGODB_URI"),
  CLIENT_ORIGIN: (process.env.CLIENT_ORIGIN ?? "*").split(",").map((s) => s.trim()),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
};
