import express from "express";
import { savePortfolio, getPortfolio, updatePortfolio, getUserPortfolio } from "../controllers/portfolio.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireSelfOrAdmin, requireAnyRole } from "../middleware/roles.js";

const router = express.Router();

router.get("/", verifyToken, asyncHandler(getPortfolio));
router.get("/user/:userId", asyncHandler(getUserPortfolio));
// Création/mise à jour: propriétaire (userId dans body) ou admin
router.post("/", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(savePortfolio));
router.put("/", verifyToken, requireAnyRole(['user', 'admin']), requireSelfOrAdmin({ inBody: true, paramKey: 'userId' }), asyncHandler(updatePortfolio));

export default router;
