import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import portfolioRoutes from "./routes/portfolio.routes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/portfolio", portfolioRoutes);

const PORT = 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
