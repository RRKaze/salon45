import { Router } from "express";
import { UserController } from "./controllers/UserController.ts";
import { AddUserService } from "./services/AddUserService.ts";
import { UserDataAccessor } from "./dataAccess/UserDataAccessor.ts";
import { GetUsersService } from "./services/GetUsersService.ts";
import { type DependencyContainer } from "tsyringe";

export class UserServices {
  public register(container: DependencyContainer): Router {
    const router = Router();

    container
      .register("IUserDataAccessor", { useClass: UserDataAccessor })
      .register("IAddUserService", { useClass: AddUserService })
      .register("IGetUsersService", { useClass: GetUsersService });

    const userController = container.resolve(UserController);

    router.get("/", (req, res) => userController.getUsers(req, res));
    router.post("/add", (req, res) => userController.addUser(req, res));

    return router;
  }
}

const userServices = new UserServices();
export default userServices;
