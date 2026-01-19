// /backend/routes/skills.js
import express from "express";
import {
  getSkills,
  addSkill,
  updateSkill,
  updateAllSkills,
  deleteSkill
} from "../controllers/skills.controller.js";
import { verifyToken } from "./auth.routes.js";
import { requireAnyRole, requireSelfOrAdmin } from "../middleware/roles.js";

const router = express.Router();

// Récupérer les compétences d'un utilisateur
router.get("/:userId", getSkills);

// Mettre à jour TOUTES les compétences (remplace complètement)
router.put("/", verifyToken, requireAnyRole(['user','admin']), updateAllSkills);

// Ajouter une compétence
router.post("/", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), addSkill);

// Mettre à jour une compétence
router.put("/:skillId", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), updateSkill);

// Supprimer une compétence
router.delete("/:skillId", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), deleteSkill);

export default router;
