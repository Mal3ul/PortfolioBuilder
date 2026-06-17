import express from "express";
import { getActivities, addActivity } from "../controllers/activities.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// Récupérer toutes les activités
router.get("/", verifyToken, asyncHandler(getActivities));

// Ajouter une nouvelle activité
router.post("/", verifyToken, asyncHandler(addActivity));

export default router;
