import { Router } from "express";
import { loginAdmin, loginUser, signupUser } from "../controllers/authController";

const router = Router();

router.post("/login/admin", loginAdmin);
router.post("/login/user", loginUser);
router.post("/signup/user", signupUser);

export default router;