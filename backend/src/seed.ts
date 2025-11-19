import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function run() {
  const adminEmail = "admin@aicart.local";
  const userEmail = "user@aicart.local";
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  await prisma.users.upsert({
    where: { email: adminEmail },
    update: { password_hash: adminPass, role: "admin", name: "Admin" },
    create: { email: adminEmail, password_hash: adminPass, role: "admin", name: "Admin", credits: 1000 },
  });

  await prisma.users.upsert({
    where: { email: userEmail },
    update: { password_hash: userPass, role: "user", name: "User" },
    create: { email: userEmail, password_hash: userPass, role: "user", name: "User", credits: 500 },
  });
}

run().finally(async () => {
  await prisma.$disconnect();
});