import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  create,
  list,
  getById,
  update,
  softDelete,
  hardDelete,
} from "../controllers/fund.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/:siteId", create); // Add fund
router.get("/:siteId", list); // List funds
router.get("/:siteId/:id", getById); // Get fund by ID
router.put("/:siteId/:id", update); // Update fund
router.delete("/soft/:siteId/:id", softDelete); // Soft delete fund
router.delete("/hard/:siteId/:id", hardDelete); // Hard delete fund

export default router;
