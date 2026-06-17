import express from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  me,
  changeEmail,
  changePassword
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPassword));
router.get("/me", verifyToken, asyncHandler(me));
router.post("/change-email", verifyToken, asyncHandler(changeEmail));
router.post("/change-password", verifyToken, asyncHandler(changePassword));

export default router;
