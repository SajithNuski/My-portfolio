import express from "express";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/certificates", getCertificates);
router.post("/certificates", protect, createCertificate);
router.put("/certificates/:id", protect, updateCertificate);
router.delete("/certificates/:id", protect, deleteCertificate);

export default router;
