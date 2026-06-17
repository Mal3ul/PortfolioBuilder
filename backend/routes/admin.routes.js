import express from "express";
import {
  listUsers,
  listPortfolios,
  updateUserRole,
  deleteUser,
  deletePortfolio
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

// Toutes les routes admin nécessitent un token valide et le rôle admin.
router.use(verifyToken, requireRole("admin"));

router.get("/users", asyncHandler(listUsers));
router.get("/portfolios", asyncHandler(listPortfolios));
router.patch("/users/:userId/role", asyncHandler(updateUserRole));
router.delete("/users/:userId", asyncHandler(deleteUser));
router.delete("/portfolios/:portfolioId", asyncHandler(deletePortfolio));

export default router;
