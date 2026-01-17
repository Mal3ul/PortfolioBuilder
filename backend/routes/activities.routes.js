// /backend/routes/activities.js
import express from "express";
import { getActivities } from "../controllers/activities.controller.js";

const router = express.Router();

// Récupérer l'historique d'activité
router.get("/:userId", getActivities);

export default router;
