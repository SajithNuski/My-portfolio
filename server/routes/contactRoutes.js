import express from "express";
import {
  sendMessage,
  getMessages,
  markRead,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/contact", sendMessage);
router.get("/contact", protect, getMessages);
router.put("/contact/:id/read", protect, markRead);

export default router;
