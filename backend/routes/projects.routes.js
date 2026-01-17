import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject
} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/:userId", getProjects);
router.post("/", addProject);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

export default router;
