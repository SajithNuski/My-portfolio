import express from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/skills", getSkills);
router.post("/skills", protect, createSkill);
router.put("/skills/:id", protect, updateSkill);
router.delete("/skills/:id", protect, deleteSkill);

export default router;
