import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import heroRoutes from "./routes/heroRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

const configuredOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.FRONTEND_URL ||
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const vercelPreviewRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed =
        !origin ||
        localhostRegex.test(origin) ||
        configuredOrigins.includes(origin) ||
        vercelPreviewRegex.test(origin);

      callback(null, allowed ? true : false);
    },
    credentials: true,
  }),
);
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Connect to MongoDB
connectDB();

// Simple logger for project API requests to aid debugging
app.use((req, res, next) => {
  try {
    if (req.path && req.path.startsWith("/api/projects")) {
      console.log(
        "[proj-api]",
        req.method,
        req.path,
        "Authorization:",
        req.headers.authorization || "(none)",
      );
    }
  } catch (_e) {
    // swallow logging errors
  }
  next();
});

// Routes
app.use("/api", heroRoutes);
app.use("/api", projectRoutes);
app.use("/api", skillRoutes);
app.use("/api", experienceRoutes);
app.use("/api", certificateRoutes);
app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Sajith Portfolio API is running",
    health: "/api/health",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
