import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoManager } from "./config/MongoManager.ts";
import userRoutes from "./routes/userRoutes.ts";

dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to Mongo
await MongoManager.connect(process.env["MongoConnectionString"]!, "salon");

// Mount routes
app.use("/api/users", userRoutes);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
