import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectVisibility,
  reorderProjects,
  uploadProjectImageFile,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProjectImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/projects", getProjects);
router.post(
  "/projects/upload-image",
  protect,
  uploadProjectImage,
  uploadProjectImageFile,
);
router.patch("/projects/reorder", protect, reorderProjects);
router.patch("/projects/:id/toggle", protect, toggleProjectVisibility);
router.post("/projects", protect, createProject);
router.put("/projects/:id", protect, updateProject);
router.delete("/projects/:id", protect, deleteProject);

export default router;
