import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  create,
  list,
  getById,
  update,
  softDelete,
  hardDelete,
} from "../controllers/site.controller.js";

const router = Router();

// All routes protected
router.use(authMiddleware);

router.post("/", create); // POST /api/sites
router.get("/", list); // GET /api/sites
router.get("/:id", getById); // GET /api/sites/:id
router.put("/:id", update); // PUT /api/sites/:id
router.delete("/soft/:id", softDelete); // Soft delete
router.delete("/hard/:id", hardDelete); // Hard delete

export default router;
