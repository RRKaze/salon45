import "reflect-metadata";
import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { AddUserService } from "../services/users/AddUserService.ts";
import { UserDataAccessor } from "../dataAccess/UserDataAccessor.ts";
import { MongoManager } from "../config/MongoManager.ts";
import { GetUsersService } from "../services/users/GetUsersService.ts";
import { container } from "tsyringe";

const router = Router();

const mongoManager = new MongoManager(
  process.env["MongoConnectionString"]!,
  "salon",
);

container
  .register("IMongoManager", { useValue: mongoManager })
  .register("IUserDataAccessor", { useClass: UserDataAccessor })
  .register("IAddUserService", { useClass: AddUserService })
  .register("IGetUsersService", { useClass: GetUsersService });

const userController = container.resolve(UserController);

router.get("/", (req, res) => userController.getUsers(req, res));
router.post("/add", (req, res) => userController.addUser(req, res));

export default router;
