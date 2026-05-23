import express from "express";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  toggleCertificateVisibility,
  reorderCertificates,
  uploadCertificateImageFile,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCertificateImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/certificates", getCertificates);
router.patch("/certificates/reorder", protect, reorderCertificates);
router.patch(
  "/certificates/:id([0-9a-fA-F]{24})/toggle",
  protect,
  toggleCertificateVisibility,
);
router.post(
  "/certificates/upload-image",
  protect,
  uploadCertificateImage,
  uploadCertificateImageFile,
);
router.post("/certificates", protect, createCertificate);
router.put("/certificates/:id([0-9a-fA-F]{24})", protect, updateCertificate);
router.delete("/certificates/:id([0-9a-fA-F]{24})", protect, deleteCertificate);

export default router;
