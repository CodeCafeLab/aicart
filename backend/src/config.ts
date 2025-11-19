import dotenv from "dotenv";
dotenv.config();
export const PORT = parseInt(process.env.PORT || "4000", 10);
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:9002,http://127.0.0.1:9002";
export const ALLOWED_ORIGINS = CLIENT_ORIGIN.split(",").map((s) => s.trim());
