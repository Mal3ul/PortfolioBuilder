import express from "express";
import {
  getSkills,
  addSkill,
  updateSkill,
  updateAllSkills,
  deleteSkill
} from "../controllers/skills.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAnyRole, requireSelfOrAdmin } from "../middleware/roles.js";

const router = express.Router();

// Récupérer les compétences d'un utilisateur
router.get("/:userId", asyncHandler(getSkills));

// Mettre à jour TOUTES les compétences (remplace complètement)
router.put("/", verifyToken, requireAnyRole(['user', 'admin']), asyncHandler(updateAllSkills));

// Ajouter une compétence
router.post("/", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(addSkill));

// Mettre à jour une compétence
router.put("/:skillId", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(updateSkill));

// Supprimer une compétence
router.delete("/:skillId", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(deleteSkill));

export default router;
