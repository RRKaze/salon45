import "reflect-metadata";
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userServices from "./users/UserServices.ts";
import mongoDependencyInjection from "./mongo/DependencyInjection.ts";
import { container } from "tsyringe";

dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

mongoDependencyInjection.register(container);

const userRoutes = userServices.register(container);

// Mount routes
app.use("/api/users", userRoutes);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
