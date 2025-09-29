import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  create,
  list,
  getById,
  update,
  softDelete,
  hardDelete,
} from "../controllers/spending.controller.js";

const router = Router();

router.use(authMiddleware);

// spendings belong to a site → nested routes
router.post("/:siteId", create); // Add spending
router.get("/:siteId", list); // List spendings for site
router.get("/:siteId/:id", getById); // Get one spending
router.put("/:siteId/:id", update); // Update spending
router.delete("/soft/:siteId/:id", softDelete); // Soft delete
router.delete("/hard/:siteId/:id", hardDelete); // Hard delete

export default router;
