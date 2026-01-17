import express from "express";
import { savePortfolio, getPortfolio, updatePortfolio } from "../controllers/portfolio.controller.js";

const router = express.Router();

router.get("/", getPortfolio);
router.post("/", savePortfolio);
router.put("/", updatePortfolio);

export default router;
