import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
let prismaLocal: PrismaClient | undefined;
try {
  prismaLocal = globalForPrisma.prisma || new PrismaClient({ log: ["error"] });
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaLocal;
  }
} catch (err) {
  console.error("Prisma client initialization failed; continuing without DB.", err);
}
export const prisma = prismaLocal as PrismaClient;

export let dbAvailable = true;

export async function connectDB() {
  try {
    if (!prismaLocal) throw new Error("Prisma client not initialized");
    await prismaLocal.$connect();
    dbAvailable = true;
  } catch (err) {
    console.error("Database connection failed; running in dev fallback mode.", err);
    dbAvailable = false;
  }
}