import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import activitiesRoutes from "./routes/activities.routes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/activities", activitiesRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));
