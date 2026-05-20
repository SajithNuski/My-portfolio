import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImageFile,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProjectImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/projects", getProjects);
router.post("/projects/upload-image", protect, uploadProjectImage, uploadProjectImageFile);
router.post("/projects", protect, createProject);
router.put("/projects/:id", protect, updateProject);
router.delete("/projects/:id", protect, deleteProject);

export default router;
