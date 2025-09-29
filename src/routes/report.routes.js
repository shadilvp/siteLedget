import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { siteReports } from "../controllers/report.controller.js";

const router = Router();

router.use(authMiddleware);

// GET all site reports for company
router.get("/sites", siteReports);

export default router;
