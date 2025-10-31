import { Router } from "express";
import { register, login, refresh, logout, logedComapny } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);   // POST /api/auth/register
router.post("/login", login);         // POST /api/auth/login
router.post("/refresh", refresh);     // POST /api/auth/refresh
router.post("/logout", logout);       // POST /api/auth/logout
router.get ("/companyin",authMiddleware,logedComapny)

export default router;
