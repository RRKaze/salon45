import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.ts";

dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/users", userRoutes);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
