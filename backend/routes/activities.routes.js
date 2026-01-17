import express from "express";
import { getActivities, addActivity } from "../controllers/activities.controller.js";

const router = express.Router();

// Récupérer toutes les activités
router.get("/", getActivities);

// Ajouter une nouvelle activité
router.post("/", addActivity);

export default router;
