import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const makeUpload = (subfolder) => {
  const uploadDir = path.join(__dirname, "..", "uploads", subfolder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname || "").toLowerCase();
      const baseName = path
        .basename(file.originalname || "image", extension)
        .replace(/[^a-z0-9-_]/gi, "-")
        .toLowerCase();
      cb(null, `${Date.now()}-${baseName}${extension}`);
    },
  });

  const fileFilter = (_req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Only image files are allowed"));
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }).single("image");
};

export const uploadCertificateImage = makeUpload("certificates");
export const uploadProjectImage = makeUpload("projects");
