import express from "express";
import { savePortfolio, getPortfolio, updatePortfolio, getUserPortfolio } from "../controllers/portfolio.controller.js";
import { verifyToken } from "./auth.routes.js";
import { requireSelfOrAdmin, requireAnyRole } from "../middleware/roles.js";

const router = express.Router();

router.get("/", verifyToken, getPortfolio);
router.get("/user/:userId", getUserPortfolio);
// Création/mise à jour: propriétaire (userId dans body) ou admin
router.post("/", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), savePortfolio);
router.put("/", verifyToken, requireAnyRole(['user','admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), updatePortfolio);

export default router;
