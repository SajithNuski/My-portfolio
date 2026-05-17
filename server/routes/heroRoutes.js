import express from "express";
import { getHero, updateHero } from "../controllers/heroController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/hero", getHero);
router.put("/hero", protect, updateHero);

export default router;
