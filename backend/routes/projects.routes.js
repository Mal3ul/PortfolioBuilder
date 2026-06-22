import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject
} from "../controllers/projects.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAnyRole, requireSelfOrAdmin } from "../middleware/roles.js";

const router = express.Router();

// Lecture publique par userId
router.get("/:userId", asyncHandler(getProjects));

// Création/mise à jour/suppression: auth + rôle user/admin + propriétaire via body.userId
router.post("/", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(addProject));
router.put("/:projectId", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(updateProject));
router.delete("/:projectId", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(deleteProject));

export default router;
