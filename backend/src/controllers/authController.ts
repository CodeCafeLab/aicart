import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma, dbAvailable } from "../lib/prisma";
import { JWT_SECRET } from "../config";

function issueToken(id: string, role: "admin" | "user") {
  return jwt.sign({ sub: id, role }, JWT_SECRET, { expiresIn: "7d" });
}

export async function loginAdmin(req: Request, res: Response) {
  const { email, password } = req.body || {};
  if (!dbAvailable) {
    if (email === "admin@aicart.local" && password === "admin123") {
      const token = issueToken("dev-admin", "admin");
      return res.json({
        token,
        user: { id: "dev-admin", email, role: "admin" },
      });
    }
    return res.status(401).json({ error: "invalid_credentials" });
  }
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || user.role !== "admin")
    return res.status(401).json({ error: "invalid_credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  const token = issueToken(user.id, "admin");
  return res.json({ token, user });
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body || {};
  if (!dbAvailable) {
    if (email === "user@aicart.local" && password === "user123") {
      const token = issueToken("dev-user", "user");
      return res.json({ token, user: { id: "dev-user", email, role: "user" } });
    }
    return res.status(401).json({ error: "invalid_credentials" });
  }
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || user.role !== "user")
    return res.status(401).json({ error: "invalid_credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  const token = issueToken(user.id, "user");
  return res.json({ token, user });
}

export async function signupUser(req: Request, res: Response) {
  const { email, password, name } = req.body || {};
  if (!dbAvailable) {
    if (!email || !password)
      return res.status(400).json({ error: "invalid_input" });
    const token = issueToken("dev-user", "user");
    return res
      .status(201)
      .json({
        token,
        user: { id: "dev-user", email, role: "user", name: name || email },
      });
  }
  const exists = await prisma.users.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "email_taken" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      email,
      password_hash: hash,
      role: "user",
      name: name || email,
      credits: 100,
    },
  });
  const token = issueToken(user.id, "user");
  return res.status(201).json({ token, user });
}
