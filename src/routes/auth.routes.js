import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);   // POST /api/auth/register
router.post("/login", login);         // POST /api/auth/login
router.post("/refresh", refresh);     // POST /api/auth/refresh
router.post("/logout", logout);       // POST /api/auth/logout

export default router;
