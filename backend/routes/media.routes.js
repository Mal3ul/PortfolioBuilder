import express from "express";
import { updateMedia } from "../controllers/media.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.put("/", verifyToken, asyncHandler(updateMedia));

export default router;
