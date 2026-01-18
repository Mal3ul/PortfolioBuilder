import express from "express";
import { savePortfolio, getPortfolio, updatePortfolio } from "../controllers/portfolio.controller.js";
import { verifyToken } from "./auth.routes.js";

const router = express.Router();

router.get("/", verifyToken, getPortfolio);
router.post("/", verifyToken, savePortfolio);
router.put("/", verifyToken, updatePortfolio);

export default router;
