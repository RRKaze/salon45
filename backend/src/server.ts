import "reflect-metadata";
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { container } from "tsyringe";
import passport from "passport";
import userServices from "./users/UserServices.ts";
import mongoDependencyInjection from "./mongo/DependencyInjection.ts";
import authServices from "./auth/AuthServices.ts";
import { Session } from "./auth/configuration/Session.ts";

dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(Session.SessionHandler());
app.use(passport.authenticate("session"));
app.use(Session.MessagesHandler());

mongoDependencyInjection.register(container);

const userRoutes = userServices.register(container);
const authRoutes = authServices.register(container);

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
