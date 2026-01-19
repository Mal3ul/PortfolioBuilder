import express from "express";
import { getActivities, addActivity } from "../controllers/activities.controller.js";
import { verifyToken } from "./auth.routes.js";

const router = express.Router();

// Récupérer toutes les activités
router.get("/", verifyToken, getActivities);

// Ajouter une nouvelle activité
router.post("/", verifyToken, addActivity);

export default router;
