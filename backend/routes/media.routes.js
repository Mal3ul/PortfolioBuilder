import express from "express";
import { updateMedia } from "../controllers/media.controller.js";
import { verifyToken } from "./auth.routes.js";

const router = express.Router();

router.put("/", verifyToken, updateMedia);

export default router;
