import "reflect-metadata";
import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userServices from "./users/UserServices.ts";
import mongoDependencyInjection from "./mongo/DependencyInjection.ts";
import { container } from "tsyringe";
import authServices from "./auth/AuthServices.ts";
import passport from "passport";
import session from "express-session";
//import MongoStore from "connect-mongo";

dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    //store: MongoStore.create({ mongoUrl: process.env["MongoConnectionString"]! })
  }),
);

app.use(passport.authenticate("session"));

app.use(function (req, res, next) {
  var msgs = (req as any).session.messages || [];
  (res.locals as any).messages = msgs;
  (res.locals as any).hasMessages = !!msgs.length;
  (req as any).session.messages = [];
  next();
});

mongoDependencyInjection.register(container);

const userRoutes = userServices.register(container);
const authRoutes = authServices.register(container);

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
