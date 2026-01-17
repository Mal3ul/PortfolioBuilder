// /backend/routes/skills.js
import express from "express";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill
} from "../controllers/skills.controller.js";

const router = express.Router();

// Récupérer les compétences d'un utilisateur
router.get("/:userId", getSkills);

// Ajouter une compétence
router.post("/", addSkill);

// Mettre à jour une compétence
router.put("/:skillId", updateSkill);

// Supprimer une compétence
router.delete("/:skillId", deleteSkill);

export default router;
