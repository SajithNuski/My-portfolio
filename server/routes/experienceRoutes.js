import express from "express";
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/experience", getExperience);
router.post("/experience", protect, createExperience);
router.put("/experience/:id", protect, updateExperience);
router.delete("/experience/:id", protect, deleteExperience);

export default router;
