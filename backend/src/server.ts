import express from "express";
import cors from "cors";
import { ALLOWED_ORIGINS, PORT } from "./config";
import authRouter from "./routes/auth";
import { connectDB } from "./lib/prisma";

async function start() {
  await connectDB();
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log("Database connected");
  });
}

start();