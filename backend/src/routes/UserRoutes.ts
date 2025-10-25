import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { AddUserService } from "../services/users/AddUserService.ts";
import { UserDataAccessor } from "../dataAccess/UserDataAccessor.ts";
import { MongoManager } from "../config/MongoManager.ts";
import { GetUsersService } from "../services/users/GetUsersService.ts";

const router = Router();

const mongoManager = new MongoManager(
  process.env["MongoConnectionString"]!,
  "salon",
);
const userDataAccessor = new UserDataAccessor(mongoManager);
const addUserService = new AddUserService(userDataAccessor);
const getUsersService = new GetUsersService(userDataAccessor);
const userController = new UserController(addUserService, getUsersService);

router.get("/", (req, res) => userController.getUsers(req, res));
router.post("/add", (req, res) => userController.addUser(req, res));

export default router;
