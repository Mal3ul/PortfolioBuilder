import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject
} from "../controllers/projects.controller.js";
import { verifyToken } from "./auth.routes.js";
import { requireAnyRole, requireSelfOrAdmin } from "../middleware/roles.js";

const router = express.Router();

// Lecture publique par userId si voulu; sinon, protéger aussi avec verifyToken + selfOrAdmin
router.get("/:userId", getProjects);

// Pour créer/mettre à jour/supprimer, exiger auth + rôle user/admin et vérifier propriétaire via body.userId
router.post("/", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), addProject);
router.put("/:projectId", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), updateProject);
router.delete("/:projectId", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), deleteProject);

export default router;
