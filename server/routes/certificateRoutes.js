import express from "express";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  uploadCertificateImageFile,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCertificateImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/certificates", getCertificates);
router.post(
  "/certificates/upload-image",
  protect,
  uploadCertificateImage,
  uploadCertificateImageFile,
);
router.post("/certificates", protect, createCertificate);
router.put("/certificates/:id", protect, updateCertificate);
router.delete("/certificates/:id", protect, deleteCertificate);

export default router;
